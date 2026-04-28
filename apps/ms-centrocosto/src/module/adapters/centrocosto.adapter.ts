import { DataBaseBootstrapp } from "../../bootstrapp";
import { ICentroCostoPort } from "../ports";
import { CentroCosto } from "../applications";
import { CentroCostoEntity } from "./entities";
import { Repository } from "typeorm";

export class CentroCostoAdapter implements ICentroCostoPort {
  private repository: Repository<CentroCostoEntity> | null = null;

  private getRepository(): Repository<CentroCostoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error("Database connection not initialized");
      }
      this.repository =
        DataBaseBootstrapp.dataSource.getRepository(CentroCostoEntity);
    }
    return this.repository;
  }
  async create(centroCosto: CentroCosto): Promise<CentroCosto> {
    const {
      descripcion,
      codigo,
      cliente,
      status,
      contacto,
      email,
      telefono,
      userCreated,
    } = centroCosto.properties;

    const entity = new CentroCostoEntity();
    Object.assign(entity, {
      descripcion,
      codigo,
      cliente,
      status,
      contacto,
      email,
      telefono,
      userCreated,
    });

    const saveEntity = await this.getRepository().save(entity);
    return new CentroCosto({
      ...centroCosto.properties,
      id: saveEntity.id,
      createdAt: saveEntity.createdAt,
    });
  }
  async findAll(status?: boolean): Promise<CentroCosto[]> {
    const whereClause = status !== undefined ? { status: status } : {};
    const centroCostos = await this.getRepository().find({
      where: whereClause,
      select: {
        id: true,
        descripcion: true,
        codigo: true,
        cliente: true,
        status: true,
        contacto: true,
        email: true,
        telefono: true,
        userCreated: true,
        createdAt: true,
      },
    });
    
    if (!centroCostos) return [];

    return centroCostos.map((centroCosto) => new CentroCosto({
        id: centroCosto.id,
        descripcion: centroCosto.descripcion,
        codigo: centroCosto.codigo,
        cliente: centroCosto.cliente,
        status: centroCosto.status,
        contacto: centroCosto.contacto,
        email: centroCosto.email,
        telefono: centroCosto.telefono,
        userCreated: centroCosto.userCreated,
        createdAt: centroCosto.createdAt,
    }));
  }
  async findById(code: string): Promise<CentroCosto | null> {
    const centroCosto = await this.getRepository().findOne({
     select: {
        id: true,
        descripcion: true,
        codigo: true,
        cliente: true,
        status: true,
        contacto: true,
        email: true,
        telefono: true,
        userCreated: true,
        createdAt: true,
      },
      where: { codigo: code },
    });
    if (!centroCosto) return null;
    return new CentroCosto({
      id: centroCosto.id,
      descripcion: centroCosto.descripcion,
      codigo: centroCosto.codigo,
      cliente: centroCosto.cliente,
      status: centroCosto.status,
      contacto: centroCosto.contacto,
      email: centroCosto.email,
      telefono: centroCosto.telefono,
      userCreated: centroCosto.userCreated,
      createdAt: centroCosto.createdAt,
    });
  }
  async findByName(name: string): Promise<CentroCosto[]> {
    
    const centroCosto = await this.getRepository()
    .createQueryBuilder("centrocosto")
    .where("centrocosto.descripcion ILIKE :name", { name: `%${name.toUpperCase()}%` })
    .getMany();
    if (!centroCosto || centroCosto.length === 0) return [];
    return centroCosto.map((cc) => new CentroCosto({
      id: cc.id,
      descripcion: cc.descripcion,
      codigo: cc.codigo,
      cliente: cc.cliente,
      status: cc.status,
      contacto: cc.contacto,
      email: cc.email,
      telefono: cc.telefono,
      userCreated: cc.userCreated,
      createdAt: cc.createdAt,
    }));
  }
  async update(centroCosto: CentroCosto): Promise<CentroCosto> {
     const {
      descripcion,
      codigo,
      cliente,
      status,
      contacto,
      email,
      telefono,
      userUpdated,
    } = centroCosto.properties;

    const result = await this.getRepository().findOne({ where: { codigo: codigo } });
    if (!result) return null;

    Object.assign(result, {
      descripcion,
      cliente,
      status,
      contacto,
      email,
      telefono,
       userUpdated,
       updatedAt: new Date(),
    });

    const updateEntity = await this.getRepository().update({ id: result.id }, result);
    
    if (updateEntity.affected === 0) return null;

    return new CentroCosto({
      id: result.id,
      descripcion: result.descripcion,
      codigo: result.codigo,
      cliente: result.cliente,
      status: result.status,
      contacto: result.contacto,
      email: result.email,
      telefono: result.telefono,
      userUpdated: result.userUpdated,
      updatedAt: result.updatedAt,
    });
  }
  async delete(code: string, userUpdate: string): Promise<boolean> {
   
    const result = await this.getRepository().findOne({ where: { codigo: code } });

    if (!result) return false;

    const centroCostoToUpdate = await this.getRepository().update({ id: result.id }, {
      status: false,
      userInactive: userUpdate,
      inactiveAt: new Date(),
    });
    if (centroCostoToUpdate.affected === 0) return false;
    return true;
  }
}
