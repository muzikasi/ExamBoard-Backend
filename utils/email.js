import SibApiV3Sdk from 'sib-api-v3-sdk'

export const sendVerificationEmail = async (email, name, token, otp) => {
  const client = SibApiV3Sdk.ApiClient.instance
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY

  const verificationUrl = `http://localhost:5173/verify-email/${token}`
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  const firstName = name ? name.split(' ')[0] : 'there'

  await apiInstance.sendTransacEmail({
    sender: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME,
    },
    to: [{ email: email, name: name }],
    subject: '✅ Verify your ExamBoard account',
    htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6fb; font-family: 'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fb; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 40px; text-align:center;">
                  <a href="http://localhost:5173" style="text-decoration:none;">
                    <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800;">
                      📝 <span style="color:#4a6cf7;">Exam</span>Board
                    </h1>
                  </a>
                  <p style="margin: 8px 0 0; color:#aaaaaa; font-size:13px;">Your study materials platform</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 40px 20px;">
                  <h2 style="margin:0 0 8px; color:#1a1a2e; font-size:22px;">Welcome, ${firstName}! 👋</h2>
                  <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.6;">
                    Thanks for joining <strong>ExamBoard</strong>! Use the OTP code below or click the verify button to activate your account.
                  </p>

                  <!-- OTP Code -->
                  <div style="text-align:center; margin-bottom:8px;">
                    <p style="margin:0 0 8px; color:#333; font-size:14px;">Your verification code:</p>
                    <div style="display:inline-block; background-color:#f0f4ff; border: 2px solid #4a6cf7; border-radius:10px; padding:16px 32px;">
                      <p style="margin:0; color:#4a6cf7; font-size:32px; font-weight:800; letter-spacing:8px;">${otp}</p>
                    </div>
                    <p style="margin:8px 0 4px; color:#ff4444; font-size:12px; font-weight:600;">⚠️ Do not share this code with anyone!</p>
                    <p style="margin:0 0 24px; color:#ff8800; font-size:12px; font-weight:600;">⏰ This OTP expires in <strong>5 minutes</strong></p>
                  </div>

                  <!-- Info box -->
                  <div style="background-color:#f0f4ff; border-left: 4px solid #4a6cf7; border-radius:8px; padding:16px 20px; margin-bottom:28px;">
                    <p style="margin:0; color:#4a6cf7; font-size:14px; font-weight:600;">📌 Please verify your email to:</p>
                    <ul style="margin:8px 0 0; padding-left:20px; color:#555; font-size:14px; line-height:1.8;">
                      <li>Upload study materials</li>
                      <li>Upvote helpful content</li>
                      <li>Bookmark your favorites</li>
                    </ul>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align:center; margin-bottom:32px;">
                    <a href="${verificationUrl}" style="display:inline-block; background: linear-gradient(135deg, #4a6cf7 0%, #3a5ce5 100%); color:#ffffff; padding:16px 40px; border-radius:10px; text-decoration:none; font-size:16px; font-weight:700;">
                      ✅ Verify My Email
                    </a>
                    <p style="margin:10px 0 4px; color:#ff8800; font-size:12px; font-weight:600;">⏰ This link expires in <strong>30 minutes</strong></p>
                    <p style="margin:4px 0 0; color:#999; font-size:12px;">Button not working? Copy and paste this link:</p>
                    <a href="${verificationUrl}" style="color:#4a6cf7; font-size:12px; word-break:break-all;">${verificationUrl}</a>
                  </div>

                  <hr style="border:none; border-top:1px solid #eeeeee; margin:0 0 24px;" />

                  <!-- Features -->
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="33%" style="text-align:center; padding:16px 8px;">
                        <div style="font-size:28px;">📚</div>
                        <p style="margin:8px 0 0; color:#555; font-size:13px; font-weight:600;">Browse Materials</p>
                      </td>
                      <td width="33%" style="text-align:center; padding:16px 8px;">
                        <div style="font-size:28px;">⬆️</div>
                        <p style="margin:8px 0 0; color:#555; font-size:13px; font-weight:600;">Upvote Content</p>
                      </td>
                      <td width="33%" style="text-align:center; padding:16px 8px;">
                        <div style="font-size:28px;">📤</div>
                        <p style="margin:8px 0 0; color:#555; font-size:13px; font-weight:600;">Upload Materials</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f9fc; padding:24px 40px; text-align:center; border-top:1px solid #eeeeee;">
                  <p style="margin:0 0 8px; color:#999; font-size:12px;">If you didn't create an account you can safely ignore this email.</p>
                  <p style="margin:0; color:#999; font-size:12px;">© 2026 ExamBoard · Built by Firesenbet Gebre & Kibreab Mengistu</p>
                  <div style="margin-top:12px;">
                    <a href="http://localhost:5173" style="color:#4a6cf7; font-size:12px; text-decoration:none;">Visit ExamBoard</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  })
}

