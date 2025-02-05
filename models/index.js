
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importar modelos
db.User = require('./user')(sequelize, Sequelize);
db.Document = require('./document')(sequelize, Sequelize);

// Relaciones
db.User.hasMany(db.Document, { foreignKey: 'userId', onDelete: 'CASCADE' });
db.Document.belongsTo(db.User, { foreignKey: 'userId' });

module.exports = db;
