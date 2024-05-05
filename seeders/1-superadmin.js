"use strict";
const bcrypt = require("bcrypt");

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("Users", [
            {
                email: "superadmin@binar.com",
                password: await bcrypt.hash("superadmin", 10),
                name: "Super Admin",
                role: "superadmin",
                createdAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("Users", {
            email: "superadmin@binar.com",
        });
    },
};
