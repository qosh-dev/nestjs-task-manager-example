import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TestService {
  constructor(public connection: DataSource) {}

  public async afterAll(): Promise<void> {
    try {
      const entities = this.connection.entityMetadatas;
      const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(", ");
      
      await this.connection.query(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
    } catch (error) {
      throw new Error(`ERROR: Cleaning test database: ${error}`);
    }
  }
}

export async function wait(milliseconds: number): Promise<boolean> {
  return new Promise((res) => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      res(true);
    }, milliseconds);
  });
}