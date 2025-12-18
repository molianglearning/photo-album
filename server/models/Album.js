import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js'
import Category from './Category.js'

const Album = sequelize.define('Album', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  cover_image: {
    type: DataTypes.STRING(500)
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'albums',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category_id']
    },
    {
      fields: ['sort_order']
    }
  ]
})

Category.hasMany(Album, { foreignKey: 'category_id', onDelete: 'CASCADE' })
Album.belongsTo(Category, { foreignKey: 'category_id' })

export default Album
