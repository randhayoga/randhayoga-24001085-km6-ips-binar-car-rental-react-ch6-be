"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Cars extends Model {
        static associate(models) {
            Cars.belongsTo(models.Users, {
                foreignKey: "createdBy",
                as: "createdByUser",
            });
            Cars.belongsTo(models.Users, {
                foreignKey: "updatedBy",
                as: "updatedByUser",
            });
            Cars.belongsTo(models.Users, {
                foreignKey: "deletedBy",
                as: "deletedByUser",
            });
        }
    }
    Cars.init(
        {
            manufacturerName: DataTypes.STRING,
            modelName: DataTypes.STRING,
            type: DataTypes.STRING,
            year: DataTypes.INTEGER,
            transmission: DataTypes.STRING,
            image: DataTypes.STRING,
            capacity: DataTypes.INTEGER,
            rentPerDay: DataTypes.INTEGER,
            plate: { type: DataTypes.STRING, unique: true },
            available: DataTypes.BOOLEAN,
            availableAt: DataTypes.DATE,
            description: DataTypes.TEXT,
            createdBy: DataTypes.INTEGER,
            updatedBy: DataTypes.INTEGER,
            deletedBy: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: "Cars",
            paranoid: true,
            timestamps: true,
        }
    );
    return Cars;
};
