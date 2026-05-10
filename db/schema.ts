import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").default(""),
  day: text("day").notNull(),
  startTime: text("start_time").notNull(),
  duration: integer("duration").notNull(),
  priority: text("priority").notNull().default("neutral"),
  status: text("status").notNull().default("todo"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
