<template>
  <v-card>
    <v-card-title class="headline">Actualizar Método de Pago</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="form.nombre"
          label="Nombre del Método"
          required
        ></v-text-field>
        <v-textarea
          v-model="form.descripcion"
          label="Descripción"
        ></v-textarea>
        <v-checkbox
          v-model="form.activo"
          label="Activo"
        ></v-checkbox>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="$emit('close')">Cancelar</v-btn>
          <v-btn color="green darken-1" text type="submit">Guardar Cambios</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    metodoPago: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: { // Creamos una copia para no modificar el prop directamente
        id: this.metodoPago.id,
        nombre: this.metodoPago.nombre,
        descripcion: this.metodoPago.descripcion,
        activo: this.metodoPago.activo,
      },
    };
  },
  watch: {
    // Escuchar cambios en el prop 'metodoPago' para actualizar el formulario si se edita otro item
    metodoPago: {
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal };
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    async submitForm() {
      try {
        await axios.put(`http://localhost:3000/api/metodos_pago/actualizar/${this.form.id}`, this.form);
        alert('Método de pago actualizado con éxito');
        this.$emit('metodo-pago-actualizado'); // Emitir evento para recargar la tabla
        this.$emit('close'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al actualizar método de pago:', error);
        alert('Error al actualizar método de pago: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>