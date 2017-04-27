import DataTypes from "sequelize/lib/data-types";
import App from "../../../app";

export default App().defineModel("MigrationModel", {
  name: {
    type: DataTypes.STRING(64),
    allowNull: false,
    unique: true
  }
}, {
  tableName: "tbl_migrations"
});