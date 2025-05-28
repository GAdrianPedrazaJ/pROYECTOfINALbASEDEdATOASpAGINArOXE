import Vue from 'vue';
import Vuex from 'vuex';
import cart from './modules/cart'; 

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    usuarioAutenticado: null,
  },
  getters: {
    usuarioAutenticado: (state) => state.usuarioAutenticado,
    isLoggedIn: (state) => !!state.usuarioAutenticado,
  },
  mutations: {
    setUsuarioAutenticado(state, usuario) {
      state.usuarioAutenticado = usuario;
    },
    logout(state) {
      state.usuarioAutenticado = null;
    },
  },
  actions: {
    loginUsuario({ commit }, usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
      commit('setUsuarioAutenticado', usuario);
    },
    logoutUsuario({ commit }) {
      localStorage.removeItem('usuario');
      commit('logout');
    },
    cargarUsuarioDesdeStorage({ commit }) {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (usuario) {
        commit('setUsuarioAutenticado', usuario);
      }
    },
  },
  modules: {
    cart, 
  },
});