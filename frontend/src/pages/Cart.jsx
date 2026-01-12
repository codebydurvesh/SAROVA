import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  CheckCircle,
  Package,
} from "lucide-react";
import { useCart } from "../context/CartContext";

/**
 * Cart page component
 * Shows cart items, quantities, and order summary
 */
const Cart = () => {
  const {
    cartItems,
    itemCount,
    subtotal,
    gstAmount,
    gstRate,
    total,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirmOrder = () => {
    setShowConfirmation(true);
    // Clear cart after short delay
    setTimeout(() => {
      clearCart();
    }, 500);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  // Empty cart state
  if (cartItems.length === 0 && !showConfirmation) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ShoppingBag className="w-20 h-20 text-savora-brown-300 mx-auto mb-6" />
            <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-savora-brown-500 mb-8">
              Looks like you haven't added any ingredients yet
            </p>
            <Link
              to="/shopping"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              Start Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          to="/shopping"
          className="inline-flex items-center gap-2 text-savora-brown-500 hover:text-savora-green-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-savora-brown-800">
          Shopping Cart
        </h1>
        <p className="text-savora-brown-500 mt-1">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1">
          <div className="card">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 py-4 border-b border-savora-beige-200 last:border-0"
                >
                  {/* Image */}
                  <img
                    src={item.image?.url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-savora-brown-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-savora-brown-500">
                      ₹{item.pricePerUnit} per {item.unit}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => decrementQuantity(item._id)}
                      className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                    >
                      <Minus className="w-4 h-4 text-savora-brown-600" />
                    </button>
                    <span className="font-medium text-savora-brown-800 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item._id)}
                      className="w-8 h-8 bg-savora-beige-100 rounded-lg flex items-center justify-center hover:bg-savora-beige-200 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-savora-brown-600" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right w-24">
                    <p className="font-semibold text-savora-brown-800">
                      ₹{(item.pricePerUnit * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="p-2 text-savora-brown-400 hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Clear cart button */}
            {cartItems.length > 0 && (
              <div className="pt-4 mt-4 border-t border-savora-beige-200">
                <button
                  onClick={clearCart}
                  className="text-sm text-savora-brown-500 hover:text-red-500 transition-colors"
                >
                  Clear all items
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-96">
          <div className="card sticky top-24">
            <h2 className="text-xl font-serif font-semibold text-savora-brown-800 mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-savora-brown-600">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-savora-brown-600">
                <span>GST ({(gstRate * 100).toFixed(0)}%)</span>
                <span>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-savora-brown-600">
                <span>Delivery</span>
                <span className="text-savora-green-600">Free</span>
              </div>
            </div>

            <div className="pt-4 border-t border-savora-beige-200 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-savora-brown-800">
                  Total
                </span>
                <span className="text-2xl font-bold text-savora-brown-800">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-savora-brown-500 mt-1">
                Including GST
              </p>
            </div>

            <button
              onClick={handleConfirmOrder}
              className="w-full btn-primary text-lg py-4"
            >
              Confirm Order
            </button>

            <p className="text-xs text-savora-brown-400 text-center mt-4">
              By placing this order, you agree to our terms of service
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeConfirmation}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 10 }}
                className="w-20 h-20 bg-savora-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle className="w-10 h-10 text-savora-green-600" />
              </motion.div>

              <h2 className="text-2xl font-serif font-bold text-savora-brown-800 mb-2">
                Order Confirmed!
              </h2>
              <p className="text-savora-brown-500 mb-6">
                Thank you for your order. Your fresh ingredients will be
                delivered soon.
              </p>

              <div className="flex items-center justify-center gap-3 p-4 bg-savora-beige-50 rounded-xl mb-6">
                <Package className="w-6 h-6 text-savora-green-600" />
                <span className="text-savora-brown-600">
                  Estimated delivery: 2-3 business days
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/shopping"
                  className="flex-1 btn-secondary text-center flex items-center justify-center"
                  onClick={closeConfirmation}
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/"
                  className="flex-1 btn-primary flex items-center justify-center"
                  onClick={closeConfirmation}
                >
                  Go Home
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Cart;
