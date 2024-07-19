const Doctor = require("./../models/doctorModel");
const jwt = require("jsonwebtoken");
const sendEmail = require("./../utils/emails");
const crypto = require("crypto");

exports.getAll = async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json({
            status: "success",
            results: doctors.length,
            data: {
                doctors,
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
        const doctor = await Doctor.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                doctor,
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
        const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: "success",
            data: {
                doctor,
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
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
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

const createSendToken = (doctor, statusCode, req, res) => {
    // const token = signToken(doctor._id);

    if (!doctor) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
        role: "doctor",
        _id: doctor._id,
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

    doctor.password = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            doctor,
        },
    });
};

exports.signup = async (req, res, next) => {
    try {
        const newDoctor = await Doctor.create({
            name: req.body.name,
            email: req.body.email,
            specialty: req.body.specialty,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm,
        });

        const subject = "Welcome to the Doctor Management System";
        const text = `Thanks for joining Doctor Management System, Start Exploring our website in http://localhost:5173//`;
        sendEmail(req.body.email, subject, text, (err) => {
            res.status(400).json({
                status: "error",
                message: err.message,
            });
        });

        createSendToken(newDoctor, 201, req, res);
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

    const doctor = await Doctor.findOne({ email }).select("+password");

    if (!doctor || !(await doctor.correctPassword(password, doctor.password))) {
        res.status(400).json({
            status: "error",
            data: {
                message: "Email or password did not matched!",
            },
        });
        next();
    }

    createSendToken(doctor, 200, req, res);
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
    const currentDoctor = await Doctor.findById(decoded.id);
    if (!currentDoctor) {
        return res.status(401).json({
            status: "fail",
            message:
                "The docotor belonging to this token does no longer exist.",
        });
    }

    req.doctor = currentDoctor;
    next();
};

const createPasswordResetToken = (doctor) => {
    const resetToken = crypto.randomBytes(32).toString("hex");
    doctor.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    doctor.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    return resetToken;
};

// Forgot Password Handler
exports.forgotPassword = async (req, res, next) => {
    try {
        const doctor = await Doctor.findOne({ email: req.body.email });
        if (!doctor) {
            return res.status(404).json({
                status: "error",
                message: "No doctor found with that email",
            });
        }

        const resetToken = createPasswordResetToken(doctor);
        await doctor.save({ validateBeforeSave: false });

        const subject = "Reset Your Password";
        const text = `Reset your password at http://localhost:5173/resetPassword/doctors/${resetToken}`;

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

        const doctor = await Doctor.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        });

        if (!doctor) {
            return res.status(404).json({
                status: "error",
                message: "Token is invalid or has expired",
            });
        }

        doctor.password = req.body.password;
        doctor.passwordConfirm = req.body.passwordConfirm;
        doctor.passwordResetToken = undefined;
        doctor.passwordResetExpires = undefined;
        await doctor.save();

        createSendToken(doctor, 200, req, res);
    } catch (err) {
        res.status(400).json({
            status: "error",
            message: err.message,
        });
    }
};
