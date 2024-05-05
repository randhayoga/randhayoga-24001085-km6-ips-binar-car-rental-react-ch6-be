const express = require("express");
const router = express.Router();

const carsController = require("../controller/cars");
const { authMiddleware } = require("../middleware/auth");

router
    .route("/")
    .get(authMiddleware(["admin", "superadmin"]), carsController.getCars)
    .post(authMiddleware(["admin", "superadmin"]), carsController.createCar);

router
    .route("/:id")
    .get(authMiddleware(["admin", "superadmin"]), carsController.getCarByID)
    .put(authMiddleware(["admin", "superadmin"]), carsController.updateCar)
    .delete(authMiddleware(["admin", "superadmin"]), carsController.deleteCar);

module.exports = router;
