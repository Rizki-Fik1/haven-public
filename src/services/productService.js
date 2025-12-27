import api from './axios';

/**
 * Get all products with pagination and filters
 */
export async function getProducts(params = {}) {
  try {
    const response = await api.get('/getProduk', { params });
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching products:', error);
    }
    throw error;
  }
}

/**
 * Get product by ID
 */
export async function getProductById(id) {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error(`Error fetching product ${id}:`, error);
    }
    throw error;
  }
}

/**
 * Get cart items
 */
export async function getCart() {
  try {
    const response = await api.get('/cart');
    return response.data;
  } catch (error) {
    if (!error.isNotFound) {
      console.error('Error fetching cart:', error);
    }
    throw error;
  }
}

/**
 * Add item to cart
 */
export async function addToCart(productId, quantity = 1) {
  try {
    const response = await api.post('/cart', {
      product_id: productId,
      quantity
    });
    return response.data;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(cartItemId) {
  try {
    const response = await api.delete(`/cart/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
}

/**
 * Update cart item quantity
 */
export async function updateCartQuantity(cartItemId, quantity) {
  try {
    const response = await api.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
}

export default {
  getProducts,
  getProductById,
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
};
