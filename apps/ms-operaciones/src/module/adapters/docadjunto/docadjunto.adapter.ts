import { DataBaseBootstrapp } from '../../../bootstrapp';
import { DocAdjunto, GuiaNoEncontradaError } from '../../applications/docadjunto';
import { IDocAdjuntoPort } from '../../ports/docadjunto';
import { GuiaEntity } from '../guia/entities';
import { DocAdjuntoEntity } from './entities';

export class DocAdjuntoAdapter implements IDocAdjuntoPort {
  async save(docAdjunto: DocAdjunto): Promise<DocAdjunto> {
    const dataSource = DataBaseBootstrapp.dataSource;
    if (!dataSource) {
      throw new Error('Database connection not initialized');
    }

    const { id_guia, numero, tipo } = docAdjunto.properties();
    const guia = await dataSource.getRepository(GuiaEntity).findOneBy({ id: id_guia });
    if (!guia) {
      throw new GuiaNoEncontradaError(id_guia);
    }

    const repository = dataSource.getRepository(DocAdjuntoEntity);
    const entity = repository.create({ id_guia: guia, numero, tipo });
    const saved = await repository.save(entity);

    return new DocAdjunto({ id: saved.id, id_guia: guia.id, numero: saved.numero, tipo: saved.tipo });
  }
}
