const carsUseCase = require("../usecase/cars");

exports.createCar = async (req, res, next) => {
    try {
        const {
            manufacturerName,
            modelName,
            type,
            year,
            transmission,
            capacity,
            rentPerDay,
            plate,
            available,
            availableAt,
            description,
        } = req?.body;
        const { image } = req?.files;
        const createdBy = req?.user?.id;

        if (!manufacturerName || manufacturerName === "") {
            return next({
                message: "Manufacturer name is required",
                statusCode: 400,
            });
        }
        if (!modelName || modelName === "") {
            return next({
                message: "Model name is required",
                statusCode: 400,
            });
        }
        if (!type || type === "") {
            return next({
                message: "Type is required",
                statusCode: 400,
            });
        }
        if (!year || year === "") {
            return next({
                message: "Year is required",
                statusCode: 400,
            });
        }
        if (!transmission || transmission === "") {
            return next({
                message: "Transmission is required",
                statusCode: 400,
            });
        }
        if (!capacity || capacity === "" || parseInt(capacity) < 0) {
            return next({
                message: "Valid capacity is required",
                statusCode: 400,
            });
        }
        if (!rentPerDay || rentPerDay === "" || parseInt(rentPerDay) < 0) {
            return next({
                message: "Valid rent per day is required",
                statusCode: 400,
            });
        }
        if (!plate || plate === "") {
            return next({
                message: "Plate is required",
                statusCode: 400,
            });
        }
        if (!available || available === "") {
            return next({
                message: "Available is required",
                statusCode: 400,
            });
        }
        if (!availableAt || availableAt === "") {
            return next({
                message: "Available at is required",
                statusCode: 400,
            });
        }
        if (!description || description === "") {
            return next({
                message: "Description is required",
                statusCode: 400,
            });
        }

        const data = await carsUseCase.createCar({
            manufacturerName,
            modelName,
            type,
            year,
            transmission,
            capacity,
            rentPerDay,
            plate,
            available,
            availableAt,
            description,
            image,
            createdBy,
        });

        res.status(201).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.getCars = async (req, res, next) => {
    try {
        const data = await carsUseCase.getCars();

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.getCarByID = async (req, res, next) => {
    try {
        const { id } = req?.params;
        if (!id || id === "") {
            return next({
                message: "ID is required",
                statusCode: 400,
            });
        }

        const data = await carsUseCase.getCarByID(id);
        if (!data) {
            return next({
                message: `Car with id ${id} is not found`,
                statusCode: 404,
            });
        }

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateCar = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const image = req?.files?.image;
        const editedBy = req?.user?.id;

        let payload = {};
        for (let key in req.body) {
            if (req.body[key] !== "") {
                payload[key] = req.body[key];
            }
        }
        if (image) {
            payload.image = image;
        }
        payload.editedBy = editedBy;

        const data = await carsUseCase.updateCar(id, payload);

        res.status(201).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteCar = async (req, res, next) => {
    try {
        const { id } = req?.params;
        const deletedBy = req?.user?.id;

        const data = await carsUseCase.deleteCar(id, deletedBy);

        res.status(200).json({
            message: "Success",
            data,
        });
    } catch (error) {
        next(error);
    }
};
