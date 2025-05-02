import mongoose from 'mongoose'

const holidaySchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
   },
   date: {
    type: Date,
    required: true,
   } 
}, {timestamps: true})

const HolidayModel = mongoose.model("Holiday", holidaySchema);
export default HolidayModel;