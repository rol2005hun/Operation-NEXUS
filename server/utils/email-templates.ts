// Common email styles and header/footer components
const emailStyles = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: linear-gradient(135deg, #0f1419 0%, #1a1f2e 100%) !important;
        color: #e2e8f0 !important;
        margin: 0;
        padding: 20px;
        min-height: 100vh;
        text-align: center;
    }
    .email-wrapper {
        width: 100%;
        text-align: center;
        margin: 0 auto;
    }
    table {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }
    td {
        border-collapse: collapse;
    }
    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background: rgba(26, 31, 46, 0.95) !important;
        border: 1px solid rgba(42, 52, 65, 0.8) !important;
        border-radius: 16px;
        padding: 40px;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(10px);
        position: relative;
        overflow: hidden;
        text-align: left;
        display: inline-block;
        width: 100%;
    }
    .email-container::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, #007acc, #0284c7, #007acc);
    }
    .header {
        text-align: center;
        margin-bottom: 40px;
        position: relative;
    }
    .logo-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }
    .logo-icon {
        width: 48px;
        height: 48px;
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        box-shadow:
            0 4px 20px rgba(59, 130, 246, 0.4),
            0 0 0 1px rgba(59, 130, 246, 0.2) inset;
        font-size: 1.2rem;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
        color: white !important;
    }
    .logo-o {
        color: #22c55e !important;
    }
    .logo-n {
        color: white !important;
    }
    .logo-title {
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }
    .logo-operation {
        color: #22c55e !important;
        font-size: 2rem;
        font-weight: 500;
        letter-spacing: 0.05em;
        font-family: 'Inter', sans-serif;
        text-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
    }
    .logo-nexus {
        color: #f1f5f9 !important;
        font-size: 2rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        font-family: 'Inter', sans-serif;
        text-shadow: 0 0 20px rgba(241, 245, 249, 0.5);
    }
    .agency-subtitle {
        color: #8892b0 !important;
        font-size: 16px;
        font-weight: 500;
        margin-bottom: 20px;
    }
    .security-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: rgba(220, 38, 127, 0.2) !important;
        color: #fbbf24 !important;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        border: 1px solid rgba(220, 38, 127, 0.3);
    }
    .content {
        margin: 35px 0;
        line-height: 1.7;
    }
    .content h2 {
        color: #e2e8f0 !important;
        font-size: 24px;
        margin-bottom: 20px;
        font-weight: 600;
        text-align: center;
    }
    .content p {
        color: #94a3b8 !important;
        margin: 15px 0;
        font-size: 16px;
    }
    .agent-name {
        color: #007acc !important;
        font-weight: 700;
    }
    .verify-button {
        display: block;
        width: fit-content;
        margin: 35px auto !important;
        background: linear-gradient(135deg, #007acc, #0284c7) !important;
        color: white !important;
        text-decoration: none;
        padding: 16px 32px;
        border-radius: 12px;
        font-weight: 600;
        text-align: center !important;
        letter-spacing: 0.5px;
        text-transform: uppercase;
        font-size: 14px;
        border: none;
        box-shadow: 0 4px 15px rgba(0, 122, 204, 0.3);
        transition: all 0.3s ease;
    }
    .verify-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 122, 204, 0.4);
        background: linear-gradient(135deg, #005a99, #0284c7) !important;
    }
    .warning-box {
        background: rgba(245, 158, 11, 0.1) !important;
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-left: 4px solid #f59e0b;
        padding: 20px;
        margin: 25px 0;
        border-radius: 8px;
        color: #fbbf24 !important;
        font-size: 14px;
        line-height: 1.6;
    }
    .warning-box strong {
        color: #f59e0b !important;
        font-weight: 700;
    }
    .features-section {
        background: rgba(15, 20, 25, 0.5) !important;
        border: 1px solid rgba(42, 52, 65, 0.6);
        border-radius: 12px;
        padding: 25px;
        margin: 25px 0;
    }
    .features-section h3 {
        color: #e2e8f0 !important;
        font-size: 18px;
        margin-bottom: 15px;
        font-weight: 600;
    }
    .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .features-list li {
        margin: 12px 0;
        color: #94a3b8 !important;
        font-size: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .features-list li::before {
        content: '🔹';
        color: #007acc !important;
        font-size: 14px;
    }
    .link-section {
        background: rgba(15, 20, 25, 0.3) !important;
        border: 1px solid rgba(42, 52, 65, 0.5);
        border-radius: 8px;
        padding: 20px;
        margin: 25px 0;
    }
    .link-section p {
        margin-bottom: 10px;
        font-size: 14px;
        color: #8892b0 !important;
    }
    .link-box {
        background: rgba(0, 122, 204, 0.1) !important;
        border: 1px solid rgba(0, 122, 204, 0.3);
        border-radius: 6px;
        padding: 12px;
        word-break: break-all;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-size: 12px;
        color: #60a5fa !important;
        line-height: 1.4;
    }
    .footer {
        text-align: center;
        margin-top: 40px;
        padding-top: 25px;
        border-top: 1px solid rgba(42, 52, 65, 0.6);
    }
    .footer p {
        color: #64748b !important;
        font-size: 13px;
        margin: 8px 0;
        line-height: 1.5;
    }
    .footer-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(220, 38, 127, 0.15) !important;
        color: #dc2626 !important;
        padding: 6px 12px;
        border-radius: 16px;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.5px;
        margin-top: 15px;
        border: 1px solid rgba(220, 38, 127, 0.3);
    }
