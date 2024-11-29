CREATE TABLE IF NOT EXISTS "airportTrainSchedule" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"departureStation" text NOT NULL,
	"arrivalStation" text NOT NULL,
	"departureTime" time NOT NULL,
	"arrivalTime" time NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
