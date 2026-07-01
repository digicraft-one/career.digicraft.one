import { formatISTNow } from "@/lib/timezone";

export interface SendTelegramMessagePayload {
    text: string;
    chatIds?: string[];
}

export async function sendTelegramMessage(options: SendTelegramMessagePayload) {
    try {
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            console.error("TELEGRAM_BOT_TOKEN not found");
            return { success: false, error: "Bot token not configured" };
        }

        const chatIdsEnv = process.env.TELEGRAM_CHAT_IDS;
        if (!chatIdsEnv) {
            console.error("TELEGRAM_CHAT_IDS not found");
            return { success: false, error: "Chat IDs not configured" };
        }

        const chatIds =
            options.chatIds || chatIdsEnv.split(",").map((id) => id.trim());

        const results = [];

        for (const chatId of chatIds) {
            try {
                const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
                const params = new URLSearchParams({
                    chat_id: chatId,
                    text: options.text,
                    parse_mode: "HTML",
                });

                const response = await fetch(`${url}?${params.toString()}`);
                const data = await response.json();

                if (data.ok) {
                    results.push({ chatId, success: true, data });
                } else {
                    results.push({
                        chatId,
                        success: false,
                        error: data.description,
                    });
                }
            } catch (error) {
                const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                results.push({ chatId, success: false, error: errorMessage });
            }
        }

        const allSuccessful = results.every((result) => result.success);
        return {
            success: allSuccessful,
            results,
            error: allSuccessful ? null : "Some messages failed to send",
        };
    } catch (error) {
        console.error("Error sending Telegram message:", error);
        const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
        return { success: false, error: errorMessage };
    }
}

export async function sendApplicationNotification(applicationData: {
    name: string;
    email: string;
    phone: string;
    jobTitle: string;
    primarySkills: string;
    resume: string;
}) {
    const text = `🎯 <b>New Career Application</b>

<b>Position:</b> ${applicationData.jobTitle}
<b>Name:</b> ${applicationData.name}
<b>Email:</b> ${applicationData.email}
<b>Phone:</b> ${applicationData.phone}
<b>Skills:</b> ${applicationData.primarySkills}
<b>Resume:</b> ${applicationData.resume}
<b>Time:</b> ${formatISTNow()}`;
    return sendTelegramMessage({ text });
}

export async function sendApplicationStatusNotification(data: {
    name: string;
    jobTitle: string;
    status: string;
}) {
    const text = `📋 <b>Application Status Updated</b>

<b>Candidate:</b> ${data.name}
<b>Position:</b> ${data.jobTitle}
<b>New Status:</b> ${data.status}
<b>Time:</b> ${formatISTNow()}`;
    return sendTelegramMessage({ text });
}