`;

function generateEmailHeader(): string {
    return `
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon">
                    <span class="logo-o">O</span><span class="logo-n">N</span>
                </div>
                <div class="logo-title">
                    <span class="logo-operation">Operation:</span>
                    <span class="logo-nexus">NEXUS</span>
                </div>
            </div>
            <div class="agency-subtitle">Digital Investigation Agency</div>
            <div class="security-badge">
                <span>🛡️</span>
                <span>CLASSIFIED SYSTEM</span>
            </div>
        </div>
    `;
}

function generateEmailFooter(): string {
    return `
        <div class="footer">
            <p>This is an encrypted transmission from Operation: NEXUS Digital Investigation Agency.</p>
            <p>Authorized personnel only • Do not forward or reply</p>
            <div class="footer-badge">
                <span>🔒</span>
                <span>TOP SECRET</span>
            </div>
        </div>
    `;
}

function generateEmailTemplate(content: string): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>${emailStyles}</style>
    </head>
    <body>
        <div class="email-wrapper">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; text-align: center;">
                <tr>
                    <td align="center" style="padding: 0;">
                        <div class="email-container">
                            ${generateEmailHeader()}
                            ${content}
                            ${generateEmailFooter()}
                        </div>
                    </td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    `;
}

function generateVerificationContent(agentName: string, verificationLink: string): string {
    return `
        <div class="content">
            <h2>🎯 Agent Recruitment Verification</h2>
            
            <p>Welcome to Operation: NEXUS, Agent <span class="agent-name">${agentName}</span>!</p>
            
            <p>Your application to join our classified digital investigation network has been received and is under review. To complete your security clearance and gain access to our systems, you must verify your identity through this secure channel.</p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationLink}" class="verify-button">
                    🚀 Initiate System Access
                </a>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ SECURITY PROTOCOL:</strong> This verification link is time-sensitive and will expire in 5 minutes for security reasons. If you did not request access to our systems, please disregard this transmission.
            </div>
            
            <div class="features-section">
                <h3>🔐 Clearance Level Access:</h3>
                <ul class="features-list">
                    <li>Classified investigation cases</li>
                    <li>Encrypted communication channels</li>
                    <li>Advanced digital forensics toolkit</li>
                    <li>Real-time evidence analysis systems</li>
                    <li>Secure agent network access</li>
                </ul>
            </div>
            
            <div class="link-section">
                <p>If the secure access button doesn't work, copy this encrypted link:</p>
                <div class="link-box">${verificationLink}</div>
            </div>
        </div>
    `;
}

function generatePasswordResetContent(agentName: string, resetLink: string): string {
    return `
        <div class="content">
            <h2>🔐 Security Clearance Reset</h2>
            
            <p>Agent <span class="agent-name">${agentName}</span>,</p>
            
            <p>A request has been made to reset your security clearance password for Operation: NEXUS systems. This is a secure channel transmission to help you regain access to classified networks.</p>
            
            <p>If you did not request this password reset, please ignore this message and contact your system administrator immediately.</p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${resetLink}" class="verify-button">
                    🔑 Reset Security Code
                </a>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ SECURITY PROTOCOL:</strong> This reset link is time-sensitive and will expire in 5 minutes for security reasons. Do not share this link with anyone.
            </div>
            
            <div class="features-section">
                <h3>🛡️ Security Guidelines:</h3>
                <ul class="features-list">
                    <li>Choose a strong, unique password</li>
                    <li>Include uppercase, lowercase, numbers and symbols</li>
                    <li>Minimum 8 characters required</li>
                    <li>Do not reuse previous passwords</li>
                    <li>Keep your credentials confidential</li>
                </ul>
            </div>
            
            <div class="link-section">
                <p>If the secure reset button doesn't work, copy this encrypted link:</p>
                <div class="link-box">${resetLink}</div>
            </div>
        </div>
    `;
}

function generateEmailChangeContent(agentName: string, newEmail: string, verificationLink: string): string {
    return `
        <div class="content">
            <h2>📧 Email Change Verification Required</h2>
            
            <p>Agent <span class="agent-name">${agentName}</span>,</p>
            
            <p>A request has been made to change your official contact email address in our secure systems to:</p>
            
            <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
                <span style="color: #22c55e; font-weight: bold; font-family: 'JetBrains Mono', monospace; font-size: 16px;">${newEmail}</span>
            </div>
            
            <p>For security purposes, you must verify ownership of this new email address before the change can be processed.</p>
            
            <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationLink}" class="verify-button">
                    🔐 Verify New Email Address
                </a>
            </div>
            
            <div class="warning-box">
                <strong>⚠️ SECURITY PROTOCOL:</strong> This verification link is time-sensitive and will expire in 5 minutes for security reasons. If you did not request this email change, please contact support immediately.
            </div>
            
            <div class="features-section">
                <h3>📋 Email Change Process:</h3>
                <ul class="features-list">
                    <li>Click the verification link above</li>
                    <li>Confirm the email change in your browser</li>
                    <li>Your new email will be activated immediately</li>
                    <li>All future communications will use the new address</li>
                    <li>Update your records accordingly</li>
                </ul>
            </div>
            
            <div class="link-section">
                <p>If the verification button doesn't work, copy this encrypted link:</p>
                <div class="link-box">${verificationLink}</div>
            </div>
        </div>
    `;
}

export function generateAccountVerificationEmailHTML(agentName: string, verificationLink: string): string {
    return generateEmailTemplate(generateVerificationContent(agentName, verificationLink));
}

export function generatePasswordResetEmailHTML(agentName: string, resetLink: string): string {
    return generateEmailTemplate(generatePasswordResetContent(agentName, resetLink));
}

export function generateEmailChangeVerificationHTML(agentName: string, newEmail: string, verificationLink: string): string {
    return generateEmailTemplate(generateEmailChangeContent(agentName, newEmail, verificationLink));
}