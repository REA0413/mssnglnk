import { pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const airportTrainScheduleTable = pgTable("airportTrainSchedule", {
  id: uuid("id").defaultRandom().primaryKey(),
  departureStation: text("departureStation").notNull(),
  arrivalStation: text("arrivalStation").notNull(),
  departureTime: time("departureTime").notNull(),
  arrivalTime: time("arrivalTime").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertSchedule = typeof airportTrainScheduleTable.$inferInsert;
export type SelectSchedule = typeof airportTrainScheduleTable.$inferSelect; 