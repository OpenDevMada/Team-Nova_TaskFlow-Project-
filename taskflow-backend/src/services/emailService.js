const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    return null;
  }

  transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: parseInt(EMAIL_PORT || '587'),
    secure: parseInt(EMAIL_PORT || '587') === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  return transporter;
};

class EmailService {
  static async sendPasswordReset(email, resetToken) {
    const transport = getTransporter();
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    if (!transport) {
      console.log('=== EMAIL (simulation) ===');
      console.log(`Destinataire: ${email}`);
      console.log(`Lien de réinitialisation: ${resetUrl}`);
      console.log('Email non envoyé : transport non configuré.');
      console.log('Configurez EMAIL_HOST, EMAIL_USER et EMAIL_PASS dans .env');
      return { message: 'Email simulé (transport non configuré)' };
    }

    try {
      await transport.sendMail({
        from: `"TaskFlow" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Réinitialisation de votre mot de passe TaskFlow',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #1E293B;">TaskFlow</h2>
            <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
            <a href="${resetUrl}" style="
              display: inline-block;
              padding: 12px 24px;
              background: #3B82F6;
              color: white;
              text-decoration: none;
              border-radius: 8px;
              margin: 16px 0;
            ">Réinitialiser mon mot de passe</a>
            <p style="color: #64748B; font-size: 14px;">
              Ce lien expire dans 1 heure.
              Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
            </p>
          </div>
        `
      });
      return { message: 'Email envoyé avec succès' };
    } catch (error) {
      console.error('Erreur envoi email:', error.message);
      return { message: 'Erreur lors de l\'envoi de l\'email' };
    }
  }
}

module.exports = EmailService;
