
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './user.model.js';

class RefreshToken extends Model {}
RefreshToken.init(
  {
    token: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
  }
);

User.hasMany(RefreshToken, { onDelete: 'CASCADE' });
RefreshToken.belongsTo(User);

export default RefreshToken;
