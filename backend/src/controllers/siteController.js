import nodemailer from 'nodemailer';

export const contact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body || {};
    if (!name || !email || !message) return res.status(400).json({ message: 'name, email and message are required' });

    const hasSmtp = !!process.env.EMAIL_HOST;
    const transporter = hasSmtp
      ? nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT || 587),
          secure: String(process.env.EMAIL_SECURE || '').toLowerCase() === 'true',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        })
      : nodemailer.createTransport({
          service: process.env.EMAIL_SERVICE || 'gmail',
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

    const to = 'srivastavaaryancse@gmail.com';
    const mail = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject: `UrbanVibe Contact: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n\nMessage:\n${message}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || '-'}</p><p><strong>Message:</strong></p><p>${message.replace(/\n/g,'<br/>')}</p>`
    });

    res.json({ success: true, id: mail.messageId });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
