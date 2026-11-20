import { Guia } from '../../applications/guia';

export interface GuiaDetalle {
  numero: number;
  item: number;
  cliente: string;
  ccosto: string;
  origen: string;
  destino: string;
  empresa: string | null;
  fecha_registro: Date | string;
  nombres: string;
  direccion: string;
  observaciones: string | null;
  peso: number;
  bultos: number;
  unidades: number;
  contenido: string;
  descripcion: string;
  imagen1: string | null;
  imagen2: string | null;
  imagen3: string | null;
  estado: string;
  total_documentos: number;
  usuario: string;
}

export interface IGuiaPort {
  save(guia: Guia): Promise<Guia>;
  validateGuia(id_guia: number): Promise<Guia | null>;
  validateGuiaProvincia(id_guia: number): Promise<Guia | null>;
  verGuia(id_guia: number): Promise<GuiaDetalle | null>;
}