const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto')

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide us your email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email!']
    },
    specialty: {
        type: String,
        required: [true, 'Please specify your specialty!']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password!'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords are not same'
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    }
});

doctorSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
});

doctorSchema.pre(/^find/, function(next){
    this.find({ active: { $ne: false }});
    next();
});

doctorSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword);
}

doctorSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if(this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000, 10
        );
        return JWTTimestamp < changedTimestamp;
    }
    return false;
}

doctorSchema.methods.correctPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;