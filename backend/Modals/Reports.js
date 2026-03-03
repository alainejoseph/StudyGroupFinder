var mongoose = require("mongoose")


const reportSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  targetType: {
    type: String,
    enum: ["user", "group", "message"]
  },
  targetId: mongoose.Schema.Types.ObjectId,

  reason: String,

  status: {
    type: String,
    enum: ["pending", "resolved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("reports", reportSchema);
