<template>
  <v-card>
    <v-card-title class="headline">Agregar Método de Pago</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="metodoPago.nombre"
          label="Nombre del Método"
          required
        ></v-text-field>
        <v-textarea
          v-model="metodoPago.descripcion"
          label="Descripción"
        ></v-textarea>
        <v-checkbox
          v-model="metodoPago.activo"
          label="Activo"
        ></v-checkbox>
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
      metodoPago: {
        nombre: '',
        descripcion: '',
        activo: true, 
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await axios.post('http://localhost:3000/api/metodos_pago/insertar', this.metodoPago);
        alert('Método de pago agregado con éxito');
        this.$emit('metodo-pago-agregado'); // Emitir evento para recargar la tabla
        this.$emit('close'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al agregar método de pago:', error);
        alert('Error al agregar método de pago: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>