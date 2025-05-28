<template>
  <v-card class="elevation-12 rounded-lg user-form-card">
    <v-card-title class="headline white--text user-form-title text-center">
      Actualizar Usuario
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
        v-model="telefono"
        label="Número Telefónico"
        prepend-icon="mdi-phone"
        type="tel"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      <v-text-field
        v-model="direccion"
        label="Dirección"
        prepend-icon="mdi-home"
        rounded
        outlined
        class="user-form-input"
      ></v-text-field>
      </v-card-text>
    <v-card-actions class="justify-center">
      <v-btn
        color="blue darken-1"
        class="mb-4 rounded-pill white--text user-form-button"
        @click="handleActualizarUsuario"
      >
        Actualizar Usuario
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
  props: {
    usuario: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      nombre_completo: this.usuario.nombre_completo,
      correo: this.usuario.correo,
      telefono: this.usuario.telefono,
      direccion: this.usuario.direccion,
      // contrasena: '', // Opcional
    };
  },
  methods: {
    async handleActualizarUsuario() {
      try {
        const payload = {
          nombre_completo: this.nombre_completo,
          correo: this.correo,
          telefono: this.telefono,
          direccion: this.direccion,
          // contrasena: this.contrasena, // Opcional
        };

        const response = await axios.put(
          `http://localhost:3000/api/usuarios/actualizar/${this.usuario.id}`,
          payload
        );
        console.log('Respuesta del backend:', response.data);
        alert('¡Usuario actualizado exitosamente!');
        this.$emit('usuario-actualizado');
        this.$emit('close');
      } catch (error) {
        console.error('Error al actualizar usuario:', error.response?.data || error.message);
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