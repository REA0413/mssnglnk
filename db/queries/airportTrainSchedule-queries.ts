"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { InsertSchedule, SelectSchedule, airportTrainScheduleTable } from "../schema/airportTrainSchedule-schema";

export const createSchedule = async (data: InsertSchedule) => {
  try {
    const [newSchedule] = await db.insert(airportTrainScheduleTable).values(data).returning();
    return newSchedule;
  } catch (error) {
    console.error("Error creating schedule:", error);
    throw new Error("Failed to create schedule");
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const schedule = await db
      .select()
      .from(airportTrainScheduleTable)
      .where(eq(airportTrainScheduleTable.id, id))
      .limit(1);
    
    if (!schedule[0]) {
      throw new Error("Schedule not found");
    }
    return schedule[0];
  } catch (error) {
    console.error("Error getting schedule by ID:", error);
    throw new Error("Failed to get the schedule requested!");
  }
};

export const getAllSchedule = async (): Promise<SelectSchedule[]> => {
  return db.select().from(airportTrainScheduleTable);
};

export const updateSchedule = async (id: string, data: Partial<InsertSchedule>) => {
  try {
    const [updatedSchedule] = await db
      .update(airportTrainScheduleTable)
      .set(data)
      .where(eq(airportTrainScheduleTable.id, id))
      .returning();
    return updatedSchedule;
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw new Error("Failed to update schedule");
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    await db
      .delete(airportTrainScheduleTable)
      .where(eq(airportTrainScheduleTable.id, id));
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw new Error("Failed to delete schedule");
  }
};

export const getUniqueStations = async () => {
  const stationOrder = ['Manggarai', 'BNI City', 'Duri', 'Rawa Buaya', 'Batu Ceper'];
  try {
    const stations = await db
      .selectDistinct({ station: airportTrainScheduleTable.departureStation })
      .from(airportTrainScheduleTable);
    
    // Sort stations based on the predefined order
    return stations
      .map(s => s.station)
      .sort((a, b) => stationOrder.indexOf(a) - stationOrder.indexOf(b));
  } catch (error) {
    console.error("Error fetching stations:", error);
    throw new Error("Failed to fetch stations");
  }
};

export const getDepartureTimesByStation = async (station: string) => {
  try {
    const times = await db
      .select({ departureTime: airportTrainScheduleTable.departureTime })
      .from(airportTrainScheduleTable)
      .where(eq(airportTrainScheduleTable.departureStation, station))
      .orderBy(airportTrainScheduleTable.departureTime);
    
    return times.map(t => t.departureTime);
  } catch (error) {
    console.error("Error fetching departure times:", error);
    throw new Error("Failed to fetch departure times");
  }
};

export const getArrivalTimeByDepartureTime = async (departureTime: string) => {
  try {
    const schedule = await db
      .select({ arrivalTime: airportTrainScheduleTable.arrivalTime })
      .from(airportTrainScheduleTable)
      .where(eq(airportTrainScheduleTable.departureTime, departureTime))
      .limit(1);

    if (!schedule[0]) {
      throw new Error("No arrival time found for given departure time");
    }
    return schedule[0].arrivalTime;
  } catch (error) {
    console.error("Error fetching arrival time:", error);
    throw new Error("Failed to fetch arrival time");
  }
}; 