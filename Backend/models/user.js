const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    street: {
      type: String,
      default: "",
    },
    apartment: {
      type: String,
      default: "",
    },
    zip: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

userSchema.pre("save", async function () {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("User", userSchema);
