"use server";

import { db } from "@/infrastructure/database/db";
import { users } from "@/infrastructure/database/schema";
import { encrypt, getSession } from "@/infrastructure/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { DeleteAccountUseCase, UpdateProfileUseCase } from "./profile-use-cases";
import { GetAchievementsUseCase } from "./use-case";

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

async function sendResetEmail(email: string, token: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const resetUrl = `${appUrl}/auth/reset-password?token=${token}`;

  console.log("\n==================================================");
  console.log("🔑 [TEOLINGO AUTH] ENLACE DE RECUPERACIÓN GENERADO");
  console.log(`Para: ${email}`);
  console.log(`Enlace: ${resetUrl}`);
  console.log("==================================================\n");

  if (!apiKey) {
    console.warn("⚠️ [TEOLINGO AUTH] RESEND_API_KEY no configurada. El correo se registró solo en consola.");
    return { success: true, logged: true, resetUrl };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "Teolingo <onboarding@resend.dev>",
        to: [email],
        subject: "Recupera tu contraseña - Teolingo",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #E5E5E5; border-radius: 28px; box-shadow: 0 4px 0 0 #E5E5E5; background-color: #FFFFFF;">
            <div style="text-align: center; margin-bottom: 20px;">
              <h2 style="color: #58CC02; font-size: 36px; font-weight: 900; tracking-tighter: -0.05em; margin: 0; font-family: sans-serif;">teolingo</h2>
              <p style="color: #777777; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 11px; margin: 5px 0 0 0;">Aprende idiomas bíblicos</p>
            </div>
            
            <h1 style="color: #4B4B4B; font-size: 22px; font-weight: 900; text-align: center; margin-bottom: 20px; text-transform: uppercase; letter-spacing: -0.02em;">Restablecer tu contraseña</h1>
            
            <p style="color: #4B4B4B; font-size: 16px; line-height: 1.5; font-weight: 700; margin-bottom: 15px;">¡Hola!</p>
            <p style="color: #777777; font-size: 15px; line-height: 1.6; font-weight: 700; margin-bottom: 25px;">Recibimos una solicitud para restablecer la contraseña de tu cuenta de Teolingo. Si fuiste tú, haz clic en el botón de abajo para elegir una nueva contraseña:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #1CB0F6; color: #FFFFFF; text-decoration: none; padding: 16px 32px; border-radius: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 15px; border-bottom: 4px solid #1899D6; display: inline-block; transition: background-color 0.2s;">Restablecer contraseña</a>
            </div>
            
            <p style="color: #777777; font-size: 13px; line-height: 1.6; font-weight: 700; text-align: center; margin-top: 25px;">Este enlace caducará en 1 hora por seguridad. Si no solicitaste este cambio, puedes ignorar este correo.</p>
            
            <hr style="border: 0; border-top: 2px solid #E5E5E5; margin: 30px 0;" />
            
            <p style="color: #AFAFAF; font-size: 11px; text-align: center; font-weight: 700; margin-bottom: 5px;">Si tienes problemas con el botón, copia y pega este enlace en tu navegador:</p>
            <p style="color: #1CB0F6; font-size: 12px; text-align: center; word-break: break-all; font-weight: 700; margin: 0;"><a href="${resetUrl}" style="color: #1CB0F6; text-decoration: none;">${resetUrl}</a></p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("❌ [TEOLINGO AUTH] Error de Resend API:", errText);
      return { success: false, error: errText, resetUrl };
    }

    const data = await res.json();
    console.log("✅ [TEOLINGO AUTH] Correo de recuperación enviado con éxito a través de Resend:", data);
    return { success: true, messageId: data.id, resetUrl };
  } catch (error) {
    console.error("❌ [TEOLINGO AUTH] Error de conexión al enviar correo:", error);
    return { success: false, error, resetUrl };
  }
}

export async function forgotPasswordAction(email: string) {
  try {
    const normalizedEmail = email.toLowerCase().trim();
    if (!normalizedEmail) {
      return { success: false, error: "El correo electrónico es requerido", code: "VALIDATION_ERROR" };
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
        message: "Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.",
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

    const emailResult = await sendResetEmail(normalizedEmail, token);

    return {
      success: true,
      message: "Si tu correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña en unos minutos.",
      devResetUrl: process.env.NODE_ENV !== "production" ? emailResult.resetUrl : undefined,
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
