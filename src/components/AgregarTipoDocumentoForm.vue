<template>
  <v-card>
    <v-card-title class="headline">Agregar Tipo de Documento</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="tipoDocumento.nombre"
          label="Nombre del Tipo"
          required
        ></v-text-field>
        <v-textarea
          v-model="tipoDocumento.descripcion"
          label="Descripción"
        ></v-textarea>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('close')">Cancelar</v-btn>
          <v-btn color="green darken-1" text type="submit">Guardar</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      tipoDocumento: {
        nombre: '',
        descripcion: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await axios.post('http://localhost:3000/api/tipos_documento/insertar', this.tipoDocumento);
        alert('Tipo de documento agregado con éxito');
        this.$emit('tipo-documento-agregado'); // Emitir evento para recargar la tabla
        this.$emit('close'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al agregar tipo de documento:', error);
        alert('Error al agregar tipo de documento: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>