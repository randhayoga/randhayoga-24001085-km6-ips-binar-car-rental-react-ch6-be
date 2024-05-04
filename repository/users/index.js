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

exports.getUserByID = async (id) => {
    const key = `user:${id}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        data = await users.findAll({
            where: {
                id,
            },
        });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`User is not found!`);
        }
    }
};

exports.getUserByEmail = async (email) => {
    // For loggin in as regular user
    const key = `user:${email}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        data = await users.findAll({
            where: {
                email,
                role: "user",
            },
        });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`User is not found!`);
        }
    }
};

exports.getAdminByID = async (id) => {
    // For logging in as admin or superadmin
    const key = `user:${id}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        data = await users.findAll({
            where: {
                id,
                role: {
                    [Op.or]: ["admin", "superadmin"],
                },
            },
        });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`Admin is not found!`);
        }
    }
};

exports.getAdminByEmail = async (email) => {
    // For logging in as admin or superadmin
    const key = `user:${email}`;
    let data = await getCache(key);

    if (data) {
        return data;
    } else {
        // data is not in cache, then get data from db
        data = await users.findAll({
            where: {
                email,
                role: {
                    [Op.or]: ["admin", "superadmin"],
                },
            },
        });

        if (data.length > 0) {
            await setCache(key, data[0], 300);
            return data[0];
        } else {
            throw new Error(`Admin is not found!`);
        }
    }
};

exports.updateUser = async (id, payload) => {
    const key = `user:${id}`;
    const existingUser = await users.findOne({ where: { id } });

    if (payload.photo && payload.photo !== existingUser.photo) {
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

exports.updateAdmin = async (id, payload) => {
    const key = `user:${id}`;
    const existingAdmin = await users.findOne({
        where: { id, role: { [Op.or]: ["admin", "superadmin"] } },
    });

    if (payload.photo && payload.photo !== existingAdmin.photo) {
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
            role: {
                [Op.or]: ["admin", "superadmin"],
            },
        },
    });

    // get data from db in order to update the cache
    const data = await users.findAll({
        where: {
            id,
            role: {
                [Op.or]: ["admin", "superadmin"],
            },
        },
    });

    if (data.length > 0) {
        await deleteCache(key);
        await setCache(key, data[0], 300);
        return data[0];
    } else {
        throw new Error(`Admin is not found!`);
    }
};

exports.deleteUser = async (id) => {
    const key = `user:${id}`;

    // delete data in db
    await users.destroy({
        where: {
            id,
        },
    });

    // delete data in cache
    await deleteCache(key);
};

exports.deleteAdmin = async (id) => {
    const key = `user:${id}`;

    // delete data in db
    await users.destroy({
        where: {
            id,
            role: {
                [Op.or]: ["admin", "superadmin"],
            },
        },
    });

    // delete data in cache
    await deleteCache(key);
};
