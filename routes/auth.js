// routes/auth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();

// Mostrar formulario de login
router.get('/login', (req, res) => {
  res.render('login', { title: "Iniciar Sesión" });
});

// Procesar login con redirección según el rol del usuario
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login');

    req.logIn(user, (err) => {
      if (err) return next(err);

      // Redirigir según el rol del usuario
      if (user.role === 'admin') {
        return res.redirect('/admin');
      }
      return res.redirect('/dashboard');
    });
  })(req, res, next);
});

// Cerrar sesión
router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash('success', 'Has cerrado sesión');
    res.redirect('/login');
  });
});

module.exports = router;
