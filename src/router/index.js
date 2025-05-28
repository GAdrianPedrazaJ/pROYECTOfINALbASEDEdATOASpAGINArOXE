import Vue from 'vue';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AboutView from '../views/AboutView.vue'; 
import UsuariosView from '../views/Usuarios.vue';
import ImagenesView from '../views/Imagenes.vue';
import PedidoConfirmado from '../views/PedidoConfirmado.vue'; 

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    
    path: '/about',
    name: 'about', 
    component: AboutView 
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