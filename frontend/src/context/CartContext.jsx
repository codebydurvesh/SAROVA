import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

/**
 * Cart Provider component
 * Manages shopping cart state
 */
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    // Load cart from localStorage on init
    const savedCart = localStorage.getItem('savora_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('savora_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  /**
   * Add item to cart
   */
  const addToCart = useCallback((item, quantity = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((i) => i._id === item._id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prev.map((i) =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      
      // Add new item
      return [...prev, { ...item, quantity }];
    });
  }, []);

  /**
   * Remove item from cart
   */
  const removeFromCart = useCallback((itemId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== itemId));
  }, []);

  /**
   * Update item quantity
   */
  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  /**
   * Increment item quantity
   */
  const incrementQuantity = useCallback((itemId) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  }, []);

  /**
   * Decrement item quantity
   */
  const decrementQuantity = useCallback((itemId) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i._id === itemId);
      
      if (item && item.quantity <= 1) {
        return prev.filter((i) => i._id !== itemId);
      }
      
      return prev.map((i) =>
        i._id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  }, []);

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  /**
   * Get cart item by ID
   */
  const getCartItem = useCallback(
    (itemId) => cartItems.find((item) => item._id === itemId),
    [cartItems]
  );

  /**
   * Check if item is in cart
   */
  const isInCart = useCallback(
    (itemId) => cartItems.some((item) => item._id === itemId),
    [cartItems]
  );

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerUnit * item.quantity,
    0
  );
  
  const gstRate = 0.18; // 18% GST
  const gstAmount = subtotal * gstRate;
  const total = subtotal + gstAmount;
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cartItems,
    itemCount,
    subtotal,
    gstAmount,
    gstRate,
    total,
    addToCart,
    removeFromCart,
    updateQuantity,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    getCartItem,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Hook to use cart context
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
