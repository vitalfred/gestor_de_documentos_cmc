// routes/user.js
const express = require('express');
const router = express.Router();
const { Document } = require('../models');

// Middleware para verificar autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

router.get('/dashboard', isAuthenticated, async (req, res) => {
  const requiredDocuments = [
    "Dictamen técnico de protección civil",
    "Póliza de Seguro",
    "Convenio de Bomberos",
    "Constancia de situación fiscal actualizada",
    "Planos del inmueble",
    "Arquitectónico",
    "Eléctrico",
    "Hidrosanitario",
    "Mecánico",
    "Comprobante de recarga de extintores",
    "Programa de Mantenimiento",
    "Bitácoras de mantenimiento firmadas",
    "Dictamen Eléctrico por UVIE",
    "Dictamen Estructural",
    "Normas de seguridad o reglamento interno",
    "Poder notarial del representante legal",
    "INE del representante legal",
    "Acta constitutiva notarial",
    "Evidencia de simulacros"
  ];

  const docs = await Document.findAll({ where: { userId: req.user.id } });
  const uploadedCount = docs.filter(d => d.url && d.url.trim() !== '').length;
  const totalRequired = requiredDocuments.length;
  const progress = Math.round((uploadedCount / totalRequired) * 100);

  res.render('dashboard', { 
    title: "Panel de Usuario",
    company: req.user.company, 
    currentUser: req.user,
    requiredDocuments, 
    uploadedCount, 
    totalRequired, 
    progress 
  });
});

module.exports = router;
