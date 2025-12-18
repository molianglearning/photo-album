import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Album from './Album.js'

const Photo = sequelize.define('Photo', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  album_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Album,
      key: 'id'
    }
  },
  file_name: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  original_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  file_size: {
    type: DataTypes.INTEGER
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  upload_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'photos',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['album_id']
    },
    {
      fields: ['sort_order']
    }
  ]
})

Album.hasMany(Photo, { foreignKey: 'album_id', onDelete: 'CASCADE' })
Photo.belongsTo(Album, { foreignKey: 'album_id' })

export default Photo
