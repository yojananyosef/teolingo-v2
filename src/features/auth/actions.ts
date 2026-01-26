"use server";

import { db } from "@/infrastructure/database/db";
import { users } from "@/infrastructure/database/schema";
import { eq } from "drizzle-orm";
import { getSession, encrypt } from "@/infrastructure/lib/auth";
import { GetAchievementsUseCase } from "./use-case";
import { UpdateProfileUseCase, DeleteAccountUseCase } from "./profile-use-cases";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) return { success: false, error: "Email y contraseña requeridos", code: "VALIDATION_ERROR" };

  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user) return { success: false, error: "Credenciales inválidas", code: "INVALID_CREDENTIALS" };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return { success: false, error: "Credenciales inválidas", code: "INVALID_CREDENTIALS" };

  const sessionData = {
    userId: user.id,
    displayName: user.displayName,
    points: user.points,
    level: user.level,
    streak: user.streak,
  };

  const token = await encrypt(sessionData);
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return { success: true, data: { user: sessionData, token } };
}

export async function registerAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const displayName = formData.get("displayName") as string;

  if (!email || !password || !displayName) return { success: false, error: "Todos los campos son requeridos", code: "VALIDATION_ERROR" };

  const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { success: false, error: "El email ya está registrado", code: "EMAIL_ALREADY_EXISTS" };

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await db.insert(users).values({
    email,
    passwordHash,
    displayName,
    points: 0,
    level: 1,
    streak: 0,
  }).returning();

  const sessionData = {
    userId: user.id,
    displayName: user.displayName,
    points: user.points,
    level: user.level,
    streak: user.streak,
  };

  const token = await encrypt(sessionData);
  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2, // 2 hours
  });

  return { success: true, data: { user: sessionData, token } };
}

export async function logoutAction() {
  (await cookies()).delete("session");
  return { success: true, data: undefined };
}

export async function getAchievementsAction() {
  const session = await getSession();
  if (!session) return { success: false, error: "No session", code: "UNAUTHORIZED" };

  const useCase = new GetAchievementsUseCase();
  const result = await useCase.execute(session.userId);
  
  if (result.isFailure()) {
    return { success: false, error: result.error.message, code: result.error.code };
  }
  
  return { success: true, data: result.value };
}

export async function getUserStats() {
  const session = await getSession();
  if (!session) return null;

  const [user] = await db
    .select({
      points: users.points,
      level: users.level,
      streak: users.streak,
      displayName: users.displayName,
    })
    .from(users)
    .where(eq(users.id, session.userId))
    .limit(1);

  return user;
}

export async function updateProfileAction(data: { displayName?: string; email?: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new UpdateProfileUseCase();
  const result = await useCase.execute(session.userId, data);

  if (result.isFailure()) {
    return { 
      success: false, 
      error: result.error.message, 
      code: result.error.code 
    };
  }

  const user = result.value;

  // Update session cookie with new data
  const newToken = await encrypt({
    ...session,
    displayName: user.displayName,
  });
  
  (await cookies()).set("session", newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 2,
  });

  return { success: true, data: user };
}

export async function deleteAccountAction() {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new DeleteAccountUseCase();
  const result = await useCase.execute(session.userId);

  if (result.isFailure()) {
    return { 
      success: false, 
      error: result.error.message, 
      code: result.error.code 
    };
  }

  (await cookies()).delete("session");

  return { success: true, data: undefined };
}
