import { MigrationInterface, QueryRunner } from 'typeorm';

export class Configs1718910842052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`INSERT INTO configs (id, title, description, credits, module, role_assign) VALUES
      (1, 'check-phone', 'check phone data', 10, 'validate', 'user'),
      (2, 'validate-call', 'validate call data', 20, 'validate', 'premium'),
      (3, 'reverse-phone', 'reverse info phone', 10, 'validate', 'premium'),
      (4, 'validate-phone', 'validate info phone', 15, 'validate', 'user'),
      (5, 'check-url', 'check url data', 10, 'validate', 'user'),
      (6, 'check-account', 'check account status', 0, 'validate', 'admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
