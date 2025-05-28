// src/utils/adminAuth.js
import store from '@/store'; 

export function esAdmin() {
  return store.getters.isLoggedIn && store.getters.usuarioAutenticado && store.getters.usuarioAutenticado.is_admin;
}