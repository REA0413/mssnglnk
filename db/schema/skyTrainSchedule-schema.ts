import { pgTable, text, time, timestamp, uuid } from "drizzle-orm/pg-core";

export const skyTrainScheduleTable = pgTable("skyTrainSchedule", {
  id: uuid("id").defaultRandom().primaryKey(),
  departureStationSky: text("departureStationSky").notNull(),
  arrivalStationSky: text("arrivalStationSky").notNull(),
  departureTimeSky: time("departureTimeSky").notNull(),
  arrivalTimeSky: time("arrivalTimeSky").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type InsertSkySchedule = typeof skyTrainScheduleTable.$inferInsert;
export type SelectSkySchedule = typeof skyTrainScheduleTable.$inferSelect; 