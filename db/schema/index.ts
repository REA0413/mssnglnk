import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./airportTrainSchedule-schema";

const connectionString = process.env.DATABASE_URL!;

// For migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// For query purposes
const queryClient = postgres(connectionString);
export const db = drizzle(queryClient, { schema }); 