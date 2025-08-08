import { Webhook } from '@vermaysha/discord-webhook';
import 'dotenv/config';

const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL;
const hook = discordWebhookUrl ? new Webhook(discordWebhookUrl) : null;

const sendDiscordLog = async (message: string, type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' = 'INFO') => {
    if (hook) {
        let prefix = '';
        let color = '';

        switch (type) {
            case 'INFO':
                prefix = '🔵 [INFORMATION]';
                color = '#007bff';
                break;
            case 'WARNING':
                prefix = '🟠 [WARNING]';
                color = '#ffc107';
                break;
            case 'ERROR':
                prefix = '🔴 [ERROR]';
                color = '#dc3545';
                break;
            case 'SUCCESS':
                prefix = '🟢 [SUCCESS]';
                color = '#28a745';
                break;
            default:
                prefix = '[LOG]';
                color = '#6c757d';
                break;
        }

        const finalMessage = `${new Date().toLocaleString('hu-HU', { timeZone: 'Europe/Budapest' })} ${prefix}: ${message}`;

        try {
            hook.setContent(finalMessage);
            await hook.send();
        } catch (discordError) {
            console.error('[Discord Logger] Error while sending message to Discord:', discordError);
        }
    } else {
        console.warn('[Discord Logger] The Discord Webhook URL is bad configured. No log sent.');
    }
};

export const success = async (message: string): Promise<void> => {
    await sendDiscordLog(message, 'SUCCESS');
};

export const error = async (message: string): Promise<void> => {
    await sendDiscordLog(message, 'ERROR');
};

export const warn = async (message: string): Promise<void> => {
    await sendDiscordLog(message, 'WARNING');
};

export const info = async (message: string): Promise<void> => {
    await sendDiscordLog(message, 'INFO');
};

export { sendDiscordLog };