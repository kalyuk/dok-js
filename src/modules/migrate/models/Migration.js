import sequelize from 'sequelize';
import {SequelizeModel} from '../../../decorators/SequelizeModel';

@SequelizeModel({
  schema: {
    instance: {
      type: sequelize.DataTypes.STRING
    },
    name: {
      type: sequelize.DataTypes.STRING
    }
  },
  tableName: 'tbl_migration'
})
export class Migration {
}