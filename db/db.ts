import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { airportTrainScheduleTable } from "./schema/airportTrainSchedule-schema";

config({ path: ".env.local" });

const schema = {
airportTrainScheduleTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });