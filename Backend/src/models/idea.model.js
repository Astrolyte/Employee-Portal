import mongoose, { Schema } from "mongoose";

const ideaSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    status: {
      type: String,
      enum: ["pending", "under-review", "approved", "rejected", "implemented"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    attachments: [
      {
        fileName: String,
        fileUrl: String,
      },
    ],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
          maxlength: 500,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
ideaSchema.index({ creator: 1, createdAt: -1 });
ideaSchema.index({ category: 1, status: 1 });
ideaSchema.index({ department: 1, status: 1 });
ideaSchema.index({ status: 1, createdAt: -1 });

// Virtual for like count
ideaSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
ideaSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Ensure virtual fields are serialized
ideaSchema.set("toJSON", { virtuals: true });
ideaSchema.set("toObject", { virtuals: true });

export const Idea = mongoose.model("Idea", ideaSchema);