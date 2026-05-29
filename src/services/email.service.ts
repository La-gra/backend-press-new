import { resend } from '@/config/resend'
import crypto from 'crypto'

export const generateVerificationToken = () => ({
  token: crypto.randomUUID(),
  expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
})

export const sendVerificationEmail = async (
  email: string,
  fullname: string,
  token: string,
  password?: string
) => {
  const from = process.env.SMTP_FROM || 'noreply@prnews.info'
  const link = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

  const passwordBlock = password ? `
              <div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:16px;margin:16px 0">
                <p style="color:#92400e;font-size:13px;font-weight:bold;margin:0 0 8px">🔑 Vos identifiants de connexion</p>
                <p style="color:#92400e;font-size:13px;margin:0 0 4px"><strong>Email :</strong> ${email}</p>
                <p style="color:#92400e;font-size:13px;margin:0"><strong>Mot de passe :</strong> <span style="font-family:monospace;background:#fff;padding:2px 6px;border-radius:3px">${password}</span></p>
              </div>
              <p style="color:#6b7280;font-size:13px;line-height:1.6">Pour des raisons de sécurité, nous vous recommandons de <strong>changer votre mot de passe</strong> après votre première connexion depuis votre espace administration.</p>` : ''

  try {
    await resend.emails.send({
      from,
      to: email,
      subject: 'Bienvenue — Votre compte administrateur PRN',
      html: `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 20px">
        <table width="600" style="max-width:100%;background:#ffffff;border-radius:8px;overflow:hidden">
          <tr>
            <td align="center" style="padding:30px 20px;background:#1e3a5f">
              <img src="${process.env.BACKEND_URL}/images/logo.jpg" alt="PRN" width="120" style="border-radius:8px" />
              <p style="color:#ffffff;font-size:12px;margin-top:8px">Presse Républicaine News</p>
            </td>
          </tr>
          <tr>
            <td style="padding:30px 20px">
              <h2 style="color:#1e3a5f;font-size:20px;margin:0 0 12px">Bonjour ${fullname} 👋</h2>
              <p style="color:#6b7280;font-size:14px;line-height:1.6">Votre compte administrateur a été créé avec succès sur <strong>Presse Républicaine News</strong>.</p>
              ${passwordBlock}
              <p style="color:#6b7280;font-size:14px;line-height:1.6">Cliquez sur le bouton ci-dessous pour vérifier votre adresse email et activer votre accès :</p>
              <table cellpadding="0" cellspacing="0" style="margin:24px auto">
                <tr>
                  <td align="center" bgcolor="#0052a5" style="border-radius:6px">
                    <a href="${link}" target="_blank" style="display:inline-block;padding:12px 32px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none">Vérifier mon email</a>
                  </td>
                </tr>
              </table>
              <p style="color:#9ca3af;font-size:12px;line-height:1.5">Ce lien expire dans 24 heures. Si vous n'avez pas demandé ce compte, ignorez cet email.</p>
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0" />
              <p style="color:#9ca3af;font-size:11px">PRN — Presse Républicaine News</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
    })
    console.log(`[EMAIL] Verification email sent to ${email} via ${from}`)
  } catch (err: any) {
    console.error(`[EMAIL] Failed to send to ${email}:`, err?.response?.body || err?.message || err)
    throw err
  }
}
