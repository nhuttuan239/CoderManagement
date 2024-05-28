const { default: mongoose } = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    role: { type: String, enum: ["manager", "employee"], default: "employee" },
    task_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Task" }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
