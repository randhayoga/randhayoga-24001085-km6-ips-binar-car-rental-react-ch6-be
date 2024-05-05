const crypto = require("crypto");
const path = require("path");
const bcrypt = require("bcrypt");
const { Users: users } = require("../../models");
const { Op } = require("sequelize");
const { uploader } = require("../../helper/cloudinary");
const { getCache, setCache, deleteCache } = require("../../helper/redis");

exports.createUser = async (payload) => {
    payload.password = bcrypt.hashSync(payload.password, 10);

    if (payload.photo) {
        const { photo } = payload;
        photo.publicId = crypto.randomBytes(16).toString("hex");
        photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

        const imageUpload = await uploader(photo);
        payload.photo = imageUpload.secure_url;
    }

    // save to db
    const data = await users.create(payload);

    // save to redis (email and id)
    const keyID = `user:${data.id}`;
    const keyEmail = `user:${data.email}`;
    await setCache(keyID, data, 300);
    await setCache(keyEmail, data, 300);

    return data;
};

exports.createAdmin = async (payload) => {
    payload.password = bcrypt.hashSync(payload.password, 10);

    if (payload.photo) {
        const { photo } = payload;
        photo.publicId = crypto.randomBytes(16).toString("hex");
        photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

        const imageUpload = await uploader(photo);
        payload.photo = imageUpload.secure_url;
    }

    // save to db
    payload.role = "admin";
    const data = await users.create(payload);

    // save to redis (email and id)
    const keyID = `user:${data.id}`;
    const keyEmail = `user:${data.email}`;
    await setCache(keyID, data, 300);
    await setCache(keyEmail, data, 300);

    return data;
};

exports.getAllUsers = async (roles) => {
    const key = `users:${roles}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        if (roles) {
            data = await users.findAll({
                where: {
                    role: {
                        [Op.or]: roles,
                    },
                },
            });
        } else {
            data = await users.findAll();
        }

        if (data.length > 0) {
            await setCache(key, data, 300);
            return data;
        } else {
            throw new Error(`Not a single user found!`);
        }
    }
};

exports.getUserByID = async (id, roles) => {
    const key = `user:${id}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        const whereCondition = { id };

        if (roles) {
            whereCondition.role = {
                [Op.or]: roles,
            };
        }

        data = await users.findAll({ where: whereCondition });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`${roles ? "Admin" : "User"} is not found!`);
        }
    }
};

exports.getUserByEmail = async (email) => {
    // Generic, IDGAF about the role, care only after getting the token to determine the UI
    const key = `user:${email}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        data = await users.findOne({ where: { email } });

        if (data) {
            await setCache(key, data, 300);
            return data;
        } else {
            throw new Error("User is not found!");
        }
    }
};

exports.updateUser = async (id, payload) => {
    const key = `user:${id}`;

    // photo upload
    if (payload.photo) {
        const { photo } = payload;
        photo.publicId = crypto.randomBytes(16).toString("hex");
        photo.name = `${photo.publicId}${path.parse(photo.name).ext}`;

        const imageUpload = await uploader(photo);
        payload.photo = imageUpload.secure_url;
    }

    // update data in db
    await users.update(payload, {
        where: {
            id,
        },
    });

    // get data from db in order to update the cache
    const data = await users.findAll({
        where: {
            id,
        },
    });

    if (data.length > 0) {
        await deleteCache(key);
        await setCache(key, data[0], 300);
        return data[0];
    } else {
        throw new Error(`User is not found!`);
    }
};

exports.deleteUser = async (id) => {
    const key = `user:${id}`;

    // delete data in db
    await users.destroy({
        where: {
            id,
            role: {
                [Op.or]: roles,
            },
        },
    });

    // delete data in cache
    await deleteCache(key);
};
