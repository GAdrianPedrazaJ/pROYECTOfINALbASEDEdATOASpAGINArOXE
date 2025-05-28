<template>
  <v-app>
    <v-app-bar
      app
      dark
      class="custom-app-bar"
    >
      <v-container class="fill-height d-flex align-center">
        <div>
          <v-btn
            v-for="(item, index) in rutasIzquierda"
            :key="index"
            text
            :to="item.ruta"
            class="white--text"
          >
            <span class="mr-2">{{ item.nombre }}</span>
          </v-btn>
        </div>

        <v-spacer></v-spacer>

        <v-btn
          v-if="isAdminUser"
          text
          :to="{ name: 'usuarios', params: { id: usuarioAutenticado ? usuarioAutenticado.id : '' } }"
          class="white--text"
        >
          <span class="mr-2">Admin</span>
        </v-btn>

        <v-spacer></v-spacer>

        <div v-if="isLoggedIn">
          <span class="mr-4 white--text">Hola, {{ usuarioAutenticado.nombre_completo }}</span>
          <v-btn text class="white--text" @click="cerrarSesion">Cerrar sesión</v-btn>
        </div>
        <div v-else>
          <v-btn
            text
            class="white--text mr-2"
            @click="dialogLogin = true"
          >
            <span class="mr-2">Login</span>
          </v-btn>
          <v-btn
            text
            class="white--text"
            @click="dialogRegister = true"
          >
            <span class="mr-2">Registro</span>
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <Footer />

    <v-dialog v-model="dialogLogin" persistent width="auto">
      <LoginPage
        @login-success="handleLoginSuccess"
        @close="dialogLogin = false"
        @open-register="dialogRegister = true; dialogLogin = false"
        @open-forgot-password="dialogForgotPassword = true; dialogLogin = false"
        @open-delete-account="dialogDeleteAccount = true; dialogLogin = false"
      />
    </v-dialog>

    <v-dialog v-model="dialogRegister" persistent width="auto">
      <RegisterPage
        @register-success="handleRegisterSuccess"
        @close="dialogRegister = false"
        @open-login="dialogLogin = true; dialogRegister = false"
      />
    </v-dialog>

    <v-dialog v-model="dialogForgotPassword" persistent width="auto">
      <ForgotPassword @close="dialogForgotPassword = false" @open-login="dialogLogin = true" />
    </v-dialog>

    <v-dialog v-model="dialogDeleteAccount" persistent width="auto">
      <DeleteAccount @close="dialogDeleteAccount = false" @open-login="dialogLogin = true" />
    </v-dialog>
  </v-app>
</template>

<script>
import Footer from '@/components/Footer.vue';
import LoginPage from '@/views/LoginPage.vue';
import RegisterPage from '@/views/RegisterPage.vue';
import ForgotPassword from '@/components/ForgotPassword.vue';
import DeleteAccount from '@/components/DeleteAccount.vue';
import { mapGetters } from 'vuex';
import { esAdmin } from '@/utils/adminAuth'; 

export default {
  name: 'App',
  components: {
    Footer,
    LoginPage,
    RegisterPage,
    ForgotPassword,
    DeleteAccount,
  },
  computed: {
    ...mapGetters(['usuarioAutenticado', 'isLoggedIn']),
    isAdminUser() {
      return esAdmin(); 
    },
  },
  methods: {
    cerrarSesion() {
      this.$store.dispatch('logoutUsuario');
      this.$router.push('/login');
    },
    handleLoginSuccess() {
      this.dialogLogin = false;
    },
    handleRegisterSuccess() {
      this.dialogRegister = false;
    },
  },
  data: () => ({
    dialogLogin: false,
    dialogRegister: false,
    dialogForgotPassword: false,
    dialogDeleteAccount: false,
    rutasIzquierda: [
      { nombre: 'Tienda', ruta: '/' },
      { nombre: 'Carrito', ruta: '/about' },
      { nombre: 'Acerca DE', ruta: '/imagenes' },
    ],
    rutasDerecha: [],
  }),
  created() {
    this.$store.dispatch('cargarUsuarioDesdeStorage');
  },
};
</script>

<style scoped>
.custom-app-bar {
  background-color: #1a1a1a !important;
  border-bottom: 3px solid #f06292 !important;
}

.v-btn--text {
  padding: 0 16px;
}
</style>