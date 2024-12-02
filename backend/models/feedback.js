// User Feedback Model Schema
import mongoose from "mongoose";

const UserFeedbackSchema = new mongoose.Schema({
    userId: {
      type: String,
      required: true,
      unique: true
    },
    feedbacks: [{
      message: String,
      importance: {
        type: Number,
        min: 1,
        max: 5
      }
    }],
    systemInstruction: {
      type: String,
      default: 'Default system instruction'
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  });


  export default mongoose.models.userFeedbacks ||
  mongoose.model("userFeedbacks", UserFeedbackSchema);
