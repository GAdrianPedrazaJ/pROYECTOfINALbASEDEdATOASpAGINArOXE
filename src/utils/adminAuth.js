// src/utils/adminAuth.js
import store from '@/store'; // Asegúrate de que la ruta a tu store sea correcta

export function esAdmin() {
  return store.getters.isLoggedIn && store.getters.usuarioAutenticado && store.getters.usuarioAutenticado.is_admin;
}