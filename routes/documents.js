// routes/documents.js
const express = require('express');
const router = express.Router();
const { Document } = require('../models');

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
}

const documentTypes = [
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

router.get('/', isAuthenticated, async (req, res) => {
  const docs = await Document.findAll({ where: { userId: req.user.id } });
  const documents = documentTypes.map(type => {
    const found = docs.find(d => d.documentType === type);
    return {
      documentType: type,
      id: found ? found.id : null,
      url: found ? found.url : ''
    };
  });
  res.render('documents', { title: "Programa Interno", documents });
});

router.post('/save', isAuthenticated, async (req, res) => {
  try {
    const { documentType, url } = req.body;
    let doc = await Document.findOne({ where: { userId: req.user.id, documentType } });
    if (doc) {
      await doc.update({ url });
    } else {
      await Document.create({ userId: req.user.id, documentType, url });
    }
    req.flash('success', `Documento "${documentType}" guardado`);
    res.redirect('/documents');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Error al guardar el documento');
    res.redirect('/documents');
  }
});

module.exports = router;
