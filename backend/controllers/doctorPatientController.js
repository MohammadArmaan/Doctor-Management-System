const Doctor = require("./../models/doctorModel");
const Patient = require("./../models/patientModel");
const DoctorPatient = require("./../models/doctorPatientModel");

exports.linkPatient = async (req, res, next) => {
    try {
        const doctorId = req.doctor._id;
        const patientEmail = req.body.email;

        const patient = await Patient.findOne({ email: patientEmail });
        if (!patient) {
            return res.status(404).json({
                status: "error",
                message: "Patient not found",
            });
        }

        const patientId = patient._id; // Get the ObjectId of the patient document

        const existingRelationship = await DoctorPatient.findOne({
            doctorId,
            patientId,
        });
        if (existingRelationship) {
            return res.status(400).json({
                status: "error",
                message: "Patient is already linked to this doctor",
            });
        }

        const doctorPatient = await DoctorPatient.create({
            doctorId,
            patientId,
        }); // Pass patientId instead of patientEmail

        res.status(201).json({
            status: "success",
            data: {
                doctorPatient,
            },
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getAll = async (req, res, next) => {
    try {
        const doctorPatients = await DoctorPatient.find();
        res.status(200).json({
            status: "success",
            results: doctorPatients.length,
            data: {
                doctorPatients,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const doctorPatient = await DoctorPatient.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                doctorPatient,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.deleteOne = async (req, res, next) => {
    try {
        const doctorPatient = await DoctorPatient.findByIdAndDelete(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json();
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};
