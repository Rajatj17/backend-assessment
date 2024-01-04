import 'dotenv/config';

export const applicationConfig = {
  app: {
    port: parseInt(process.env.APP_PORT || '3000', 10),
  },

  db: {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    port: parseInt(process.env.DB_PORT, 10),
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.JWT_EXPIRY_SECONDS || '300', 10)
  }
}