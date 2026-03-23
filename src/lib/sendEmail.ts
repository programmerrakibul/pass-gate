import nodemailer from "nodemailer";
import { envConfig } from "./envConfig";
import { TJwtPayload } from "@/types/jwt.types";
import { generateEmailVerificationToken } from "./jwt/generateToken.jwt";

const GOOGLE_APP_PASSWORD = envConfig.GOOGLE_APP_PASSWORD;
const EMAIL_FROM = envConfig.EMAIL_FROM;

if (!GOOGLE_APP_PASSWORD?.trim()) {
  throw new Error(
    "GOOGLE_APP_PASSWORD is not defined in the environment variables!",
  );
}

if (!EMAIL_FROM?.trim()) {
  throw new Error("EMAIL_FROM is not defined in the environment variables!");
}

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_FROM,
    pass: GOOGLE_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Transporter verification failed:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

export const sendVerificationEmail = async (user: TJwtPayload) => {
  try {
    const { email, _id } = user;

    const token = await generateEmailVerificationToken({ email, _id });
    const url = `${envConfig.CLIENT_URL}/api/auth/verify-email?token=${token}`;

    const message = await transporter.sendMail({
      from: `"PassGate" <support@pass-gate.com>`,
      to: user.email,
      subject: "Verify Your Email Address",
      html: ` <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
    
    <!-- Header with gradient -->
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: white; font-size: 28px; font-weight: 700; margin: 0; letter-spacing: -0.5px;">
        Verify Your Email
      </h1>
      <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 12px 0 0 0;">
        Complete your registration
      </p>
    </div>
    
    <!-- Main Content -->
    <div style="padding: 32px 24px;">
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Hello there!
      </p>
      
      <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
        Thanks for signing up! Please verify your email address to get started with your account.
      </p>
      
      <!-- Verification Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a 
          href="${url}" 
          style="display: inline-block; 
                 background-color: #10b981; 
                 color: white; 
                 padding: 14px 32px; 
                 font-size: 16px; 
                 font-weight: 600; 
                 text-decoration: none; 
                 border-radius: 8px; 
                 box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); 
                 transition: all 0.2s ease;"
          target="_blank"
        >
          Verify Email Address
        </a>
      </div>
      
      <!-- Alternative Link -->
      <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 8px; border-left: 4px solid #10b981;">
        <p style="color: #4b5563; font-size: 14px; margin: 0 0 8px 0;">
          <strong>Can't click the button?</strong> Copy and paste this link:
        </p>
        <p style="color: #10b981; font-size: 12px; word-break: break-all; margin: 0; font-family: monospace;">
          ${url}
        </p>
      </div>
      
      <!-- Expiry Notice -->
      <div style="background-color: #fef3c7; border-radius: 8px; padding: 12px 16px; margin: 24px 0;">
        <p style="color: #92400e; font-size: 14px; margin: 0; display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 18px;">⏰</span>
          <span>This verification link will expire in <strong>24 hours</strong></span>
        </p>
      </div>
      
      <!-- Security Note -->
      <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin-top: 24px;">
        If you didn't create an account with us, you can safely ignore this email.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
      <p style="color: #6b7280; font-size: 12px; margin: 0 0 8px 0;">
        &copy; ${new Date().getFullYear()} PassGate. All rights reserved.
      </p>
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">
        This is an automated message, please do not reply to this email.
      </p>
    </div>
  </div>
</body>
</html>`,
    });

    return message;
  } catch (error: unknown) {
    throw new Error(
      `Verification email sent failed: ${(error as Error).message}`,
    );
  }
};
