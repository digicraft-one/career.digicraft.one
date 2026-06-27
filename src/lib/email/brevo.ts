import * as SibApiV3Sdk from "@getbrevo/brevo";
/** Strip optional quotes from .env values (e.g. `"noreply@digicraft.one"`). */
function env(name: string): string | undefined {
    const value = process.env[name]?.trim();
    if (!value) return undefined;
    return value.replace(/^["']|["']$/g, "");
}

function getTransactionalEmailsApi() {
    const apiKey = env("BREVO_API_KEY");
    if (!apiKey) {
        throw new Error("BREVO_API_KEY is not configured");
    }

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    apiInstance.setApiKey(
        SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
        apiKey
    );
    return apiInstance;
}

function logBrevoError(error: unknown) {
    const err = error as {
        response?: { status?: number; data?: { message?: string; code?: string } };
        message?: string;
    };
    const status = err.response?.status;
    const message =
        err.response?.data?.message || err.message || "Unknown Brevo error";

    console.error("Brevo email error:", { status, message, code: err.response?.data?.code });

    if (status === 401) {
        console.error(
            "Brevo 401: API key is invalid or disabled. In Brevo → Settings → SMTP & API, enable the key or create a new one with transactional email access."
        );
    }
}

export interface SendEmailPayload {
    to: { email: string; name?: string }[];
    subject: string;
    htmlContent: string;
}

export const EMAIL_WRAPPER = (content: string) => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f4f4;line-height:1.6;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;">
<tr><td align="center" style="padding:20px 0;">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width:600px;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
<tr><td style="background:#202124;padding:25px 20px;text-align:center;border-radius:8px 8px 0 0;">
<h1 style="color:#fff;font-size:22px;margin:0;">DigiCraft Careers</h1>
</td></tr>
<tr><td style="padding:25px 20px;">${content}</td></tr>
<tr><td style="padding:15px 20px;text-align:center;background:#f8f9fa;border-radius:0 0 8px 8px;">
<p style="color:#999;font-size:12px;margin:0;">© ${new Date().getFullYear()} DigiCraft Innovation Private Limited</p>
</td></tr>
</table></td></tr></table></body></html>`;

export async function sendEmail(options: SendEmailPayload) {
    try {
        const fromEmail = env("EMAIL_FROM_ADDRESS");
        const fromName = env("EMAIL_FROM_NAME");

        if (!env("BREVO_API_KEY")) {
            return { success: false, error: "API key not configured" };
        }
        if (!fromEmail || !fromName) {
            return { success: false, error: "Sender email not configured" };
        }

        const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
        sendSmtpEmail.to = options.to;
        sendSmtpEmail.subject = options.subject;
        sendSmtpEmail.htmlContent = options.htmlContent;
        sendSmtpEmail.sender = {
            name: fromName,
            email: fromEmail,
        };

        const apiInstance = getTransactionalEmailsApi();
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        return { success: true, data };
    } catch (error) {
        logBrevoError(error);
        return { success: false, error };
    }
}

export async function sendApplicationConfirmationEmail(data: {
    name: string;
    email: string;
    jobTitle: string;
}) {
    const content = `
<h2 style="color:#202124;margin:0 0 12px;">Thank you for applying</h2>
<p style="color:#5f6368;">Hi <strong>${data.name}</strong>,</p>
<p style="color:#5f6368;">We've received your application for <strong>${data.jobTitle}</strong>. Our hiring team will review it and contact you if your profile is a match for the next steps.</p>
<p style="color:#5f6368;">Best regards,<br/>DigiCraft Hiring Team</p>`;

    return sendEmail({
        to: [{ email: data.email, name: data.name }],
        subject: `Application received – ${data.jobTitle} | DigiCraft Careers`,
        htmlContent: EMAIL_WRAPPER(content),
    });
}

export async function sendNewApplicationAdminEmail(data: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    primarySkills: string;
    resumeUrl: string;
    adminLink: string;
}) {
    const adminEmail =
        env("ADMIN_NOTIFICATION_EMAIL") || "hello@digicraft.one";

    const content = `
<h2 style="color:#202124;margin:0 0 12px;">New career application</h2>
<p style="color:#5f6368;"><strong>${data.name}</strong> applied for <strong>${data.jobTitle}</strong>.</p>
<table style="width:100%;border-collapse:collapse;margin:16px 0;">
<tr><td style="padding:8px 0;color:#80868b;font-size:14px;">Email</td><td style="padding:8px 0;color:#202124;">${data.email}</td></tr>
<tr><td style="padding:8px 0;color:#80868b;font-size:14px;">Phone</td><td style="padding:8px 0;color:#202124;">${data.phone}</td></tr>
<tr><td style="padding:8px 0;color:#80868b;font-size:14px;">Skills</td><td style="padding:8px 0;color:#202124;">${data.primarySkills}</td></tr>
</table>
<p style="margin:16px 0;"><a href="${data.resumeUrl}" style="color:#1a73e8;">View resume</a> · <a href="${data.adminLink}" style="color:#1a73e8;">Review in admin</a></p>`;

    return sendEmail({
        to: [{ email: adminEmail, name: "DigiCraft Hiring" }],
        subject: `New application: ${data.jobTitle} – ${data.name}`,
        htmlContent: EMAIL_WRAPPER(content),
    });
}


export async function sendExternalNotification(data: {
    title: string;
    body: string;
    applicantName: string;
    applicantEmail: string;
    jobTitle: string;
    link: string;
}) {
    const apiKey = process.env.NOTIFICATION_API_KEY;
    if (!apiKey) {
        console.error("NOTIFICATION_API_KEY not configured");
        return { success: false };
    }

    try {
        const response = await fetch(
            "https://notification.digicraft.one/api/external/send-notification",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                },
                body: JSON.stringify({
                    title: data.title,
                    body: data.body,
                    data: {
                        applicantName: data.applicantName,
                        applicantEmail: data.applicantEmail,
                        jobTitle: data.jobTitle,
                        link: data.link,
                    },
                    sender: "Careers",
                }),
            }
        );
        return { success: response.ok };
    } catch (error) {
        console.error("External notification failed:", error);
        return { success: false, error };
    }
}
