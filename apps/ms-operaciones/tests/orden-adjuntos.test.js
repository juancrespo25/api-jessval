const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');
const { OrdenEntity } = require('../src/module/adapters/orden/entities');
const { GuiaEntity } = require('../src/module/adapters/guia/entities');
const { DocAdjuntoEntity } = require('../src/module/adapters/docadjunto/entities');
const { MovimientoEntity } = require('../src/module/adapters/movimiento/entities/movimiento.entity');

const guia = (id_guia) => ({
  id_guia,
  item: id_guia,
  destinatario: 1,
  destinatario_name: 'Destinatario',
  direccion: 'Av. Principal 123',
  tarifa: 10,
  peso: 5,
  bultos: 1,
  unidades: 1,
  origen: '150101',
  destino: '150102',
  tenvio: 1,
  contenido: 'ME',
  estado: 'PD',
  digitalizado: false,
});

test('POST /ordenes saves attachments only for their corresponding guides', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let docSaveCalls = [];
  let failDocSave = false;
  let committed = [];
  let transactions = 0;

  DataBaseBootstrapp.dataSource = {
    async transaction(callback) {
      transactions++;
      const pending = [];
      const result = await callback({
        async save(entity, value) {
          if (entity === OrdenEntity) {
            const order = Object.assign(value, { id: 'orden-uuid' });
            pending.push(order);
            return order;
          }
          if (entity === MovimientoEntity) {
            pending.push(value);
            return value;
          }
          if (entity === GuiaEntity) {
            const guides = value.map((item) => Object.assign(item, { id: `guia-${item.id_guia}` }));
            pending.push(...guides);
            return guides;
          }
          assert.equal(entity, DocAdjuntoEntity);
          docSaveCalls.push(value);
          if (failDocSave) throw new Error('attachment save failed');
          pending.push(...value);
          return value;
        },
      });
      committed = pending;
      return result;
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

  const post = (guias) => fetch(`http://127.0.0.1:${server.address().port}/ordenes`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      numero: 1,
      customer: 'CLIENTE',
      ccosto: 'CENTRO',
      provincia: 'LIMA',
      origen: '150101',
      userCreated: 'TESTER',
      guias,
    }),
  });

  const response = await post([
    { ...guia(1), docadjuntos: [{ numero: 'F001-123', tipo: 1 }, { numero: 'B001-456', tipo: 2 }] },
    guia(2),
    { ...guia(3), docadjuntos: [] },
    { ...guia(4), docadjuntos: [{ numero: 'G001-789', tipo: 3 }] },
  ]);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).success, true);
  assert.equal(docSaveCalls.length, 1);
  assert.deepEqual(docSaveCalls[0].map(({ id_guia, numero, tipo }) => ({
    guia: id_guia.id,
    numero,
    tipo,
  })), [
    { guia: 'guia-1', numero: 'F001-123', tipo: 1 },
    { guia: 'guia-1', numero: 'B001-456', tipo: 2 },
    { guia: 'guia-4', numero: 'G001-789', tipo: 3 },
  ]);

  docSaveCalls = [];
  const withoutDocs = await post([guia(5), { ...guia(6), docadjuntos: [] }]);
  assert.equal(withoutDocs.status, 200);
  assert.equal(docSaveCalls.length, 0);

  const beforeInvalid = transactions;
  const invalid = await post([{ ...guia(7), docadjuntos: [{ numero: '', tipo: 1 }] }]);
  assert.equal(invalid.status, 400);
  assert.equal(transactions, beforeInvalid);

  committed = [];
  failDocSave = true;
  const failed = await post([{ ...guia(8), docadjuntos: [{ numero: 'F001-789', tipo: 1 }] }]);
  assert.equal(failed.status, 500);
  assert.deepEqual(committed, []);
});
