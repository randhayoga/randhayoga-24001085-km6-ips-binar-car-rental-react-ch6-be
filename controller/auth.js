const {
    registerUser,
    registerAdmin,
    loginUser,
    getAllUsers,
    getUserByID,
    updateUser,
    deleteUser,
} = require("../usecase/auth");

exports.registerUser = async (req, res, next) => {
    try {
        const { email, password, name } = req?.body;
        const { photo } = req?.files;

        if (email == "" || !email) {
            return next({
                message: "Email must be filled!",
                statusCode: 400,
            });
        }
        if (password == "" || !password) {
            return next({
                message: "Password must be filled!",
                statusCode: 400,
            });
        }
        if (name == "" || !name) {
            return next({
                message: "Name must be filled!",
                statusCode: 400,
            });
        }

        const data = await registerUser({
            email,
            password,
            name,
            photo,
        });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.registerAdmin = async (req, res, next) => {
    try {
        const { email, password, name } = req?.body;
        const { photo } = req?.files;

        if (email == "" || !email) {
            return next({
                message: "Email must be filled!",
                statusCode: 400,
            });
        }
        if (password == "" || !password) {
            return next({
                message: "Password must be filled!",
                statusCode: 400,
            });
        }
        if (name == "" || !name) {
            return next({
                message: "Name must be filled!",
                statusCode: 400,
            });
        }

        const data = await registerAdmin({
            email,
            password,
            name,
            photo,
        });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req?.body;

        if (email == "" || !email) {
            return next({
                message: "Email must be filled!",
                statusCode: 400,
            });
        }
        if (password == "" || !password) {
            return next({
                message: "Password must be filled!",
                statusCode: 400,
            });
        }

        const data = await loginUser(email, password);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.profile = async (req, res, next) => {
    try {
        // get user by id from token
        const data = req?.user;

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.getAllUsers = async (req, res, next) => {
    try {
        const { roles } = req?.query;

        const data = await getAllUsers(roles);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.getUserByID = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const { roles } = req?.query;

        const data = await getUserByID(id, roles);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const { email, password, name } = req?.body;
        const { photo } = req?.files;
        const currentRole = req?.user?.role;
        const currentID = req?.user?.id;

        if (email == "" || !email) {
            return next({
                message: "Email must be filled!",
                statusCode: 400,
            });
        }
        if (password == "" || !password) {
            return next({
                message: "Password must be filled!",
                statusCode: 400,
            });
        }
        if (name == "" || !name) {
            return next({
                message: "Name must be filled!",
                statusCode: 400,
            });
        }

        if (currentID !== id && currentRole !== "superadmin") {
            throw new Error(`Forbidden!`);
        }

        const data = await updateUser(id, {
            email,
            password,
            name,
            photo,
        });

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const currentID = req?.user?.id;
        const currentRole = req?.user?.role;

        if (currentID !== id && currentRole !== "superadmin") {
            throw new Error(`Forbidden!`);
        }

        const data = await deleteUser(id);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};
