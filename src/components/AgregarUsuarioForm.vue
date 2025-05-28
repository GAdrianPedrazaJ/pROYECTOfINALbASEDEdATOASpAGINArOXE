<template>
  <v-card class="elevation-12 rounded-lg user-form-card">
    <v-card-title class="headline white--text user-form-title text-center">
      Agregar Usuario
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="nombre_completo"
        label="Nombre Completo"
        prepend-icon="mdi-account"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="correo"
        label="Correo"
        prepend-icon="mdi-email"
        type="email"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="contrasena"
        label="Contraseña"
        prepend-icon="mdi-lock"
        type="password"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="telefono"
        label="Número Telefónico"
        prepend-icon="mdi-phone"
        type="tel"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-menu
        ref="menuFechaNacimiento"
        v-model="menuFechaNacimiento"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        full-width
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="fecha_nacimiento"
            label="Fecha de Nacimiento"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            rounded
            outlined
            class="user-form-input"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="fecha_nacimiento"
          @input="$refs.menuFechaNacimiento.save(fecha_nacimiento)"
        ></v-date-picker>
      </v-menu>
      <v-text-field
        v-model="direccion"
        label="Dirección"
        prepend-icon="mdi-home"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="departamento"
        label="Departamento"
        prepend-icon="mdi-city"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="ciudad"
        label="Ciudad"
        prepend-icon="mdi-location-city"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="codigo_postal"
        label="Código Postal"
        prepend-icon="mdi-mailbox"
        type="number"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
    </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="blue darken-1"
        class="mb-4 rounded-pill white--text user-form-button"
        @click="handleAgregarUsuario"
      >
        Agregar Usuario
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
      nombre_completo: '',
      correo: '',
      contrasena: '',
      telefono: '',
      fecha_nacimiento: null,
      menuFechaNacimiento: false,
      direccion: '',
      departamento: '',
      ciudad: '',
      codigo_postal: '',
    };
  },
  methods: {
    async handleAgregarUsuario() {
      try {
        const payload = {
          nombre_completo: this.nombre_completo,
          correo: this.correo,
          contrasena: this.contrasena,
          telefono: this.telefono,
          fecha_nacimiento: this.fecha_nacimiento,
          direccion: this.direccion,
          departamento: this.departamento,
          ciudad: this.ciudad,
          codigo_postal: this.codigo_postal,
          is_admin: false, // Por defecto, al agregar un usuario, no es admin
        };

        const response = await axios.post(
          'http://localhost:3000/api/usuarios/insertar',
          payload
        );
        console.log('Respuesta del backend:', response.data);
        alert('¡Usuario agregado exitosamente!');
        this.$emit('usuario-agregado');
        this.$emit('close');

        // Limpiar campos
        this.nombre_completo = '';
        this.correo = '';
        this.contrasena = '';
        this.telefono = '';
        this.fecha_nacimiento = null;
        this.direccion = '';
        this.departamento = '';
        this.ciudad = '';
        this.codigo_postal = '';

      } catch (error) {
        console.error('Error al agregar usuario:', error.response?.data || error.message);
        alert('Error: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>

<style scoped>
.user-form-card {
  background-color: #ede7f6 !important; /* Lila muy claro de fondo */
  color: #5e35b1 !important; /* Lila oscuro para el texto principal */
}

.user-form-title {
  background-color: #673ab7 !important; /* Lila principal para el título */
  color: white !important;
}

.user-form-input input {
  color: #5e35b1 !important;
}

.user-form-input label {
  color: #9575cd !important; /* Lila más claro para las etiquetas */
}

.user-form-button {
  background-color: #673ab7 !important; /* Lila principal para el botón */
  color: white !important;
}

.user-form-button:hover {
  background-color: #5e35b1 !important; /* Lila más oscuro al pasar el ratón */
}

.v-input__prepend-outer,
.v-input__append-inner {
  color: #9575cd !important; /* Color de los iconos */
}
</style>