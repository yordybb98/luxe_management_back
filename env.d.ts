// env.d.ts
declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string;
    ODOO_URL?: string;
    ODOO_DB?: string;
    ODOO_USERNAME?: string;
    ODOO_PASSWORD?: string;
  }
}
