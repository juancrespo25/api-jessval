const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');

test('GET /guias/:id_guia/detalle validates and returns the guide', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const calls = [];
  let rows = [{
    numero: 656888, item: 1, cliente: 'Cliente', ccosto: 'Centro',
    origen: 'Lima - Lima - Lima', destino: 'Lima - Lima - Surco',
    empresa: null, fecha_registro: '2026-01-01T10:00:00.000Z',
    nombres: 'Juan', direccion: 'Av. Principal', observaciones: null,
    peso: 1, bultos: 2, unidades: 3, contenido: 'Documento',
    descripcion: 'Regular', imagen1: 'guia.jpg', imagen2: null, imagen3: 'guia3.jpg',
    estado: 'Pendiente', total_documentos: 2, usuario: 'Ana - Perez',
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
  const base = `http://127.0.0.1:${server.address().port}/guias`;
  const response = await fetch(`${base}/123/detalle`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, rows[0]);
  assert.deepEqual(calls[0].parameters, [123]);
  const sql = calls[0].sql;
  assert.match(sql, /WHERE g\.id_guia = \$1/);
  assert.match(sql, /o\.customer = d\.cliente AND g\.destinatario = d\.id/);
  assert.match(sql, /o\.customer = cc\.cliente AND o\.ccosto = cc\.codigo/);
  assert.match(sql, /uo ON o\.origen = uo\.codigo/);
  assert.match(sql, /ud ON g\.destino = ud\.codigo/);
  assert.match(sql, /ct\.descripcion AS contenido, tp\.descripcion/);
  assert.match(sql, /g\.imagen AS imagen1, g\.imagen2, g\.imagen3/);
  assert.match(sql, /da\."idGuiaId" = g\.id/);
  assert.match(sql, /o\."userCreated" = us\.codigo/);
  for (const [code, label] of [
    ['PD', 'Pendiente'], ['MT', 'Motivado'], ['EF', 'Entregado'],
    ['RT', 'Retorno'], ['DP', 'Despachado'], ['ET', 'En transito'],
  ]) assert.ok(sql.includes(`WHEN '${code}' THEN '${label}'`));
  assert.match(sql, /ELSE g\.estado/);

  rows = [];
  const noExiste = await fetch(`${base}/999/detalle`);
  assert.equal(noExiste.status, 404);
  assert.equal((await noExiste.json()).success, false);

  const count = calls.length;
  for (const value of ['abc', '-1', '1.5', '1e2', '2147483648', '1%20OR%201%3D1']) {
    const invalid = await fetch(`${base}/${value}/detalle`);
    assert.equal(invalid.status, 400, value);
  }
  assert.equal(calls.length, count);

  fail = true;
  const failed = await fetch(`${base}/123/detalle`);
  assert.equal(failed.status, 500);
  assert.deepEqual(await failed.json(), {
    status: 500, success: false, message: 'Error retrieving guia',
  });
});
