// routes/admin.js
const express = require('express');
const router = express.Router();
const { User, Document } = require('../models');

// Middleware para verificar si el usuario es admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Acceso denegado');
  res.redirect('/dashboard');
}

// Panel principal del administrador
router.get('/', isAdmin, (req, res) => {
  res.render('admin-dashboard', { title: 'Panel Administrador' });
});

// Gestión de usuarios (vista ya existente)
router.get('/users', isAdmin, async (req, res) => {
  const users = await User.findAll();
  res.render('admin-users', { title: "Gestión de Usuarios", users });
});

router.post('/users', isAdmin, async (req, res) => {
  try {
    const { name, company, email, password, role } = req.body;
    await User.create({ name, company, email, password, role });
    req.flash('success', 'Usuario creado exitosamente');
    res.redirect('/admin/users');
  } catch (err) {
    req.flash('error', 'Error al crear el usuario');
    res.redirect('/admin/users');
  }
});

router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, company, email, password, role } = req.body;
    const user = await User.findByPk(req.params.id);
    if (!user) { req.flash('error', 'Usuario no encontrado'); return res.redirect('/admin/users'); }
    await user.update({ name, company, email, password, role });
    req.flash('success', 'Usuario actualizado');
    res.redirect('/admin/users');
  } catch (err) {
    req.flash('error', 'Error al actualizar el usuario');
    res.redirect('/admin/users');
  }
});

router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    req.flash('success', 'Usuario eliminado');
    res.redirect('/admin/users');
  } catch (err) {
    req.flash('error', 'Error al eliminar el usuario');
    res.redirect('/admin/users');
  }
});

// Nueva ruta: Reporte de Progreso de Usuarios
router.get('/progress', isAdmin, async (req, res) => {
  // Lista de documentos requeridos (mismo que en user.js)
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
  try {
    // Se listan los usuarios con rol 'user'
    const users = await User.findAll({ where: { role: 'user' } });
    const progressList = await Promise.all(users.map(async (user) => {
      const docs = await Document.findAll({ where: { userId: user.id } });
      const uploadedCount = docs.filter(d => d.url && d.url.trim() !== '').length;
      const totalRequired = requiredDocuments.length;
      const progress = Math.round((uploadedCount / totalRequired) * 100);
      return { user, progress, uploadedCount, totalRequired };
    }));
    res.render('admin-user-progress', { title: "Reporte de Progreso", progressList });
  } catch (err) {
    req.flash('error', 'Error al obtener progreso de usuarios');
    res.redirect('/admin');
  }
});

// Nueva ruta: Detalle del Progreso para un usuario específico
router.get('/progress/:id', isAdmin, async (req, res) => {
  const userId = req.params.id;
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
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      req.flash('error', 'Usuario no encontrado');
      return res.redirect('/admin/progress');
    }
    const docs = await Document.findAll({ where: { userId: userId } });
    const documentDetails = requiredDocuments.map(type => {
      const doc = docs.find(d => d.documentType === type);
      return {
        documentType: type,
        url: doc ? doc.url : null,
        uploaded: doc && doc.url && doc.url.trim() !== ''
      };
    });
    const uploadedCount = documentDetails.filter(d => d.uploaded).length;
    const totalRequired = requiredDocuments.length;
    const progress = Math.round((uploadedCount / totalRequired) * 100);
    res.render('admin-user-details', {
      title: `Detalle de Progreso: ${user.name}`,
      user,
      documentDetails,
      progress,
      uploadedCount,
      totalRequired
    });
  } catch (err) {
    req.flash('error', 'Error al obtener detalles del usuario');
    res.redirect('/admin/progress');
  }
});

module.exports = router;
