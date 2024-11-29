Cursor Backend Setup mssnglnk-app

Backend Setup Instructions

Use this guide to setup the backend for this project.
It uses Supabase, Drizzle ORM, and Server Actions.
Write the complete code for every step. Do not get lazy. Write everything that is needed.

On the frontend, I have set the Next.js as the main framework for this project. I want to use the App Router page management.
I want every page in this project to use the Johnston100 font.

Your goal is to completely finish the backend and frontend setup.


Helpful Links

If the user gets stuck, refer them to the following links:
- [Supabase Docs](https://supabase.com)
- [Drizzle Docs](https://orm.drizzle.team/docs/overview)
- [Drizzle with Supabase Quickstart](https://orm.drizzle.team/learn/tutorials/drizzle-with-supabase…)

Install Libraries

Make sure the user knows to install the following libraries:
```bash
npm i drizzle-orm dotenv postgres
npm i -D drizzle-kit
```

## Setup Steps

- [ ] Create a `/db` folder in the root of the project

- [ ] Create a `/types` folder in the root of the project

- [ ] Add a `drizzle.config.ts` file to the root of the project with the following code:

```ts
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

export default defineConfig({
schema: "./db/schema/index.ts",
out: "./db/migrations",
dialect: "postgresql",
dbCredentials: {
url: process.env.DATABASE_URL!
}
});
* Add a file called db.ts to the /db folder with the following code:
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { airportTrainScheduleTable } from "./schema";

config({ path: ".env.local" });

const schema = {
airportTrainScheduleTable
};

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
```

- [ ] Create 2 folders in the `/db` folder:
  - `/schema`
  - `/queries`

- [ ] Add a file called `index.ts` to the `/schema` folder

- [ ] Create a table in the `/schema` folder called `airportTrainSchedule-schema.ts` with the following code:

```ts
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const airportTrainScheduleTable = pgTable(“airportTrainSchedule”, {
id: uuid("id").defaultRandom().primaryKey(),
departureStation: text(“departureStation).notNull(),
departureTime: time(“departureTime”).notNull(),
arrivalTime: time(“arrivalTime”).notNull(),
createdAt: timestamp("created_at").defaultNow().notNull(),
updatedAt: timestamp("updated_at")
.notNull()
.defaultNow()
.$onUpdate(() => new Date())
});

export type InsertSchedule = typeof airportTrainScheduleTable.$inferInsert;
export type SelectSchedule = typeof airportTrainScheduleTable.$inferSelect;
```

* Export the airportTrain table in the /schema/index.ts file like so:
```ts
export * from “./airportTrainSchedule-schema";
```

* Create a new file called airportTrainSchedule-queries.ts in the /queries folder with the following code:

```ts
"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertSchedule, SelectSchedule } from "../schema/airportTrainSchedule-schema";
import { airportTrainScheduleTable } from "./../schema/airportTrainSchedule-schema";

export const createSchedule = async (data: InsertSchedule) => {
try {
const [newSchedule] = await db.insert(airportTrainScheduleTable).values(data).returning();
return newSchedule;
} catch (error) {
console.error("Error creating schedule:”, error);
throw new Error("Failed to create schedule ”);
}
};

export const getScheduleById = async (id: string) => {
try {
const schedule = await db.query.airportTrainScheduleTable.findFirst({
where: eq(http://airportTrainScheduleTable.id, id)
});
if (!schedule) {
throw new Error(“Schedule  not found");
}
return schedule ;
} catch (error) {
console.error("Error getting schedule by ID:", error);
throw new Error("Failed to get the schedule requested!“);
}
};

export const getAllSchedule = async (): Promise<SelectSchedule[]> => {
return db.query.airportTrainScheduleTable.findMany();
};

export const updateSchedule = async (id: string, data: Partial<InsertSchedule>) => {
try {
const [updatedSchedule] = await db.update(airportTrainScheduleTable).set(data).where(eq(http://airportTrainScheduleTable.id, id)).returning();
return updatedSchedule;
} catch (error) {
console.error("Error updating schedule:”, error);
throw new Error("Failed to update schedule ”);
}
};

export const deleteSchedule = async (id: string) => {
try {
await db.delete(airportTrainScheduleTable).where(eq(http://airportTrainScheduleTable.id, id));
} catch (error) {
console.error("Error deleting schedule:”, error);
throw new Error("Failed to delete schedule ”);
}
};
```

* In package.json, add the following scripts:

```json
"scripts": {
"db:generate": "npx drizzle-kit generate",
"db:migrate": "npx drizzle-kit migrate"
}
```

* Run the following command to generate the tables:

```bash
npm run db:generate
```
* Run the following command to migrate the tables:

```bash
npm run db:migrate
```

* Create a folder called `/actions` in the root of the project for server actions
* Create a folder called `/types` in the root of the project for shared types
* Create a file called `action-types.ts` in the `/types/actions` folder for server action types with the following code:
* Create file called `/types/index.ts` and export all the types from the `/types`    folder like so:

```ts
export * from "./action-types";
```

* Create a file called schedule-actions.ts in the /actions folder for the airportTrainScheduleTable’s actions:

```ts
"use server";

import { createSchedule, deleteSchedule, getAllSchedule, getScheduleById, updateSchedule } from "@/db/queries/schedule-queries";
import { InsertSchedule } from "@/db/schema/schedule-schema";
import { ActionState } from "@/types";
import { revalidatePath } from "next/cache";

export async function createScheduleAction(data: InsertSchedule): Promise<ActionState> {
try {
const newSchedule = await createSchedule(data);
revalidatePath(“/schedule”);
return { status: "success", message: “Schedule created successfully", data: newSchedule };
} catch (error) {
return { status: "error", message: "Failed to create schedule” };
}
}

export async function getScheduleByIdAction(id: string): Promise<ActionState> {
try {
const schedule = await getScheduleById(id);
return { status: "success", message: “Schedule retrieved successfully", data: schedule };
} catch (error) {
return { status: "error", message: "Failed to get schedule” };
}
}

export async function getAllScheduleAction(): Promise<ActionState> {
try {
const schedule = await getAllSchedule();
return { status: "success", message: “Schedule retrieved successfully", data: schedule };
} catch (error) {
return { status: "error", message: "Failed to get schedule” };
}
}

export async function updateScheduleAction(id: string, data: Partial<InsertSchedule>): Promise<ActionState> {
try {
const updatedSchedule = await updateSchedule(id, data);
revalidatePath(“/schedule”);
return { status: "success", message: “Schedule updated successfully", data: updatedSchedule };
} catch (error) {
return { status: "error", message: "Failed to update schedule” };
}
}

export async function deleteScheduleAction(id: string): Promise<ActionState> {
try {
await deleteSchedule(id);
revalidatePath(“/schedule”);
return { status: "success", message: “Schedule deleted successfully" };
} catch (error) {
return { status: "error", message: "Failed to delete schedule” };
}
}
```

* Create a file called action-types.ts in the `/types/actions` folder for server action types with the following code:

```ts
export type ActionState = {
status: "success" | "error";
message: string;
data?: any;
};
```

* Implement the server actions in the `/app/page.tsx` file to allow for manual testing.
* The backend is now setup.

Last but not least, on the `/src/app/page.tsx`, establish a simple form which will ask the website visitor about four things:
1. A dropdown which will has a label called “Departure Station”
2. A dropdown which will has a label called “Departure Time”
3. A dropdown which will has a label called “Arrival Station”
4. A free box which will require a visitor to set a time in a hh:mm format. The label of this box called “Expected Time”
