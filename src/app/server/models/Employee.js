const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  city: { type: String, required: true },
  salary: { type: Number, required: true },
  gender: { type: String },
  email: { type: String },
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
