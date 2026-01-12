import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ingredient name is required'],
      trim: true,
      unique: true,
    },
    image: {
      url: {
        type: String,
        required: [true, 'Ingredient image is required'],
      },
      publicId: {
        type: String,
      },
    },
    category: {
      type: String,
      enum: ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Seafood', 'Grains', 'Spices', 'Other'],
      default: 'Other',
    },
    unit: {
      type: String,
      default: 'grams',
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    stock: {
      type: Number,
      default: 100,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
