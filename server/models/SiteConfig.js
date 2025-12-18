import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'

const SiteConfig = sequelize.define('SiteConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  site_title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: '私密相册'
  },
  site_description: {
    type: DataTypes.TEXT
  },
  access_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  admin_password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'site_configs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

export default SiteConfig
