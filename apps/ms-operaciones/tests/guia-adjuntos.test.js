const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });

const { DataBaseBootstrapp } = require('../src/bootstrapp');
const { GuiaAdapter } = require('../src/module/adapters/guia/guia.adapter');
const { GuiaEntity } = require('../src/module/adapters/guia/entities');
const { DocAdjuntoEntity } = require('../src/module/adapters/docadjunto/entities');
const { Guia } = require('../src/module/applications/guia');
const { OrdenEntity } = require('../src/module/adapters/orden/entities');
const { MovimientoEntity } = require('../src/module/adapters/movimiento/entities/movimiento.entity');

const guiaId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

async function saveGuiaWith(docadjuntos) {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const savedDocs = [];

  DataBaseBootstrapp.dataSource = {
    async transaction(callback) {
      return callback({
        async findOne(entity, options) {
          assert.equal(entity, OrdenEntity);
          assert.deepEqual(options, { where: { id: 'orden-id' } });
          return { id: 'orden-id' };
        },
        async save(entity, value) {
          if (entity === GuiaEntity) {
            return Object.assign(value, { id: guiaId });
          }
          if (entity === DocAdjuntoEntity) {
            const docs = value.map((doc, index) => Object.assign(doc, { id: index + 1 }));
            savedDocs.push(...docs);
            return docs;
          }
          assert.equal(entity, MovimientoEntity);
          return value;
        },
      });
    },
  };

  try {
    const guia = new Guia({
      id_guia: 123,
      item: 1,
      orden: 'orden-id',
      destinatario: 1,
      direccion: 'Av. Principal 123',
      tarifa: 1,
      peso: 1,
      bultos: 1,
      unidades: 1,
      origen: '000001',
      destino: '000002',
      tenvio: 1,
      contenido: 'XX',
      userCreated: 'tester',
      docadjuntos,
    });

    return { result: await new GuiaAdapter().save(guia), savedDocs };
  } finally {
    DataBaseBootstrapp.dataSource = originalDataSource;
  }
}

test('GuiaAdapter.save persists the optional document attachment collection', async () => {
  const { result, savedDocs } = await saveGuiaWith([
    { numero: 'F001-123', tipo: 1 },
    { numero: 'B001-456', tipo: 2 },
  ]);

  assert.equal(savedDocs.length, 2);
  assert.deepEqual(savedDocs.map(({ id_guia, numero, tipo }) => ({
    id_guia: id_guia.id,
    numero,
    tipo,
  })), [
    { id_guia: guiaId, numero: 'F001-123', tipo: 1 },
    { id_guia: guiaId, numero: 'B001-456', tipo: 2 },
  ]);
  assert.deepEqual(result.properties.docadjuntos, [
    { id: 1, numero: 'F001-123', tipo: 1 },
    { id: 2, numero: 'B001-456', tipo: 2 },
  ]);
});

test('GuiaAdapter.save succeeds when document attachments are omitted', async () => {
  const { result, savedDocs } = await saveGuiaWith(undefined);

  assert.equal(savedDocs.length, 0);
  assert.deepEqual(result.properties.docadjuntos, []);
});
