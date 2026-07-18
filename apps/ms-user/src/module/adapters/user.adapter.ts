import { DataBaseBootstrapp } from '../../bootstrapp';
import { IUserPort } from '../ports';
import { User } from '../applications';
import { UserEntity } from './entities';
import { Repository } from 'typeorm';

export class UserAdapter implements IUserPort {
  private repository: Repository<UserEntity> | null = null;

  private getRepository(): Repository<UserEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error('Database connection not initialized');
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(UserEntity);
    }
    return this.repository;
  }
  async create(user: User): Promise<User> {
    const {
      codigo,
      nombres,
      apellidos,
      email,
      telefono,
      status,
      area,
      user_name,
      password,
      userCreated,
    } = user.properties;

    const entity = new UserEntity();

    Object.assign(entity, {
      codigo,
      nombres,
      apellidos,
      email,
      telefono,
      status,
      area,
      user_name,
      password,
      userCreated,
    });
    const saveEntity = await this.getRepository().save(entity);
    return new User({ ...user.properties, id: saveEntity.id, createdAt: saveEntity.createdAt });
  }
  async findAll(status?: boolean): Promise<User[]> {
    const whereClause = status !== undefined ? { status: status } : {};

    const users = await this.getRepository().find({
      where: whereClause,
      select: {
        id: true,
        codigo: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        status: true,
        area: true,
        userCreated: true,
        createdAt: true,
        userUpdated: true,
      },
    });
    if (!users) return [];
    return users.map(
      (user) =>
        new User({
          id: user.id,
          codigo: user.codigo,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          status: user.status,
          area: user.area,
          userCreated: user.userCreated,
          createdAt: user.createdAt,
          userUpdated: user.userUpdated,
        }),
    );
  }
  async findById(code: string): Promise<User | null> {
    const user = await this.getRepository().findOne({
      select: {
        id: true,
        codigo: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        status: true,
        area: true,
        userCreated: true,
        createdAt: true,
        userUpdated: true,
      },
      where: { codigo: code },
    });
    if (!user) return null;
    return new User({
      id: user.id,
      codigo: user.codigo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono,
      status: user.status,
      area: user.area,
      userCreated: user.userCreated,
      createdAt: user.createdAt,
      userUpdated: user.userUpdated,
    });
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.getRepository().findOne({
      select: {
        id: true,
        codigo: true,
        nombres: true,
        apellidos: true,
        email: true,
        telefono: true,
        status: true,
        password: true,
      },
      where: { user_name: username },
    });
    if (!user) return null;
    return new User({
      id: user.id,
      codigo: user.codigo,
      nombres: user.nombres,
      apellidos: user.apellidos,
      email: user.email,
      telefono: user.telefono,
      status: user.status,
      area: user.area,
      userCreated: user.userCreated,
      createdAt: user.createdAt,
      userUpdated: user.userUpdated,
      password: user.password,
    });
  }
  async findByName(name: string): Promise<User[]> {
    const users = await this.getRepository()
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.codigo',
        'user.nombres',
        'user.apellidos',
        'user.email',
        'user.telefono',
        'user.status',
        'user.area',
        'user.userCreated',
        'user.createdAt',
        'user.userUpdated',
      ])
      .where('UPPER(user.nombres) LIKE :name OR UPPER(user.apellidos) LIKE :name', {
        name: `%${name.toUpperCase()}%`,
      })
      .getMany();
    if (!users || users.length === 0) return [];
    return users.map(
      (user) =>
        new User({
          id: user.id,
          codigo: user.codigo,
          nombres: user.nombres,
          apellidos: user.apellidos,
          email: user.email,
          telefono: user.telefono,
          status: user.status,
          area: user.area,
          userCreated: user.userCreated,
          createdAt: user.createdAt,
          userUpdated: user.userUpdated,
        }),
    );
  }

  async findUserType(userType: string): Promise<User[]> {
    const users = await this.getRepository().find({
      where: { area: userType },
      select: {
        codigo: true,
        nombres: true,
        apellidos: true,
      },
    });
    if (!users || users.length === 0) return [];
    return users.map(
      (user) =>
        new User({
          codigo: user.codigo,
          nombre_completo: `${user.nombres} ${user.apellidos}`
        }),
    );
  }

  async update(user: User): Promise<User> {
    const {
      codigo,
      nombres,
      apellidos,
      email,
      telefono,
      status,
      area,
      user_name,
      password,
      userUpdated,
    } = user.properties;

    const result = await this.getRepository().findOne({ where: { codigo: codigo } });

    if (!result) return null;

    Object.assign(result, {
      nombres,
      apellidos,
      email,
      telefono,
      status,
      area,
      user_name,
      password,
      userUpdated,
      updatedAt: new Date(),
    });

    const updatedEntity = await this.getRepository().update({ id: result.id }, result);

    if (updatedEntity.affected === 0) return null;

    return new User({
      id: result.id,
      codigo: result.codigo,
      nombres: result.nombres,
      apellidos: result.apellidos,
      email: result.email,
      telefono: result.telefono,
      status: result.status,
      area: result.area,
      user_name: result.user_name,
      password: result.password,
      userCreated: result.userCreated,
      createdAt: result.createdAt,
      userUpdated: result.userUpdated,
    });
  }

  async delete(code: string, userUpdate: string): Promise<boolean> {
    const result = await this.getRepository().findOne({ where: { codigo: code } });

    if (!result) return false;
    const deleted = await this.getRepository().update(
      { id: result.id },
      {
        status: false,
        userInactive: userUpdate,
        inactiveAt: new Date(),
      },
    );
    if (deleted.affected === 0) return false;

    return true;
  }
}
