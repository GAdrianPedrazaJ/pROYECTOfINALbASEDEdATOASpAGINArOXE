import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue'; // Mantenemos el nombre AboutView.vue para el carrito
import UsuariosView from '../views/Usuarios.vue';
import ImagenesView from '../views/Imagenes.vue';
import PedidoConfirmado from '../views/PedidoConfirmado.vue'; // Agregamos el componente de confirmación

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    // Mantenemos la ruta '/about' y el componente 'AboutView' para el carrito
    path: '/about',
    name: 'about', // El nombre de la ruta sigue siendo 'about'
    component: AboutView // El componente sigue siendo AboutView
  },
  {
    path: '/usuarios/:id',
    name: 'usuarios',
    component: UsuariosView
  },
  {
    path: '/imagenes',
    name: 'imagenes',
    component: ImagenesView
  },
  {
    path: '/pedido-confirmado', // Nueva ruta para la página de confirmación
    name: 'pedido-confirmado',
    component: PedidoConfirmado
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;


//node --watch backend/index.js
//node --watch backend/documentacion.js
//npm run serve