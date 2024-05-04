"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.hasMany(models.Cars, {
                foreignKey: "createdBy",
                as: "createdCars",
            });
            Users.hasMany(models.Cars, {
                foreignKey: "updatedBy",
                as: "updatedCars",
            });
            Users.hasMany(models.Cars, {
                foreignKey: "deletedBy",
                as: "deletedCars",
            });
        }
    }
    Users.init(
        {
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            password: DataTypes.TEXT,
            name: DataTypes.STRING,
            photo: DataTypes.TEXT,
            role: DataTypes.ENUM("superadmin", "admin", "user"),
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Users",
            paranoid: true,
            timestamps: true,
        }
    );

    return Users;
};
