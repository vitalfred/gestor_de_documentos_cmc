require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const useSSL = process.env.DATABASE_URL.includes("railway.app");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: useSSL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  } : {}
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
const User = require('./user')(sequelize, DataTypes);
const Document = require('./document')(sequelize, DataTypes);

db.User = User;
db.Document = Document;

// Definir relaciones
User.hasMany(Document, { foreignKey: 'userId', onDelete: 'CASCADE' });
Document.belongsTo(User, { foreignKey: 'userId' });

// Probar conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    await sequelize.sync();
    console.log('✅ Modelos sincronizados correctamente.');
  } catch (error) {
    console.error('❌ Error al conectar o sincronizar la base de datos:', error);
    process.exit(1);
  }
})();

module.exports = db;
