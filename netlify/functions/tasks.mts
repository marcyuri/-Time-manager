import type { Config, Context } from "@netlify/functions";
import { eq, asc } from "drizzle-orm";
import { db } from "../../db/index.js";
import { tasks } from "../../db/schema.js";

export default async (req: Request, context: Context) => {
  const { id } = context.params;

  if (req.method === "GET") {
    const allTasks = await db.select().from(tasks).orderBy(asc(tasks.day), asc(tasks.startTime));
    return Response.json(allTasks);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const {
      id: taskId,
      title,
      description = "",
      day,
      startTime,
      duration,
      priority = "neutral",
      status = "todo",
    } = body;

    if (!taskId || !title || !day || !startTime || !duration) {
      return Response.json({ message: "Champs obligatoires manquants." }, { status: 400 });
    }

    const [task] = await db
      .insert(tasks)
      .values({ id: taskId, title, description, day, startTime, duration: Number(duration), priority, status })
      .returning();

    return Response.json(task, { status: 201 });
  }

  if (req.method === "PUT" && id) {
    const { title, description = "", day, startTime, duration, priority = "neutral", status = "todo" } =
      await req.json();

    const [task] = await db
      .update(tasks)
      .set({ title, description, day, startTime, duration: Number(duration), priority, status, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();

    if (!task) {
      return Response.json({ message: "Tâche introuvable." }, { status: 404 });
    }

    return Response.json(task);
  }

  if (req.method === "DELETE" && id) {
    await db.delete(tasks).where(eq(tasks.id, id));
    return new Response(null, { status: 204 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: ["/api/tasks", "/api/tasks/:id"],
};
