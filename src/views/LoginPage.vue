<template>
  <v-card class="elevation-12 rounded-lg login-card">
    <v-card-title class="headline white--text login-title text-center">
      Iniciar sesión
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="user"
        label="Usuario"
        prepend-icon="mdi-account"
        rounded
        outlined
        class="login-input"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Contraseña"
        prepend-icon="mdi-lock"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        rounded
        outlined
        class="login-input"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        class="mb-4 rounded-pill login-button"
        @click="handleLogin"
      >
        Inicio
      </v-btn>
    </v-card-actions>
    <v-card-text class="text-center login-links">
      <small>
        <a href="#" class="mr-2" @click="$emit('open-delete-account')">¿Eliminar Cuenta?</a> |
        <a href="#" class="ml-2" @click="$emit('open-forgot-password')">¿Olvidaste la contraseña?</a>
      </small>
    </v-card-text>
    <v-card-text class="text-center login-register">
      ¿No tienes cuenta?
      <a href="#" @click="$emit('open-register')">Regístrate aquí</a>
    </v-card-text>
    <v-card-actions class="justify-space-around login-social">
      <v-btn outlined rounded class="social-button google">
        <v-icon left>mdi-google</v-icon>
        Google
      </v-btn>
      <v-btn outlined rounded class="social-button facebook">
        <v-icon left>mdi-facebook</v-icon>
        Facebook
      </v-btn>
    </v-card-actions>
    <v-card-actions class="justify-end">
      <v-btn text @click="$emit('close')">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: '',
      password: '',
      showPassword: false,
    };
  },
  methods: {
    async handleLogin() {
      try {
        const payload = {
          correo: this.user.trim().toLowerCase(),
          contrasena: this.password
        };

        const response = await axios.post('http://localhost:3000/api/usuarios/login', payload);

        if (response.data.success) {
          const usuario = response.data.usuario;
          alert('Inicio de sesión exitoso. Bienvenido ' + usuario.nombre_completo);
          localStorage.setItem('usuario', JSON.stringify(usuario));
          this.$store.dispatch('loginUsuario', usuario);
          this.$emit('login-success');
        } else {
          alert('Credenciales inválidas');
        }
      } catch (error) {
        console.error('Error al iniciar sesión:', error.response?.data || error.message);
        alert('Error al iniciar sesión. Intenta nuevamente.');
      }
    },
  },
};
</script>



<style scoped>
.login-card {
  background-color: #ede7f6 !important; /* Morado muy claro de fondo */
  color: #5e35b1 !important; /* Morado oscuro para el texto principal */
}

.login-title {
  background-color: #9c27b0 !important; /* Morado principal para el título */
  color: white !important;
}

.login-input input {
  color: #5e35b1 !important;
}

.login-input label {
  color: #7e57c2 !important; /* Morado más claro para las etiquetas */
}

.login-button {
  background-color: #9c27b0 !important; /* Morado principal para el botón */
  color: white !important;
}

.login-button:hover {
  background-color: #7b1fa2 !important; /* Morado más oscuro al pasar el ratón */
}

.login-links a {
  color: #5e35b1 !important; /* Morado oscuro para los enlaces */
}

.login-register a {
  color: #9c27b0 !important; /* Morado principal para el enlace de registro */
}

.social-button {
  color: #fff !important;
  border-color: #7e57c2 !important; /* Morado más claro para el borde de los botones sociales */
}

.google {
  color: #e74c3c !important; /* Rojo para Google */
}

.facebook {
  color: #3b5998 !important; 
}

.v-input__prepend-outer,
.v-input__append-inner {
  color: #7e57c2 !important; /* Color de los iconos */
}
</style>