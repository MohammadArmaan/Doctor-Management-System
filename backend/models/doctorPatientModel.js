const mongoose = require('mongoose');

const doctorPatientSchema = mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Doctor',
        required: true,
    },
    patientId: {
        type: mongoose.Schema.ObjectId,
        ref: 'Patient',
        required: true
    },
    
},
{ 
    uniqueKeys: ['doctorId', 'patientId'],
    toJSON: {
        virtuals: true,
    } 

});

doctorPatientSchema.pre(/^find/, function(next){
    this.populate('doctorId patientId');
    next();
})

const DoctorPatient = mongoose.model('DoctorPatient', doctorPatientSchema);
module.exports = DoctorPatient;