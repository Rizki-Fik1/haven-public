// Cart utilities using localStorage

const CART_KEY = 'haven_cart';

/**
 * Get cart items from localStorage
 */
export const getCartItems = () => {
  try {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

/**
 * Save cart items to localStorage
 */
export const saveCartItems = (items) => {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    return false;
  }
};

/**
 * Add item to cart
 */
export const addToCart = (product, quantity = 1) => {
  const cart = getCartItems();
  const existingItemIndex = cart.findIndex(item => item.id_produk === product.id_produk);

  if (existingItemIndex > -1) {
    // Update quantity if item already exists
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      ...product,
      quantity,
      addedAt: new Date().toISOString()
    });
  }

  saveCartItems(cart);
  return cart;
};

/**
 * Remove item from cart
 */
export const removeFromCart = (productId) => {
  const cart = getCartItems();
  const updatedCart = cart.filter(item => item.id_produk !== productId);
  saveCartItems(updatedCart);
  return updatedCart;
};

/**
 * Update item quantity
 */
export const updateCartItemQuantity = (productId, quantity) => {
  const cart = getCartItems();
  const itemIndex = cart.findIndex(item => item.id_produk === productId);

  if (itemIndex > -1) {
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      return removeFromCart(productId);
    }
    cart[itemIndex].quantity = quantity;
    saveCartItems(cart);
  }

  return cart;
};

/**
 * Clear entire cart
 */
export const clearCart = () => {
  localStorage.removeItem(CART_KEY);
  return [];
};

/**
 * Get cart total
 */
export const getCartTotal = () => {
  const cart = getCartItems();
  return cart.reduce((total, item) => {
    const price = parseInt(item.harga || 0);
    const quantity = parseInt(item.quantity || 1);
    return total + (price * quantity);
  }, 0);
};

/**
 * Get cart item count
 */
export const getCartItemCount = () => {
  const cart = getCartItems();
  return cart.reduce((count, item) => count + (item.quantity || 1), 0);
};

export default {
  getCartItems,
  saveCartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  getCartTotal,
  getCartItemCount
};
