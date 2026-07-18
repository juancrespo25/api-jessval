import { env } from '../../../env';
import { UserGatewayPort } from '../../ports/user-gateway';

export class UserGatewayAdapter implements UserGatewayPort {
  async create(
    nombres: string,
    apellidos: string,
    email: string,
    telefono: string,
    status: boolean,
    area: string,
    user_name: string,
    password: string,
    userCreated: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombres,
          apellidos,
          email,
          telefono,
          status,
          area,
          user_name,
          password,
          userCreated,
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async findAll(status: boolean): Promise<any> {
    try {
      const url = new URL(env.URL_USER);
      url.searchParams.append('status', status.toString());
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async findUserType(userType: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}/type/${userType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async findById(code: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}/${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async findByUsername(username: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}/username/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async findByName(name: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}/name/${name}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async update(
    codigo: string,
    nombres: string,
    apellidos: string,
    email: string,
    telefono: string,
    status: boolean,
    area: string,
    user_name: string,
    password: string,
    userUpdated: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }

  async delete(code: string, userDeleted: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_USER}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userDeleted }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error connecting to user service:', error);
      throw new Error('Failed to connect to user service');
    }
  }
}
