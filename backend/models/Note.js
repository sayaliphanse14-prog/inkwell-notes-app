const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    content: { type: String, default: "", trim: true, maxlength: 5000 },
    tag: { type: String, default: "", trim: true, maxlength: 30 },
    color: {
      type: String,
      enum: ["white", "yellow", "mint", "sky", "rose", "lavender"],
      default: "white",
    },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
