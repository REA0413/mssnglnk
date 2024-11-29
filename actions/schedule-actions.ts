"use server";

import { createSchedule, deleteSchedule, getAllSchedule, getScheduleById, updateSchedule, getUniqueStations, getDepartureTimesByStation, getArrivalTimeByDepartureTime } from "../db/queries/airportTrainSchedule-queries";
import { getAirportTerminals, getNextSkyTrainTime } from "../db/queries/skyTrainSchedule-queries";
import { InsertSchedule } from "../db/schema/airportTrainSchedule-schema";
import { ActionState } from "../types/action-types";
import { revalidatePath } from "next/cache";
import { addMinutes, parse, format } from 'date-fns';

async function calculateFinalEstimatedTime(departureTime: string, terminal: string) {
  try {
    const airportTrainArrival = await getArrivalTimeByDepartureTime(departureTime);
    console.log('Airport Train Arrival:', airportTrainArrival);

    const baseDate = parse(airportTrainArrival, 'HH:mm:ss', new Date());
    const firstTransitPeriod = format(addMinutes(baseDate, 7), 'HH:mm:ss');
    console.log('First Transit Period:', firstTransitPeriod);

    const nextSkyTrain = await getNextSkyTrainTime(firstTransitPeriod, terminal);
    console.log('Suggested Sky Train Time:', nextSkyTrain);
    
    const secondTransitPeriod = nextSkyTrain.arrivalTime;
    console.log('Second Transit Period:', secondTransitPeriod);

    const secondTransitDate = parse(secondTransitPeriod, 'HH:mm:ss', new Date());
    const finalEstimatedTime = format(addMinutes(secondTransitDate, 10), 'HH:mm:ss');
    console.log('Final Estimated Time:', finalEstimatedTime);

    return {
      airportTrainArrival,
      firstTransitPeriod,
      nextSkyTrain,
      secondTransitPeriod,
      finalEstimatedTime
    };
  } catch (error) {
    console.error('Error in time calculations:', error);
    throw new Error('Failed to calculate estimated times');
  }
}

export async function calculateTimesAction(data: {
  departureTime: string;
  terminal: string;
  expectedTime: string;
  language?: string;
}): Promise<ActionState> {
  try {
    const calculations = await calculateFinalEstimatedTime(
      data.departureTime,
      data.terminal
    );

    return {
      status: "success",
      message: "Times calculated successfully",
      data: calculations
    };
  } catch (error) {
    return { 
      status: "error", 
      message: data.language === 'id'
        ? "Jadwal kereta layang tidak ditemukan, silakan pilih jadwal kereta bandara yang lebih awal!"
        : "No sky train schedule found, please select earlier airport train schedule!"
    };
  }
}

export async function getScheduleByIdAction(id: string): Promise<ActionState> {
  try {
    const schedule = await getScheduleById(id);
    return { status: "success", message: "Schedule retrieved successfully", data: schedule };
  } catch (error) {
    return { status: "error", message: "Failed to get schedule" };
  }
}

export async function getAllScheduleAction(): Promise<ActionState> {
  try {
    const schedule = await getAllSchedule();
    return { status: "success", message: "Schedule retrieved successfully", data: schedule };
  } catch (error) {
    return { status: "error", message: "Failed to get schedule" };
  }
}

export async function updateScheduleAction(
  id: string,
  data: Partial<InsertSchedule>
): Promise<ActionState> {
  try {
    const updatedSchedule = await updateSchedule(id, data);
    revalidatePath("/");
    return { status: "success", message: "Schedule updated successfully", data: updatedSchedule };
  } catch (error) {
    return { status: "error", message: "Failed to update schedule" };
  }
}

export async function deleteScheduleAction(id: string): Promise<ActionState> {
  try {
    await deleteSchedule(id);
    revalidatePath("/");
    return { status: "success", message: "Schedule deleted successfully" };
  } catch (error) {
    return { status: "error", message: "Failed to delete schedule" };
  }
}

export async function getStationsAction(): Promise<ActionState> {
  try {
    const stations = await getUniqueStations();
    return { 
      status: "success", 
      message: "Stations retrieved successfully", 
      data: stations 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to get stations" 
    };
  }
}

export async function getDepartureTimesAction(station: string): Promise<ActionState> {
  try {
    const times = await getDepartureTimesByStation(station);
    return { 
      status: "success", 
      message: "Departure times retrieved successfully", 
      data: times 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to get departure times" 
    };
  }
}

export async function getTerminalsAction(): Promise<ActionState> {
  try {
    const terminals = await getAirportTerminals();
    return { 
      status: "success", 
      message: "Terminals retrieved successfully", 
      data: terminals 
    };
  } catch (error) {
    return { 
      status: "error", 
      message: "Failed to get terminals" 
    };
  }
} 