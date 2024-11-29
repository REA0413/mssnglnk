CREATE TABLE IF NOT EXISTS "skyTrainSchedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"departureStationSky" text NOT NULL,
	"arrivalStationSky" text NOT NULL,
	"departureTimeSky" time NOT NULL,
	"arrivalTimeSky" time NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
