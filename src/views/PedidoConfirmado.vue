<template>
  <v-container fluid class="fill-height d-flex align-center justify-center">
    <v-card class="pa-8 text-center" max-width="500">
      <v-icon size="96" color="success">mdi-check-circle-outline</v-icon>
      <v-card-title class="headline justify-center mt-4 mb-2">
        ¡Tu pedido ha sido realizado con éxito!
      </v-card-title>
      <v-card-text>
        Agradecemos tu compra. Recibirás una confirmación en breve.
        Puedes revisar el estado de tu pedido en la sección de "Mis Pedidos".
      </v-card-text>
      <v-card-actions class="justify-center mt-4">
        <v-btn color="purple accent-2" dark to="/">Volver al Inicio</v-btn>
        </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'PedidoConfirmado',
};
</script>

<style scoped>
.fill-height {
  min-height: 100vh;
}
.v-card {
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
}
</style>