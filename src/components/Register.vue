<template>
  <div class="register">
    <h2>Registrarse</h2>
    <form @submit.prevent="handleRegister">
      <input v-model="username" placeholder="Usuario" required />
      <input type="email" v-model="email" placeholder="Correo" required />
      <input type="password" v-model="password" placeholder="Contraseña" required />
      <button type="submit">Registrarse</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
    };
  },
  methods: {
    handleRegister() {
      console.log('Datos:', this.username, this.email, this.password);
      // Aquí iría la llamada a tu backend (axios.post...)
    },
  },
};
</script>
