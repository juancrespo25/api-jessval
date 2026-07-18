import { env } from "../../../env";
import { CenterCostGatewayPort } from "../../ports/centercost-gateway";

export class CenterCostGatewayAdapter implements CenterCostGatewayPort {
  async create(
    descripcion: string,
    cliente: string,
    status: boolean,
    contacto: string,
    email: string,
    telefono: string,
    user: string,
    password: string,
    userCreated: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${env.URL_CENTERCOST}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion,
          cliente,
          status,
          contacto,
          email,
          telefono,
          user,
          password,
          userCreated,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }

  async findAll(customer: string, status: boolean): Promise<any> {
    try {
      const url = new URL(env.URL_CENTERCOST);
      url.searchParams.append("status", status.toString());
      url.searchParams.append("customer", customer);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }
  async findById(code: string): Promise<any> {
    try {

        const responde = await fetch(`${env.URL_CENTERCOST}/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await responde.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }
  async findByName(name: string, customer: string): Promise<any> {
    try {
        const result = await fetch(`${env.URL_CENTERCOST}/name`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        body: JSON.stringify({
          name,
          customer}),
        });

        return await result.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }
  async update(
    descripcion: string,
    codigo: string,
    cliente: string,
    status: boolean,
    contacto: string,
    email: string,
    telefono: string,
    user: string,
    password: string,
    userUpdated: string,
  ): Promise<any> {
    try {

        const response = await fetch(`${env.URL_CENTERCOST}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ descripcion, codigo, cliente, status, contacto, email, telefono, user, password, userUpdated }),
        });

        return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }
  async delete(code: string, userDelete: string): Promise<any> {
    try {

        const result = await fetch(`${env.URL_CENTERCOST}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, userDelete }),
        });

        return await result.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to centercost service");
    }
  }
}
