// createAdmin.js
require('dotenv').config();
const { sequelize, User } = require('./models');

async function createAdmin() {
  try {
    await sequelize.sync();
    const adminUser = await User.create({
      name: 'Administrador',
      company: 'Consultores CMC',
      email: 'admin1@consultorescmc.com',
      password: 'Prueba123.',  // Se encriptará automáticamente
      role: 'admin'
    });
    console.log('Usuario administrador creado correctamente:');
    console.log(`Email: ${adminUser.email}`);
    process.exit(0);
  } catch (error) {
    console.error('Error al crear el usuario administrador:', error);
    process.exit(1);
  }
}

createAdmin();
