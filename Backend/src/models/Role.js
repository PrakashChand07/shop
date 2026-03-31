const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new Schema(
  {
    companyId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Company',
                required: [true, 'Company is required'],
            },
    roleName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,  // Never returned in queries unless explicitly requested
    },
    department: {
      type: String,
      default: "",
    },
    permissions: [
      {
        module: String,
        canRead: { type: Boolean, default: false },
        canCreate: { type: Boolean, default: false },
        canUpdate: { type: Boolean, default: false },
        canDelete: { type: Boolean, default: false },
        isVisible: { type: Boolean, default: true },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
RoleSchema.index({ companyId: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Role", RoleSchema);
