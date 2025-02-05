
module.exports = (sequelize, DataTypes) => {
  const Document = sequelize.define('Document', {
    documentType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });
  return Document;
};
