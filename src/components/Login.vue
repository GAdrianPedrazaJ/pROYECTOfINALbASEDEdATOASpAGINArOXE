<template>
  <div class="login">
    <h2>Iniciar Sesión</h2>
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Correo" required />
      <input v-model="password" type="password" placeholder="Contraseña" required />
      <button type="submit">Entrar</button>
      
      <!-- Mensaje de error si las credenciales son incorrectas -->
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://localhost:3000/api/usuarios/login', {
          correo: this.email,
          contrasena: this.password
        });

        if (response.data.success) {
          // Guardar usuario en Vuex
          this.$store.dispatch('loginUsuario', response.data.usuario);

          // Redirigir a la página principal
          this.$router.push('/');
        } else {
          this.error = response.data.mensaje || 'Credenciales inválidas';
        }
      } catch (err) {
        this.error = 'Error al iniciar sesión';
        console.error(err);
      }
    }
  }
};
</script>

