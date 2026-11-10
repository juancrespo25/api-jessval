const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const { DataSource } = require('typeorm');
const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');
const { GuiaEntity } = require('../src/module/adapters/guia/entities');

test('validateGuiaProvincia returns the number of attachments for the selected guide', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const source = new DataSource({
    type: 'mysql',
    database: 'test',
    entities: [path.join(__dirname, '..', 'src', 'module', 'adapters', '**', '*.entity.ts')],
  });
  await source.buildMetadatas();
  const repository = source.getRepository(GuiaEntity);
  const createQueryBuilder = repository.createQueryBuilder.bind(repository);
  let rawCount = '0';
  let sql;
  let parameters;
  repository.createQueryBuilder = (alias) => {
    const builder = createQueryBuilder(alias);
    builder.getRawOne = async () => {
      [sql, parameters] = builder.getQueryAndParameters();
      if (rawCount === null) return undefined;
      return {
        id_guia: 123,
        estado: 'PD',
        customer_name: 'Cliente',
        cantidad_docadjuntos: rawCount,
      };
    };
    return builder;
  };
  DataBaseBootstrapp.dataSource = source;

  const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
  });
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    DataBaseBootstrapp.dataSource = originalDataSource;
  });

  const get = () => fetch(`http://127.0.0.1:${server.address().port}/guias/validateGuiaProvincia/123`);

  for (const count of [0, 2]) {
    rawCount = String(count);
    const response = await get();
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.id_guia, 123);
    assert.equal(body.data.customer, 'Cliente');
    assert.equal(body.data.cantidad_docadjuntos, count);
    assert.match(sql, /SELECT COUNT\(\*\) FROM `docadjunto` `docadjunto` WHERE `docadjunto`\.`idGuiaId` = `guia`\.`id`/);
    assert.match(sql, /`guia`\.`id_guia` = \?/);
    assert.deepEqual(parameters, [123]);
  }

  rawCount = null;
  const notFound = await get();
  assert.equal(notFound.status, 500);
  assert.equal((await notFound.json()).success, false);
});
