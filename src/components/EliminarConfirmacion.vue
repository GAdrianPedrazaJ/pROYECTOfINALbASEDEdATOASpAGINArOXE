<template>
  <v-card>
    <v-card-title class="headline">Confirmar Eliminación</v-card-title>
    <v-card-text>
      <p>{{ texto }}</p>
      <p class="red--text">Esta acción no se puede deshacer</p>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="red darken-1" text @click="confirmar">
        <v-icon left>mdi-delete</v-icon> Eliminar
      </v-btn>
      <v-btn color="grey" text @click="cancelar">Cancelar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    texto: {
      type: String,
      required: true
    },
    tipo: { 
      type: String,
      required: true
    },
    id: { 
      type: [String, Number],
      required: true
    }
  },
  methods: {
    confirmar() {
      // Emitimos un objeto con el tipo de entidad y su ID/correo
      this.$emit('confirmar', { tipo: this.tipo, id: this.id });
    },
    cancelar() {
      this.$emit('cancelar');
    }
  }
};
</script>