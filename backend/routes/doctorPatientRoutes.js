const express = require("express");

const doctorController = require("./../controllers/doctorController");
const doctorPatientController = require("./../controllers/doctorPatientController");

const router = express.Router();

router
    .route("/")
    .get(doctorPatientController.getAll)
    .post(doctorController.protect, doctorPatientController.linkPatient);

router
    .route("/:id")
    .get(doctorPatientController.getOne)
    .delete(doctorPatientController.deleteOne);

module.exports = router;
