import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

config({
  path: ".env.local",
});

const sql = neon(process.env.DB_URL!);
const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: "drizzle",
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
