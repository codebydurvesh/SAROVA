import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [500, "Comment cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Recipe description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      url: {
        type: String,
        required: [true, "Recipe image is required"],
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    ingredients: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        quantity: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    steps: [
      {
        stepNumber: {
          type: Number,
          required: true,
        },
        instruction: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],
    prepTime: {
      type: Number, // in minutes
      default: 0,
    },
    cookTime: {
      type: Number, // in minutes
      default: 0,
    },
    servings: {
      type: Number,
      default: 1,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Beverage"],
      default: "Lunch",
    },
    dietType: {
      type: String,
      enum: ["Balanced", "Keto", "Vegan", "Intermittent", "Fasting"],
      default: "Balanced",
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for total time
recipeSchema.virtual("totalTime").get(function () {
  return this.prepTime + this.cookTime;
});

// Virtual for like count
recipeSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for comment count
recipeSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
