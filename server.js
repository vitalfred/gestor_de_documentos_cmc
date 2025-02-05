// server.js (Actualizado para Railway)
require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const expressLayouts = require('express-ejs-layouts');
const { sequelize, User } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de vistas y express-ejs-layouts
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Configuración de Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return done(null, false, { message: 'Correo no registrado' });
    const valid = await user.validPassword(password);
    if (!valid) return done(null, false, { message: 'Contraseña incorrecta' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Variables globales para las vistas
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error_msg = req.flash('error');
  res.locals.success_msg = req.flash('success');
  next();
});

// Rutas
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const documentsRoutes = require('./routes/documents');

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/admin', adminRoutes);
app.use('/documents', documentsRoutes);

// Ruta raíz actualizada
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === 'admin') {
      return res.redirect('/admin');
    }
    return res.redirect('/dashboard');
  }
  res.redirect('/login');
});

// Sincronizar la base de datos y arrancar el servidor
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch(err => console.error('Error al sincronizar la base de datos:', err));
