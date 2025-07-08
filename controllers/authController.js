const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});

const findUserByEmail = async (email) => {
  let user = await db.Formando.findOne({ where: { Email: email } });
  if (user) return { user, type: "formando" };

  user = await db.Gestor.findOne({ where: { Email } });
  if (user) return { user, type: "gestor" };

  user = await db.Formador.findOne({ where: { Email } });
  if (user) return { user, type: "formador" };

  return null;
};

exports.checkAuth = (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, user: decoded });
  } catch (err) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

exports.register = async (req, res) => {
  const { Nome, Email, Password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = await db.Formando.create({ Nome, Email, Password: hashedPassword });
    res.status(201).json({ message: "Utilizador registado com sucesso", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao registar utilizador" });
  }
};

exports.login = async (req, res) => {
  const { Email, Password } = req.body;
  try {
    let user = await db.Formando.findOne({ where: { Email } });
    let role = "formando";

    if (!user) {
      user = await db.Gestor.findOne({ where: { Email } });
      role = "gestor";
    }

    if (!user) {
      user = await db.Formador.findOne({ where: { Email } });
      role = "formador";
    }

    if (!user) return res.status(401).json({ message: "Email não encontrado" });

    const isValid = await bcrypt.compare(Password, user.Password);
    if (!isValid) return res.status(401).json({ message: "Senha incorreta" });

    const userId = role === "formando" ? user.ID_Formando :
                   role === "gestor" ? user.ID_Gestor :
                   user.ID_Formador;

    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token, user, role }); // ⬅️ envia token no JSON
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno" });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: "Logout realizado" });
};



// Solicitar recuperação de senha
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    console.log("fortnite");
    const userData = await findUserByEmail(email);
    if (!userData) {
      return res.status(404).json({ message: "Email não registrado" });
    }

    const { user } = userData;
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hora

    await user.update({
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpiry,
    });

    await transporter.sendMail({
      to: email,
      from: "pintproject025@gmail.com",
      subject: "Recuperação de Senha",
      html: `
                <p>Você solicitou a recuperação de senha.</p>
                <p>Clique no link abaixo para redefinir:</p>
                <a href="http://localhost:5173/reset-password?token=${resetToken}&email=${email}">
                    Redefinir senha
                </a>
                <p>O link expira em 1 hora.</p>
            `,
    });

    res.json({ message: "Email de recuperação enviado" });

    // Enviar email (exemplo simplificado)
    console.log(`Email de recuperação enviado para: ${email}`);
    console.log(`Token: ${resetToken}`);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Erro ao processar solicitação" });
  }
};

// Redefinir senha
exports.resetPassword = async (req, res) => {
  const { token, email, currentPassword, newPassword } = req.body;

  try {
    const userData = await findUserByEmail(email);
    if (!userData) {
      return res.status(404).json({ message: "Email não registrado" });
    }

    const { user } = userData;

    // Verificar token e expiração
    if (
      user.resetPasswordToken !== token ||
      user.resetPasswordExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // Verificar se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.Password);
    if (!isMatch) {
      return res.status(400).json({ message: "Senha atual incorreta" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      Password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });

    res.json({ message: "Senha redefinida com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao redefinir senha" });
  }
};
