import mongoose from 'mongoose';


const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: ['direct', 'group'],
      default: 'group',
    },
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    lastMessage: {
      content: String,
      senderId: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
    },
  },
  { timestamps: true }
);

roomSchema.methods.isParticipant = function (userId) {
  return this.participants.includes(userId);
};

const Room = mongoose.model('Room', roomSchema);
export default Room;
