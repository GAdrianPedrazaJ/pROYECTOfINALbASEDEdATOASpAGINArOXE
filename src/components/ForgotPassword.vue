<template>
  <v-card class="elevation-12 rounded-lg forgot-password-card" style="width: 450px;">
    <v-card-title class="headline white--text forgot-password-title text-center">
      Restablecer contraseña
    </v-card-title>
    <v-card-text>
      <p>Ingresa tu correo electrónico, tu nueva contraseña y confírmala.</p>
      <v-text-field
        v-model="email"
        label="Correo electrónico"
        prepend-icon="mdi-email"
        type="email"
        rounded
        outlined
        class="forgot-password-input"
      ></v-text-field>
      <v-text-field
        v-model="newPassword"
        label="Nueva contraseña"
        prepend-icon="mdi-lock-open"
        :type="showNewPassword ? 'text' : 'password'"
        :append-icon="showNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showNewPassword = !showNewPassword"
        rounded
        outlined
        class="forgot-password-input"
      ></v-text-field>
      <v-text-field
        v-model="confirmNewPassword"
        label="Confirmar nueva contraseña"
        prepend-icon="mdi-lock-check"
        :type="showConfirmNewPassword ? 'text' : 'password'"
        :append-icon="showConfirmNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showConfirmNewPassword = !showConfirmNewPassword"
        rounded
        outlined
        class="forgot-password-input"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="warning"
        :disabled="newPassword !== confirmNewPassword || !newPassword || !email"
        class="mb-4 rounded-pill white--text forgot-password-button"
        @click="handleResetPassword"
      >
        Restablecer contraseña
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
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      showNewPassword: false,
      showConfirmNewPassword: false,
    };
  },
  methods: {
    async handleResetPassword() {
      // Validaciones del lado del cliente
      if (!this.email) {
        alert('Por favor, ingresa tu correo electrónico.');
        return;
      }
      if (!this.newPassword) {
        alert('Por favor, ingresa una nueva contraseña.');
        return;
      }
      if (this.newPassword !== this.confirmNewPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }
      
      try {
        // Objeto de datos a enviar al backend
        const requestData = {
          correo: this.email,
          nueva_contrasena: this.newPassword,
          confirmar_nueva_contrasena: this.confirmNewPassword,
        };

        console.log('Enviando datos al backend:', requestData);

        const response = await axios.post('http://localhost:3000/api/usuarios/reset-password-direct', requestData);
        
        // Mostrar alerta de éxito
        alert(response.data.message || 'Contraseña cambiada exitosamente.'); 
        
        // Emitir eventos para cerrar el formulario actual y abrir el login
        this.$emit('close'); 
        this.$emit('open-login'); // <-- ¡Esta línea es la adición clave!

      } catch (error) {
        console.error('Error al restablecer la contraseña:', error.response?.data || error.message);
        alert(error.response?.data?.error || 'Error al restablecer la contraseña. Intenta nuevamente.');
      }
    },
  },
};
</script>

<style scoped>
.forgot-password-card {
  background-color: #fffde7 !important; /* Amarillo claro de fondo */
  color: #f9a825 !important; /* Amarillo oscuro para el texto principal */
}

.forgot-password-title {
  background-color: #fbc02d !important; /* Amarillo principal para el título */
  color: white !important;
}

.forgot-password-input input {
  color: #f9a825 !important;
}

.forgot-password-input label {
  color: #fdd835 !important; /* Amarillo más claro para las etiquetas */
}

.forgot-password-button {
  background-color: #fbc02d !important; /* Amarillo principal para el botón */
  color: white !important;
}

.forgot-password-button:hover {
  background-color: #f9a825 !important; /* Amarillo más oscuro al pasar el ratón */
}

.v-input__prepend-outer,
.v-input__append-inner {
  color: #fdd835 !important; /* Color de los iconos */
}
</style>