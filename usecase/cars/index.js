const carsRepo = require("../../repository/cars");

exports.createCar = async (payload) => {
    return await carsRepo.createCar(payload);
};

exports.getCars = async () => {
    return await carsRepo.getCars();
};

exports.getCarByID = async (id) => {
    return await carsRepo.getCarByID(id);
};

exports.updateCar = async (id, payload) => {
    await carsRepo.updateCar(id, payload);
    return await carsRepo.getCarByID(id);
};

exports.deleteCar = async (id, deletedBy) => {
    return await carsRepo.deleteCar(id, deletedBy);
};
