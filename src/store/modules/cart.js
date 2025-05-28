// store/modules/cart.js
const state = {
  items: [], // Array para almacenar los productos en el carrito
};

const getters = {
  cartItems: (state) => state.items,
  cartTotalQuantity: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
  cartTotalPrice: (state) =>
    state.items.reduce((total, item) => total + item.product.precio * item.quantity, 0).toFixed(2),
};

const actions = {
  addToCart({ commit, state }, product) {
    const existingItem = state.items.find((item) => item.product.id === product.id);

    if (existingItem) {
      commit('incrementItemQuantity', existingItem);
    } else {
      commit('addItemToCart', product);
    }
  },
  removeFromCart({ commit }, productId) {
    commit('removeItem', productId);
  },
  incrementQuantity({ commit }, cartItem) {
    commit('incrementItemQuantity', cartItem);
  },
  decrementQuantity({ commit }, cartItem) {
    commit('decrementItemQuantity', cartItem);
  },
};

const mutations = {
  addItemToCart(state, product) {
    state.items.push({ product, quantity: 1 });
  },
  removeItem(state, productId) {
    state.items = state.items.filter((item) => item.product.id !== productId);
  },
  incrementItemQuantity(state, cartItem) {
    cartItem.quantity++;
  },
  decrementItemQuantity(state, cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity--;
    }
  },
  clearCart(state) {
    state.items = [];
  },
};

export default {
  namespaced: true, // Importante para modularizar el store
  state,
  getters,
  actions,
  mutations,
};