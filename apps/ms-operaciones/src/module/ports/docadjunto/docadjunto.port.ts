import { DocAdjunto } from '../../applications/docadjunto/docadjunto';

export interface IDocAdjuntoPort {
  save(docAdjunto: DocAdjunto): Promise<DocAdjunto>;
}