export const sendPasswordResetEmail = async (email, name, resetCode) => {
  const client = SibApiV3Sdk.ApiClient.instance
  client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi()
  const firstName = name ? name.split(' ')[0] : 'there'

  await apiInstance.sendTransacEmail({
    sender: {
      email: process.env.FROM_EMAIL,
      name: process.env.FROM_NAME,
    },
    to: [{ email: email, name: name }],
    subject: '🔐 Reset Your ExamBoard Password',
    htmlContent: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    </head>
    <body style="margin:0; padding:0; background-color:#f4f6fb; font-family: 'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6fb; padding: 40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">

              <!-- Header -->
              <tr>
                <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 40px; text-align:center;">
                  <a href="http://localhost:5173" style="text-decoration:none;">
                    <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:800;">
                      📝 <span style="color:#4a6cf7;">Exam</span>Board
                    </h1>
                  </a>
                  <p style="margin: 8px 0 0; color:#aaaaaa; font-size:13px;">Your study materials platform</p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding: 40px 40px 20px;">
                  <h2 style="margin:0 0 8px; color:#1a1a2e; font-size:22px;">Password Reset Request 🔐</h2>
                  <p style="margin:0 0 24px; color:#666666; font-size:15px; line-height:1.6;">
                    Hi ${firstName}, we received a request to reset your ExamBoard password. Use the code below to set a new password. This code is valid for <strong>15 minutes</strong>.
                  </p>

                  <!-- Reset Code -->
                  <div style="text-align:center; margin-bottom:8px;">
                    <p style="margin:0 0 8px; color:#333; font-size:14px;">Your password reset code:</p>
                    <div style="display:inline-block; background-color:#fff3cd; border: 2px solid #ffc107; border-radius:10px; padding:16px 32px;">
                      <p style="margin:0; color:#ff6b6b; font-size:32px; font-weight:800; letter-spacing:8px;">${resetCode}</p>
                    </div>
                    <p style="margin:8px 0 4px; color:#ff4444; font-size:12px; font-weight:600;">⚠️ Do not share this code with anyone!</p>
                    <p style="margin:0 0 24px; color:#ff8800; font-size:12px; font-weight:600;">⏰ This code expires in <strong>15 minutes</strong></p>
                  </div>

                  <!-- Info box -->
                  <div style="background-color:#f0f4ff; border-left: 4px solid #4a6cf7; border-radius:8px; padding:16px 20px; margin-bottom:28px;">
                    <p style="margin:0; color:#4a6cf7; font-size:14px; font-weight:600;">📌 How to reset your password:</p>
                    <ul style="margin:8px 0 0; padding-left:20px; color:#555; font-size:14px; line-height:1.8;">
                      <li>Enter the code above</li>
                      <li>Enter your new password</li>
                      <li>Confirm your new password</li>
                    </ul>
                  </div>

                  <hr style="border:none; border-top:1px solid #eeeeee; margin:0 0 24px;" />

                  <!-- Important Notice -->
                  <div style="background-color:#ffe0e0; border-left: 4px solid #ff6b6b; border-radius:8px; padding:16px 20px; margin-bottom:24px;">
                    <p style="margin:0; color:#cc0000; font-size:13px; font-weight:600;">⚠️ Didn't request this?</p>
                    <p style="margin:8px 0 0; color:#666; font-size:13px;">If you didn't request a password reset, you can safely ignore this email. Your account is secure.</p>
                  </div>

                  <p style="margin:0; color:#999; font-size:13px;">Need help? Contact our support team.</p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background-color:#f8f9fc; padding:24px 40px; text-align:center; border-top:1px solid #eeeeee;">
                  <p style="margin:0 0 8px; color:#999; font-size:12px;">© 2026 ExamBoard · Built by Firesenbet Gebre & Kibreab Mengistu</p>
                  <div style="margin-top:12px;">
                    <a href="http://localhost:5173" style="color:#4a6cf7; font-size:12px; text-decoration:none;">Visit ExamBoard</a>
                  </div>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `
  })
}