import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  busId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus', required: true },
  routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  date: { type: Date, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  fare: { type: Number, required: true },
  availableSeats: [{ type: String }] // Array of available seat numbers
}, { timestamps: true });

export default mongoose.model('Schedule', scheduleSchema);
