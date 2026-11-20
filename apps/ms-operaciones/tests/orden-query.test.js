const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');

test('GET /ordenes/query validates filters and queries matching shipments', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const calls = [];
  let rows = [{
    id_guia: 123,
    cliente: 'Cliente',
    ccosto: 'Centro',
    nombres: 'Juan Perez',
    direccion: 'Av. Principal',
    destino: 'Lima - Lima - Surco',
    fecha_registro: '2026-11-18T23:59:59.999Z',
    estado: 'Pendiente',
    total_documentos: 2,
  }];
  let fail = false;
  DataBaseBootstrapp.dataSource = {
    getRepository() {
      return {
        async query(sql, parameters) {
          calls.push({ sql, parameters });
          if (fail) throw new Error('Database error');
          return rows;
        },
      };
    },
  };
  const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
  });
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    DataBaseBootstrapp.dataSource = originalDataSource;
  });
  const base = `http://127.0.0.1:${server.address().port}/ordenes/query`;
  const query = (params) => `${base}?${new URLSearchParams(params)}`;
  const fechas = { fecha_inicial: '2026-11-18', fecha_final: '2026-11-18' };

  const response = await fetch(query(fechas));
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, rows);
  assert.deepEqual(calls[0].parameters, ['2026-11-18', '2026-11-18']);
  const sql = calls[0].sql;
  assert.match(sql, /o\.fecha_registro >= \$1::date/);
  assert.match(sql, /o\.fecha_registro < \$2::date \+ INTERVAL '1 day'/);
  assert.match(sql, /cc\.cliente = o\.customer AND cc\.codigo = o\.ccosto/);
  assert.match(sql, /d\.cliente = o\.customer AND d\.ccosto = o\.ccosto AND d\.id = g\.destinatario/);
  assert.match(sql, /da\."idGuiaId" = g\.id/);
  assert.match(sql, /count\(\*\)::int/);
  for (const [estado, descripcion] of [
    ['PD', 'Pendiente'], ['MT', 'Motivado'], ['EF', 'Entregado'],
    ['RT', 'Retorno'], ['DP', 'Despachado'], ['ET', 'En transito'],
  ]) {
    assert.ok(sql.includes(`WHEN '${estado}' THEN '${descripcion}'`));
  }
  assert.match(sql, /ELSE g\.estado/);

  const nombre = "Juan' OR '1'='1";
  const filtros = {
    ...fechas, estado: 'PD', destino: '150101', origen: '150102',
    customer: 'C001', ccosto: 'CC01', numero: '656888', nombre,
  };
  const filtrado = await fetch(query(filtros));
  assert.equal(filtrado.status, 200);
  assert.deepEqual(calls[1].parameters, ['2026-11-18', '2026-11-18', 'PD', '150101', '150102', 'C001', 'CC01', 656888, nombre]);
  for (const [columna, indice] of [
    ['g.estado', 3], ['g.destino', 4], ['o.origen', 5],
    ['o.customer', 6], ['o.ccosto', 7], ['o.numero', 8],
  ]) assert.ok(calls[1].sql.includes(`${columna} = $${indice}`));
  assert.ok(!calls[1].sql.includes(nombre));
  assert.match(calls[1].sql, /UPPER\(d\.nombres\) LIKE '%' \|\| UPPER\(\$9\) \|\| '%'/);

  rows = [];
  const parcial = await fetch(query({ ...fechas, nombre: 'Juan Perez', destino: '150101' }));
  assert.equal(parcial.status, 200);
  assert.deepEqual((await parcial.json()).data, []);
  assert.deepEqual(calls[2].parameters, ['2026-11-18', '2026-11-18', '150101', 'Juan Perez']);
  assert.match(calls[2].sql, /g\.destino = \$3 AND UPPER\(d\.nombres\) LIKE '%' \|\| UPPER\(\$4\) \|\| '%'/);

  const caracteres = await fetch(query({ ...fechas, numero: '0', nombre: '50%_\\juan' }));
  assert.equal(caracteres.status, 200);
  assert.deepEqual(calls[3].parameters, ['2026-11-18', '2026-11-18', 0, '50\\%\\_\\\\juan']);
  assert.match(calls[3].sql, /o\.numero = \$3 AND UPPER\(d\.nombres\) LIKE '%' \|\| UPPER\(\$4\) \|\| '%'/);
  assert.ok(calls[3].sql.includes("ESCAPE E'\\\\'"));

  const numeroDocumento = "F001-123' OR '1'='1";
  const documento = await fetch(query({ ...fechas, numero: '656888', nombre: 'Juan', numero_documento: numeroDocumento }));
  assert.equal(documento.status, 200);
  assert.deepEqual(calls[4].parameters, ['2026-11-18', '2026-11-18', 656888, 'Juan', numeroDocumento]);
  assert.match(calls[4].sql, /EXISTS \(SELECT 1 FROM docadjunto da WHERE da\."idGuiaId" = g\.id AND da\.numero = \$5\)/);
  assert.ok(!calls[4].sql.includes(numeroDocumento));
  assert.match(calls[4].sql, /SELECT count\(\*\)::int FROM docadjunto da WHERE da\."idGuiaId" = g\.id/);
  assert.ok(!calls[0].sql.includes('EXISTS (SELECT 1 FROM docadjunto'));

  const antes = calls.length;
  for (const params of [
    {}, { fecha_inicial: '2026-11-18' },
    { fecha_inicial: '2026-02-29', fecha_final: '2026-03-01' },
    { fecha_inicial: '0000-01-01', fecha_final: '2026-01-01' },
    { fecha_inicial: '2026-13-01', fecha_final: '2026-12-01' },
    { fecha_inicial: '2026-11-18T00:00:00Z', fecha_final: '2026-11-18' },
    { fecha_inicial: '2026-11-19', fecha_final: '2026-11-18' },
    { ...fechas, nombre: '' }, { ...fechas, nombre: '   ' },
    { ...fechas, numero_documento: '' }, { ...fechas, numero_documento: '   ' },
    { ...fechas, numero_documento: 'a'.repeat(51) },
    { ...fechas, estado: 'PENDIENTE' }, { ...fechas, destino: '1234567' },
    ...['', '-1', '1.5', '1e2', '2147483648', '1 OR 1=1'].map((numero) => ({ ...fechas, numero })),
    { ...fechas, desconocido: 'valor' },
  ]) {
    const invalid = await fetch(query(params));
    assert.equal(invalid.status, 400, JSON.stringify(params));
    assert.equal((await invalid.json()).success, false);
  }
  const duplicado = await fetch(`${query(fechas)}&nombre=Juan&nombre=Maria`);
  assert.equal(duplicado.status, 400);
  const numeroDuplicado = await fetch(`${query(fechas)}&numero=1&numero=2`);
  assert.equal(numeroDuplicado.status, 400);
  const documentoDuplicado = await fetch(`${query(fechas)}&numero_documento=1&numero_documento=2`);
  assert.equal(documentoDuplicado.status, 400);
  assert.equal(calls.length, antes);

  fail = true;
  const failed = await fetch(query(fechas));
  assert.equal(failed.status, 500);
  assert.deepEqual(await failed.json(), {
    status: 500, success: false, message: 'Error querying ordenes',
  });
});
