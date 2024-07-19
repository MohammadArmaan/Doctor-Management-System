const Patient = require("./../models/patientModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../utils/emails");
const crypto = require("crypto");

exports.getAll = async (req, res, next) => {
    try {
        const patients = await Patient.find();
        res.status(200).json({
            status: "success",
            results: patients.length,
            data: {
                patients,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.getOne = async (req, res, next) => {
    try {
        const patient = await Patient.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                patient,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.updateOne = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        res.status(200).json({
            status: "success",
            data: {
                patient,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "error",
            message: err.message,
        });
    }
};

exports.deleteOne = async (req, res, next) => {
    try {
        const patient = await Patient.findByIdAndDelete(req.params.id);
        res.status(200).json();
    } catch (err) {
        res.status(404).json({
            status: "error",
            message: err.message,
        });
    }
};

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

const createSendToken = (patient, statusCode, req, res) => {
    // const token = signToken(patient._id);

    if (!patient) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
        role: "patient",
        _id: patient._id,
    };

    const token = signToken(payload);

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
        ),
        httpOnly: true,
        // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        secure: "production",
        sameSite: "strict",
    };
    res.cookie("jwt", token, cookieOptions);

    patient.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            patient,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newPatient = await Patient.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });

        const subject = "Welcome to the Doctor Management System";
        const text = `Thanks for joining Doctor Management System, Start Exploring our website in http://localhost:5173/`;
        sendEmail(req.body.email, subject, text, (err) => {
            res.status(400).json({
                status: "error",
                message: err.message,
            });
        });

        createSendToken(newPatient, 201, req, res);
    } catch (err) {
        res.status(400).json({
            status: "error",
            data: err.message,
        });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({
            status: "error",
            data: {
                message: "Please provide email and password!",
            },
        });
        next();
    }

    const patient = await Patient.findOne({ email }).select("+password");

    if (
        !patient ||
        !(await patient.correctPassword(password, patient.password))
    ) {
        res.status(400).json({
            status: "error",
            data: {
                message: "Email or password did not matched!",
            },
        });
        next();
    }

    createSendToken(patient, 200, req, res);
};

exports.logout = (req, res, next) => {
    res.cookie("jwt", "loggedout", {
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.set("Cache-Control", "no-store");
    res.status(200).json({ status: "success" });
};

exports.protect = async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (process.env.NODE_ENV === "production" && !token) {
        return res.status(401).render("withoutLogin");
    }
    if (!token) {
        return res.status(401).json({
            status: "fail",
            message: "You are not logged in! Please log in to get access.",
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentPatient = await Patient.findById(decoded.id);
    if (!currentPatient) {
        return res.status(401).json({
            status: "fail",
            message:
                "The patient belonging to this token does no longer exist.",
        });
    }

    req.patient = currentPatient;
    next();
};

const createPasswordResetToken = (patient) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    patient.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    patient.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

// Forgot Password Handler
exports.forgotPassword = async (req, res, next) => {
    try {
        const patient = await Patient.findOne({ email: req.body.email });
        if (!patient) {
            return res.status(404).json({
                status: "error",
                message: "No patient found with that email",
            });
        }

        const resetToken = createPasswordResetToken(patient);
        await patient.save({ validateBeforeSave: false });

        const subject = "Reset Your Password";
        const text = `Reset your password at http://localhost:5173/resetPassword/patients/${resetToken}`;

        sendEmail(req.body.email, subject, text, (err) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message:
                        "There was an error sending the email. Try again later.",
                });
            }

            res.status(200).json({
                status: "success",
                message: "Token sent to email!",
            });
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: err.message,
        });
    }
};

// Reset Password Handler
exports.resetPassword = async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const patient = await Patient.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!patient) {
            return res.status(404).json({
                status: "error",
                message: "Token is invalid or has expired",
            });
        }

        patient.password = req.body.password;
        patient.passwordConfirm = req.body.passwordConfirm;
        patient.passwordResetToken = undefined;
        patient.passwordResetExpires = undefined;
        await patient.save();

        createSendToken(patient, 200, req, res);
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};
