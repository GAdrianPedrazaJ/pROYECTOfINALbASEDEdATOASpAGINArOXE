<template>
  <v-card>
    <v-card-title class="headline">Actualizar Tipo de Documento</v-card-title>
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="form.nombre"
          label="Nombre del Tipo"
          required
        ></v-text-field>
        <v-textarea
          v-model="form.descripcion"
          label="Descripción"
        ></v-textarea>
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
    tipoDocumento: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: { // Creamos una copia para no modificar el prop directamente
        id: this.tipoDocumento.id,
        nombre: this.tipoDocumento.nombre,
        descripcion: this.tipoDocumento.descripcion,
      },
    };
  },
  watch: {
    // Escuchar cambios en el prop 'tipoDocumento' para actualizar el formulario si se edita otro item
    tipoDocumento: {
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
        await axios.put(`http://localhost:3000/api/tipos_documento/actualizar/${this.form.id}`, this.form);
        alert('Tipo de documento actualizado con éxito');
        this.$emit('tipo-documento-actualizado'); // Emitir evento para recargar la tabla
        this.$emit('close'); // Cerrar el diálogo
      } catch (error) {
        console.error('Error al actualizar tipo de documento:', error);
        alert('Error al actualizar tipo de documento: ' + (error.response?.data?.error || error.message));
      }
    },
  },
};
</script>