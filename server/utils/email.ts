import nodemailer from 'nodemailer';
import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

async function createTransporter() {
    try {
        const accessTokenResponse = await oauth2Client.getAccessToken();
        const accessToken = accessTokenResponse.token;

        if (!accessToken) {
            throw new Error('Failed to obtain access token');
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.SMTP_USER,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        return transporter;
    } catch (error) {
        console.error('❌ Failed to create email transporter:', error);
        throw error;
    }
}

export async function sendEmail(options: EmailOptions): Promise<void> {
    if (!process.env.SMTP_USER || !process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_REFRESH_TOKEN) {
        console.warn('⚠️  OAuth2 configuration incomplete. Please set SMTP_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN environment variables.');
        return;
    }

    try {
        const transporter = await createTransporter();

        await transporter.sendMail({
            from: 'Operation: NEXUS <' + process.env.SMTP_USER + '>',
            to: options.to,
            subject: options.subject,
            html: options.html,
            text: options.text
        });
    } catch (error: any) {
        console.error('❌ Email sending failed:', error.message);

        if (error.code === 'EAUTH' || error.responseCode === 535) {
            console.error('🔐 OAuth2 Authentication failed. Please check your OAuth2 credentials:');
            console.error('   - Ensure SMTP_USER, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REFRESH_TOKEN are correctly set');
            console.error('   - Verify your Google OAuth2 app has Gmail API access enabled');
            console.error('   - Ensure the refresh token has the https://mail.google.com/ scope');
            console.error('   - Check if your Google OAuth2 app is still active and not expired');
        }

        throw new Error(`Failed to send email: ${error.message}`);
    }
}