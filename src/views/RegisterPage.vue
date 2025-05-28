<template>
  <v-card class="elevation-12 rounded-lg register-card">
    <v-card-title class="headline white--text register-title text-center">
      Regístrate
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="nombreCompleto"
        label="Nombre Completo"
        prepend-icon="mdi-account"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
      <v-text-field
        v-model="correo"
        label="Correo"
        prepend-icon="mdi-email"
        type="email"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
      <v-text-field
        v-model="contrasena"
        label="Contraseña"
        prepend-icon="mdi-lock"
        :type="showPassword ? 'text' : 'password'"
        :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="showPassword = !showPassword"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
      <v-text-field
        v-model="telefono"
        label="Número Telefónico"
        prepend-icon="mdi-phone"
        type="tel"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="fechaNacimiento"
            label="Fecha de Nacimiento (dd/mm/aaaa)"
            prepend-icon="mdi-calendar"
            rounded
            outlined
            class="register-input"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-menu
            ref="menu"
            v-model="menuFechaNacimiento"
            :close-on-content-click="false"
            transition="scale-transition"
            offset-y
            full-width
            :nudge-right="40"
            lazy
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="fechaNacimiento"
                label="Fecha de Nacimiento"
                prepend-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                rounded
                outlined
                class="register-input"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="fechaNacimiento"
              @input="menuFechaNacimiento = false"
            ></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-text-field
        v-model="direccion"
        label="Dirección"
        prepend-icon="mdi-map-marker"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="departamento"
            label="Departamento"
            prepend-icon="mdi-city"
            rounded
            outlined
            class="register-input"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="ciudad"
            label="Ciudad"
            prepend-icon="mdi-city-variant-outline"
            rounded
            outlined
            class="register-input"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-text-field
        v-model="codigoPostal"
        label="Código Postal"
        prepend-icon="mdi-mailbox"
        rounded
        outlined
        class="register-input"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="purple accent-2"
        class="mb-4 rounded-pill white--text register-button"
        @click="handleRegister"
      >
        Registrarse
      </v-btn>
    </v-card-actions>
    <v-card-actions class="justify-space-between">
      <v-btn text @click="$emit('close')">Cancelar</v-btn>
      <v-btn text @click="$emit('close'); $emit('open-login')">¿Ya tienes cuenta? Inicia sesión</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombreCompleto: '',
      correo: '',
      contrasena: '',
      telefono: '',
      fechaNacimiento: null,
      menuFechaNacimiento: false,
      direccion: '',
      departamento: '',
      ciudad: '',
      codigoPostal: '',
      showPassword: false,
    };
  },
  methods: {
    async handleRegister() {
      try {
        const payload = {
          nombre_completo: this.nombreCompleto,
          correo: this.correo.trim().toLowerCase(),
          contrasena: this.contrasena,
          telefono: this.telefono,
          fecha_nacimiento: this.fechaNacimiento,
          direccion: this.direccion,
          departamento: this.departamento,
          ciudad: this.ciudad,
          codigo_postal: this.codigoPostal,
          is_admin: false,
        };

        const response = await axios.post('http://localhost:3000/api/usuarios/insertar', payload);
        console.log('Respuesta completa del backend:', response.data);
        alert('¡Usuario registrado exitosamente!');
        console.log('ID nuevo usuario:', response.data.id);
        this.$emit('register-success');
        this.$emit('close');
        // Opcional: limpiar campos
        this.nombreCompleto = '';
        this.correo = '';
        this.contrasena = '';
        this.telefono = '';
        this.fechaNacimiento = null;
        this.direccion = '';
        this.departamento = '';
        this.ciudad = '';
        this.codigoPostal = '';
      } catch (error) {
        console.error('Error al registrar usuario:', error.response?.data || error.message);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>

<style scoped>
.register-card {
  background-color: #ede7f6 !important; /* Morado muy claro de fondo */
  color: #5e35b1 !important; /* Morado oscuro para el texto principal */
}

.register-title {
  background-color: #9c27b0 !important; /* Morado principal para el título */
  color: white !important;
}

.register-input input {
  color: #5e35b1 !important;
}

.register-input label {
  color: #7e57c2 !important; /* Morado más claro para las etiquetas */
}

.register-button {
  background-color: #9c27b0 !important; /* Morado principal para el botón */
  color: white !important;
}

.register-button:hover {
  background-color: #7b1fa2 !important; /* Morado más oscuro al pasar el ratón */
}

.v-input__prepend-outer,
.v-input__append-inner {
  color: #7e57c2 !important; /* Color de los iconos */
}
</style>