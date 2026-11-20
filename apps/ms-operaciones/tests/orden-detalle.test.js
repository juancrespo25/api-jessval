const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');

test('GET /ordenes/:numero/detalle returns the order and its shipments', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const calls = [];
  let rows = [{
    numero: 656888,
    cliente: 'Cliente',
    centrocosto: 'Centro',
    origen: 'Lima - Lima - Miraflores',
    provincia_cubierta: 'Lima',
    fecha_registro: '2026-01-01T10:00:00.000Z',
    usuario: 'Ana - Perez',
    envios: [
      { id_guia: 1, nombres: 'Juan', direccion: 'Direccion 1', destino: 'Lima - Lima - Lima', estado: 'Pendiente' },
      { id_guia: 2, nombres: 'Maria', direccion: 'Direccion 2', destino: 'Lima - Lima - Surco', estado: 'Entregado' },
    ],
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
  const base = `http://127.0.0.1:${server.address().port}/ordenes`;
  const response = await fetch(`${base}/656888/detalle`);
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).data, rows[0]);
  assert.deepEqual(calls[0].parameters, [656888]);
  const sql = calls[0].sql;
  assert.match(sql, /WHERE o\.numero = \$1/);
  assert.match(sql, /p\.codigo = u\.codprovincia|u\.codprovincia = p\.codigo/);
  assert.match(sql, /o\."userCreated" = us\.codigo/);
  assert.match(sql, /d\.cliente = o\.customer AND d\.ccosto = o\.ccosto/);
  assert.match(sql, /WHERE g\.orden_id = o\.id/);
  assert.match(sql, /ORDER BY g\.item, g\.id/);
  assert.match(sql, /'estado', CASE g\.estado/);
  for (const [code, label] of [
    ['PD', 'Pendiente'], ['MT', 'Motivado'], ['EF', 'Entregado'],
    ['RT', 'Retorno'], ['DP', 'Despachado'], ['ET', 'En transito'],
  ]) {
    assert.ok(sql.includes(`WHEN '${code}' THEN '${label}'`));
  }
  assert.match(sql, /ELSE g\.estado/);
  assert.match(sql, /'destino', concat_ws\(' - ', ud\.departamento, ud\.provincia, ud\.distrito\)/);
  assert.match(sql, /'nombres', d\.nombres/);
  assert.match(sql, /'direccion', g\.direccion/);
  assert.match(sql, /'id_guia', g\.id_guia/);
  assert.match(sql, /concat_ws\(' - ', us\.nombres, us\.apellidos\) AS usuario/);
  assert.match(sql, /'\[\]'::json/);

  rows = [{ ...rows[0], envios: [] }];
  const sinEnvios = await fetch(`${base}/656888/detalle`);
  assert.equal(sinEnvios.status, 200);
  assert.deepEqual((await sinEnvios.json()).data.envios, []);

  rows = [];
  const noExiste = await fetch(`${base}/123/detalle`);
  assert.equal(noExiste.status, 404);
  assert.equal((await noExiste.json()).success, false);

  const count = calls.length;
  for (const value of ['abc', '-1', '1.5', '1e2', '2147483648', '1%20OR%201%3D1']) {
    const invalid = await fetch(`${base}/${value}/detalle`);
    assert.equal(invalid.status, 400, value);
    assert.equal((await invalid.json()).success, false);
  }
  assert.equal(calls.length, count);

  fail = true;
  const failed = await fetch(`${base}/656888/detalle`);
  assert.equal(failed.status, 500);
});
