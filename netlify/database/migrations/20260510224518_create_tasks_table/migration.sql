CREATE TABLE "tasks" (
	"id" text PRIMARY KEY,
	"title" text NOT NULL,
	"description" text DEFAULT '',
	"day" text NOT NULL,
	"start_time" text NOT NULL,
	"duration" integer NOT NULL,
	"priority" text DEFAULT 'neutral' NOT NULL,
	"status" text DEFAULT 'todo' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
