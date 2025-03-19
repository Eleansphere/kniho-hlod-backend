import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // pro správné připojení na Renderu
    },
  },
  logging: false, // Vypne logování SQL dotazů
});

export default sequelize;
