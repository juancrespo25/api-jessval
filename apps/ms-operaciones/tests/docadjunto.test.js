const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');
const { GuiaEntity } = require('../src/module/adapters/guia/entities');
const { DocAdjuntoEntity } = require('../src/module/adapters/docadjunto/entities');

const guiaId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

test('POST /docadjuntos validates and inserts through the application and adapter', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let guiaExists = true;
  let failSave = false;
  const inserted = [];
  const guia = { id: guiaId };

  DataBaseBootstrapp.dataSource = {
    getRepository(entity) {
      if (entity === GuiaEntity) {
        return {
          async findOneBy(where) {
            assert.deepEqual(where, { id: guiaId });
            return guiaExists ? guia : null;
          },
        };
      }
      assert.equal(entity, DocAdjuntoEntity);
      return {
        create(data) {
          return data;
        },
        async save(data) {
          if (failSave) throw new Error('database unavailable');
          inserted.push(data);
          return { ...data, id: inserted.length };
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
    if (originalEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalEnv;
  });

  const post = (body) => fetch(`http://127.0.0.1:${server.address().port}/docadjuntos`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });

  for (const tipo of [1, 2, 3, 4, 5]) {
    const response = await post({ id_guia: guiaId, numero: 'F001-123', tipo });
    assert.equal(response.status, 201);
    assert.deepEqual((await response.json()).data, {
      id: tipo, id_guia: guiaId, numero: 'F001-123', tipo,
    });
    assert.deepEqual(inserted[tipo - 1], { id_guia: guia, numero: 'F001-123', tipo });
  }

  const maxLength = await post({ id_guia: guiaId, numero: 'X'.repeat(50), tipo: 1 });
  assert.equal(maxLength.status, 201);
  assert.equal((await maxLength.json()).data.numero.length, 50);

  for (const body of [
    {},
    [],
    { id_guia: 123, numero: 'X', tipo: 1 },
    { id_guia: 'not-a-uuid', numero: 'X', tipo: 1 },
    { id_guia: guiaId, numero: '', tipo: 1 },
    { id_guia: guiaId, numero: '   ', tipo: 1 },
    { id_guia: guiaId, numero: 'X'.repeat(51), tipo: 1 },
    { id_guia: guiaId, numero: 'X', tipo: 0 },
    { id_guia: guiaId, numero: 'X', tipo: 6 },
    { id_guia: guiaId, numero: 'X', tipo: 'FACTURA' },
    { id_guia: guiaId, numero: 'X', tipo: 1, id: 99 },
  ]) {
    const response = await post(body);
    assert.equal(response.status, 400, JSON.stringify(body));
    assert.equal((await response.json()).success, false);
  }
  assert.equal(inserted.length, 6);

  guiaExists = false;
  const notFound = await post({ id_guia: guiaId, numero: 'X', tipo: 1 });
  assert.equal(notFound.status, 404);
  assert.equal((await notFound.json()).success, false);
  assert.equal(inserted.length, 6);

  guiaExists = true;
  failSave = true;
  const failed = await post({ id_guia: guiaId, numero: 'X', tipo: 1 });
  assert.equal(failed.status, 500);
  assert.equal(inserted.length, 6);
});
