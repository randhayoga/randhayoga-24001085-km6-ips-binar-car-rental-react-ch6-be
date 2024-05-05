const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
    createUser,
    createAdmin,
    getUserByID,
    getUserByEmail,
    updateUser,
    deleteUser,
} = require("../../repository/users");

exports.registerUser = async (payload) => {
    let user = await createUser(payload);
    delete user.dataValues.password;

    const jwtPayload = {
        id: user.id,
    };

    const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const data = {
        user,
        token,
    };

    return data;
};

exports.registerAdmin = async (payload) => {
    let user = await createAdmin(payload);
    delete user.dataValues.password;

    const jwtPayload = {
        id: user.id,
    };

    const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const data = {
        user,
        token,
    };

    return data;
};

exports.loginUser = async (email, password) => {
    let user = await getUserByEmail(email);
    if (!user) {
        throw new Error(`User is not found!`);
    }

    const isValid = await bcrypt.compare(password, user?.password);
    if (!isValid) {
        throw new Error(`Wrong password!`);
    }

    if (user?.dataValues?.password) {
        delete user?.dataValues?.password;
    } else {
        delete user?.password;
    }

    const jwtPayload = {
        id: user.id,
    };

    const token = jsonwebtoken.sign(jwtPayload, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });

    const data = {
        user,
        token,
    };

    return data;
};

exports.getAllUsers = async (roles) => {
    let data = await getAllUsers(roles);
    if (!data) {
        throw new Error(`Not a single user found!`);
    }

    data = data.map((item) => {
        if (item?.dataValues?.password) {
            delete item?.dataValues?.password;
        } else {
            delete item?.password;
        }

        return item;
    });

    return data;
};

exports.getUserByID = async (id, roles) => {
    let data = await getUserByID(id, roles);
    if (!data) {
        throw new Error(`User is not found!`);
    }

    if (data?.dataValues?.password) {
        delete data?.dataValues?.password;
    } else {
        delete data?.password;
    }

    return data;
};

exports.updateUser = async (id, payload, currentRole, currentID) => {
    let data = await updateUser(id, payload, currentRole, currentID);
    if (!data) {
        throw new Error(`User is not found!`);
    }

    if (data?.dataValues?.password) {
        delete data?.dataValues?.password;
    } else {
        delete data?.password;
    }

    return data;
};

exports.deleteUser = async (id, roles) => {
    let data = await deleteUser(id, roles);
    if (!data) {
        throw new Error(`User is not found!`);
    }

    if (data?.dataValues?.password) {
        delete data?.dataValues?.password;
    } else {
        delete data?.password;
    }

    return data;
};
