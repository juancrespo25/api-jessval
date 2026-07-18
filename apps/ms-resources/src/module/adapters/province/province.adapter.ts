import { DataBaseBootstrapp } from "../../../bootstrapp";
import { IProvincePort } from "../../ports/province";
import { Province } from "../../applications/province";
import { ProvinciaEntity } from "./entities";
import { Repository } from "typeorm";

export class ProvinceAdapter implements IProvincePort {

  private repository: Repository<ProvinciaEntity> | null = null;

  private getRepository(): Repository<ProvinciaEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error("Database connection not initialized");
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(ProvinciaEntity);
    }
    return this.repository;
  }

  async findByAll(status: string): Promise<Province[]> {
    const provincias = await this.getRepository()
      .createQueryBuilder("provincia")
      .select(["provincia.codigo", "provincia.descripcion"])
      .where("UPPER(provincia.status) = :status", { status: status.toUpperCase() })
      .getMany();
    if (!provincias || provincias.length === 0) return [];
    
    return provincias.map((provincia) => new Province(provincia));
  }
}