<template>
  <v-card class="elevation-12 rounded-lg delete-account-card" style="width: 450px;">
    <v-card-title class="headline white--text delete-account-title text-center">
      Eliminar cuenta
    </v-card-title>
    <v-card-text>
      <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible. Por favor, ingresa tu correo electrónico y contraseña para confirmar.</p>

      <v-text-field
        v-model="email"
        label="Correo electrónico"
        prepend-icon="mdi-email"
        type="email"
        rounded
        outlined
        class="delete-account-input"
      ></v-text-field>

      <v-checkbox
        v-model="confirmDeletion"
        label="Confirmo que deseo eliminar mi cuenta."
        color="error"
      ></v-checkbox>

      <v-text-field
        v-model="password"
        label="Contraseña"
        prepend-icon="mdi-lock"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        rounded
        outlined
        class="delete-account-input"
      ></v-text-field>
    </v-card-text>

    <v-card-actions class="justify-center">
      <v-btn
        color="error"
        :disabled="!confirmDeletion || !password || !email"
        class="mb-4 rounded-pill white--text delete-account-button"
        @click="handleDeleteAccount"
      >
        Eliminar mi cuenta
      </v-btn>
    </v-card-actions>

    <v-card-actions class="justify-end">
      <v-btn text @click="$emit('close'); $emit('open-login')">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      confirmDeletion: false,
      password: '',
      showPassword: false,
      email: '',
      isLoading: false
    };
  },
  methods: {
    async handleDeleteAccount() {
      if (this.isLoading) return; // Evita múltiples envíos
      this.isLoading = true; // Activa el estado de carga

      try {
        const emailNormalizado = this.email.trim().toLowerCase();

        // Validaciones básicas de campos
        if (!emailNormalizado || !this.password) {
          this.$toast.error('Por favor, ingresa tu correo electrónico y contraseña.');
          return; // Detiene la ejecución si faltan campos
        }
        if (!this.confirmDeletion) {
          this.$toast.error('Debes confirmar que deseas eliminar tu cuenta.');
          return; // Detiene la ejecución si no se confirma
        }

        // Realiza la llamada a la API para eliminar la cuenta
        const response = await axios.post(
          'http://localhost:3000/api/usuarios/eliminar-cuenta',
          {
            correo: emailNormalizado,
            contrasena: this.password
          }
        );

        // --- Acciones post-eliminación exitosa ---

        // 1. Limpiar datos de sesión local (localStorage, Vuex store)
        localStorage.removeItem('usuario');
        localStorage.removeItem('token');
        if (this.$store && this.$store.commit) {
            this.$store.commit('logout'); // Llama a tu mutación de logout en Vuex
        }
        
        // 2. Mostrar notificación de éxito al usuario
        this.$toast.success(response.data?.message || 'Cuenta eliminada exitosamente.');

        // 3. Ejecutar la misma lógica que el botón "Cancelar" para volver al login
        // Esto cierra el diálogo actual y le dice al padre que abra el login.
        this.$emit('close'); 
        this.$emit('open-login'); 

      } catch (error) {
        // Manejo de errores de la API
        const errorMessage =
          error.response?.data?.message || 
          error.response?.data?.error ||   
          error.message ||                 
          'Error al eliminar la cuenta. Verifica tus credenciales.'; 
        this.$toast.error(errorMessage);
      } finally {
        this.isLoading = false; // Desactiva el estado de carga al finalizar (éxito o error)
      }
    }
  }
};
</script>

<style scoped>
/* Tu estilo existente */
.delete-account-card {
  background-color: #ffebee !important;
  color: #d32f2f !important;
}
.delete-account-title {
  background-color: #f44336 !important;
  color: white !important;
}
.delete-account-input input {
  color: #d32f2f !important;
}
.delete-account-input label {
  color: #ef5350 !important;
}
.delete-account-button {
  background-color: #f44336 !important;
  color: white !important;
}
.delete-account-button:hover {
  background-color: #d32f2f !important;
}
.v-input__prepend-outer,
.v-input__append-inner {
  color: #ef5350 !important;
}
</style>