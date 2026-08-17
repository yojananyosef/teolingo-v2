"use server";

import { db } from "@/infrastructure/database/db";
import { users } from "@/infrastructure/database/schema";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies, headers } from "next/headers";
import { DeleteAccountUseCase, UpdateProfileUseCase } from "./profile-use-cases";
import { GetAchievementsUseCase } from "./use-case";

async function resolveAppUrl(): Promise<string> {
  const serverUrl = process.env.APP_URL?.trim();
  if (serverUrl) {
    return serverUrl.replace(/\/+$/, "");
  }

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? "https";
    return `${proto}://${host}`;
  }

  const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (publicUrl) {
    return publicUrl.replace(/\/+$/, "");
  }

  return "http://localhost:3000";
}

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password)
      return {
        success: false,
        error: "Email y contraseña requeridos",
        code: "VALIDATION_ERROR",
      };

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user)
      return {
        success: false,
        error: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      };

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return {
        success: false,
        error: "Credenciales inválidas",
        code: "INVALID_CREDENTIALS",
      };

    const sessionData = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      points: user.points,
      level: user.level,
      streak: user.streak,
      role: user.role,
    };

    const token = await encrypt(sessionData);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return { success: true, data: { user: sessionData, token } };
  } catch (error) {
    console.error("loginAction error:", error);
    return { success: false, error: "Error interno", code: "INTERNAL_ERROR" };
  }
}

export async function registerAction(formData: FormData) {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const displayName = formData.get("displayName") as string;

    if (!email || !password || !displayName)
      return {
        success: false,
        error: "Todos los campos son requeridos",
        code: "VALIDATION_ERROR",
      };

    const [existing] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existing)
      return {
        success: false,
        error: "El email ya está registrado",
        code: "EMAIL_ALREADY_EXISTS",
      };

    const passwordHash = await bcrypt.hash(password, 10);
    const [user] = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        displayName,
        points: 0,
        level: 1,
        streak: 0,
      })
      .returning();

    const sessionData = {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      points: user.points,
      level: user.level,
      streak: user.streak,
      role: user.role,
    };

    const token = await encrypt(sessionData);
    (await cookies()).set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 2, // 2 hours
    });

    return { success: true, data: { user: sessionData, token } };
  } catch (error) {
    console.error("registerAction error:", error);
    return { success: false, error: "Error interno", code: "INTERNAL_ERROR" };
  }
}

export async function logoutAction() {
  (await cookies()).delete("session");
  return { success: true, data: undefined };
}

export async function getSessionAction() {
  return await getSession();
}

export async function getAchievementsAction() {
  const session = await getSession();
  if (!session) return { success: false, error: "No session", code: "UNAUTHORIZED" };

  const useCase = new GetAchievementsUseCase();
  const result = await useCase.execute(session.id);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
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
    .where(eq(users.id, session.id))
    .limit(1);

  return user;
}

export async function updateProfileAction(data: { displayName?: string; email?: string }) {
  const session = await getSession();
  if (!session) return { success: false, error: "No autorizado", code: "UNAUTHORIZED" };

  const useCase = new UpdateProfileUseCase();
  const result = await useCase.execute(session.id, data);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
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
  const result = await useCase.execute(session.id);

  if (result.isFailure()) {
    return {
      success: false,
      error: result.error.message,
      code: result.error.code,
    };
  }

  (await cookies()).delete("session");

  return { success: true, data: undefined };
}

export async function forgotPasswordAction(email: string, recoveryCode: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const masterCode = process.env.PASSWORD_RESET_MASTER_CODE?.trim();

    if (!normalizedEmail) {
      return { success: false, error: "El correo electrónico es requerido", code: "VALIDATION_ERROR" };
    }

    if (!masterCode) {
      console.error("PASSWORD_RESET_MASTER_CODE no está configurada en .env");
      return { success: false, error: "Configuración de recuperación no disponible", code: "INTERNAL_ERROR" };
    }

    if (!recoveryCode || recoveryCode.trim() !== masterCode) {
      return { success: false, error: "Código de recuperación inválido", code: "INVALID_RECOVERY_CODE" };
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    // Si el usuario no existe, devolvemos éxito por seguridad (evitar enumeración de emails)
    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 600)); // Prevenir timing attacks
      return {
        success: true,
        message: "Si el correo está registrado, podrás continuar con el restablecimiento.",
      };
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora de validez

    await db
      .update(users)
      .set({
        resetPasswordToken: token,
        resetPasswordExpiresAt: expiresAt,
      })
      .where(eq(users.id, user.id));

    const appUrl = await resolveAppUrl();
    const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

    return {
      success: true,
      message: "Código válido. Ya puedes cambiar la contraseña.",
      resetUrl,
    };
  } catch (error) {
    console.error("forgotPasswordAction error:", error);
    return { success: false, error: "Ocurrió un error interno al procesar la solicitud.", code: "INTERNAL_ERROR" };
  }
}

export async function resetPasswordAction(formData: FormData) {
  try {
    const token = formData.get("token") as string;
    const password = formData.get("password") as string;

    if (!token || !password) {
      return { success: false, error: "Todos los campos son requeridos", code: "VALIDATION_ERROR" };
    }

    if (password.length < 6) {
      return { success: false, error: "La contraseña debe tener al menos 6 caracteres", code: "VALIDATION_ERROR" };
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.resetPasswordToken, token))
      .limit(1);

    if (!user) {
      return {
        success: false,
        error: "El enlace de recuperación es inválido o ya ha sido utilizado.",
        code: "INVALID_TOKEN",
      };
    }

    const expiresAt = user.resetPasswordExpiresAt;
    if (expiresAt && expiresAt.getTime() < Date.now()) {
      // Limpiar token expirado
      await db
        .update(users)
        .set({
          resetPasswordToken: null,
          resetPasswordExpiresAt: null,
        })
        .where(eq(users.id, user.id));

      return {
        success: false,
        error: "El enlace de recuperación ha expirado. Por favor, solicita uno nuevo.",
        code: "EXPIRED_TOKEN",
      };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await db
      .update(users)
      .set({
        passwordHash,
        resetPasswordToken: null,
        resetPasswordExpiresAt: null,
      })
      .where(eq(users.id, user.id));

    return {
      success: true,
      message: "Tu contraseña ha sido restablecida con éxito.",
    };
  } catch (error) {
    console.error("resetPasswordAction error:", error);
    return { success: false, error: "Error interno al restablecer la contraseña.", code: "INTERNAL_ERROR" };
  }
}
