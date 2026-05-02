const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../util/db");

class Blog extends Model {}
Blog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          args: true,
          msg: "Title cannot be empty",
        },
      },
    },
    url: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          args: true,
          msg: "url cannot be empty",
        },
      },
    },
    author: {
      type: DataTypes.TEXT,
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    year: {
      type: DataTypes.INTEGER,
      validate: {
        max(value) {
          const currentYear = new Date().getFullYear();
          if (value > currentYear) {
            throw new Error("Year cannot be in the future");
          }
        },
        min: 1991,
      },
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "blog",
  },
);

module.exports = Blog;
