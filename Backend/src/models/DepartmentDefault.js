const mongoose = require("mongoose");
const { Schema } = mongoose;

// Stores the DEFAULT permissions for a given department within a company.
// These are applied to NEW staff added to this department (not existing ones).
const DepartmentDefaultSchema = new Schema(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    department: {
      type: String,
      required: true,
    },
    permissions: [
      {
        module: String,
        canRead:   { type: Boolean, default: true },
        canCreate: { type: Boolean, default: true },
        canUpdate: { type: Boolean, default: true },
        canDelete: { type: Boolean, default: true },
        isVisible: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

// Compound unique: one record per company-department pair
DepartmentDefaultSchema.index({ companyId: 1, department: 1 }, { unique: true });

module.exports = mongoose.model("DepartmentDefault", DepartmentDefaultSchema);
