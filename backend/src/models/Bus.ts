import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
}, { timestamps: true });

const busSchema = new mongoose.Schema({
  busNumber: { type: String, required: true, unique: true },
  operator: { type: String, required: true },
  type: { type: String, required: true }, // e.g. 'AC Sleeper', 'Non-AC Seater'
  totalSeats: { type: Number, required: true },
  amenities: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, required: true, default: 0 },
  numReviews: { type: Number, required: true, default: 0 },
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
