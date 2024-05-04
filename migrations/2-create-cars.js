"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Cars", {
            id: {
                primaryKey: true,
                autoIncrement: true,
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            manufacturerName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            modelName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            type: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            year: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            transmission: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.STRING,
            },
            capacity: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            rentPerDay: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            plate: {
                type: Sequelize.STRING,
                unique: true,
                allowNull: false,
            },
            available: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            availableAt: {
                type: Sequelize.DATE,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            createdBy: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            updatedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            deletedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Users",
                    key: "id",
                },
            },
            createdAt: {
                type: Sequelize.DATE,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Cars");
    },
};
