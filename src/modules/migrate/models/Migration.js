import {DataTypes} from 'sequelize';
import {defineModel} from '../../../index';

export default defineModel({
  instance: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  }
}, {
  db: 'db',
  modelName: 'Migration',
  indexes: [
    {
      fields: ['instance', 'name'],
      unique: true
    }
  ],
  tableName: 'tbl_migration',
  name: {
    singular: 'migration',
    plural: 'migrations'
  }
});