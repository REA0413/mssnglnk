"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertSkySchedule, SelectSkySchedule, skyTrainScheduleTable } from "../schema/skyTrainSchedule-schema";

export const createSkySchedule = async (data: InsertSkySchedule) => {
  try {
    const [newSchedule] = await db.insert(skyTrainScheduleTable).values(data).returning();
    return newSchedule;
  } catch (error) {
    console.error("Error creating sky train schedule:", error);
    throw new Error("Failed to create sky train schedule");
  }
};

export const getSkyScheduleById = async (id: string) => {
  try {
    const schedule = await db
      .select()
      .from(skyTrainScheduleTable)
      .where(eq(skyTrainScheduleTable.id, id))
      .limit(1);
    
    if (!schedule[0]) {
      throw new Error("Sky train schedule not found");
    }
    return schedule[0];
  } catch (error) {
    console.error("Error getting sky train schedule by ID:", error);
    throw new Error("Failed to get the sky train schedule requested!");
  }
};

export const getAllSkySchedule = async (): Promise<SelectSkySchedule[]> => {
  return db.select().from(skyTrainScheduleTable);
};

export const updateSkySchedule = async (id: string, data: Partial<InsertSkySchedule>) => {
  try {
    const [updatedSchedule] = await db
      .update(skyTrainScheduleTable)
      .set(data)
      .where(eq(skyTrainScheduleTable.id, id))
      .returning();
    return updatedSchedule;
  } catch (error) {
    console.error("Error updating sky train schedule:", error);
    throw new Error("Failed to update sky train schedule");
  }
};

export const deleteSkySchedule = async (id: string) => {
  try {
    await db
      .delete(skyTrainScheduleTable)
      .where(eq(skyTrainScheduleTable.id, id));
  } catch (error) {
    console.error("Error deleting sky train schedule:", error);
    throw new Error("Failed to delete sky train schedule");
  }
};

export const getAirportTerminals = async () => {
  const terminalOrder = ['Terminal 1', 'Terminal 2', 'Terminal 3'];
  try {
    const terminals = await db
      .selectDistinct({ terminal: skyTrainScheduleTable.arrivalStationSky })
      .from(skyTrainScheduleTable);
    
    return terminals
      .map(t => t.terminal)
      .sort((a, b) => terminalOrder.indexOf(a) - terminalOrder.indexOf(b));
  } catch (error) {
    console.error("Error fetching terminals:", error);
    throw new Error("Failed to fetch terminals");
  }
};

export const getNextSkyTrainTime = async (afterTime: string, terminal: string) => {
  try {
    const schedule = await db
      .select({
        departureTime: skyTrainScheduleTable.departureTimeSky,
        arrivalTime: skyTrainScheduleTable.arrivalTimeSky
      })
      .from(skyTrainScheduleTable)
      .where(eq(skyTrainScheduleTable.arrivalStationSky, terminal))
      .orderBy(skyTrainScheduleTable.departureTimeSky);

    const nextTrain = schedule.find(s => s.departureTime > afterTime);
    if (!nextTrain) {
      throw new Error("No available sky train found after the given time");
    }
    return nextTrain;
  } catch (error) {
    console.error("Error fetching sky train schedule:", error);
    throw new Error("Failed to fetch sky train schedule");
  }
}; 