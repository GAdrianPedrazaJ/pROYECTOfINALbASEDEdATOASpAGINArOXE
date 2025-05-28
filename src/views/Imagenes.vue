<template>
  <v-container fluid class="about-view">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>ACERCA DE NUESTRA TIENDA DE VIDEOJUEGOS</h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="10" class="text-center">
        <p>Descubre más sobre nuestra pasión por los videojuegos y nuestro compromiso con la comunidad gamer.</p>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <v-row justify="space-around">
      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/100/673AB7/FFFFFF?Text=Comunidad"
          max-height="100"
          contain
          class="mx-auto mb-2"
        ></v-img>
        <h3>Nuestra Comunidad</h3>
        <p>Conéctate con otros jugadores, comparte tus experiencias y sé parte de nuestra creciente comunidad gamer.</p>
      </v-col>

      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/100/00BCD4/FFFFFF?Text=Mision"
          max-height="100"
          contain
          class="mx-auto mb-2"
        ></v-img>
        <h3>Nuestra Misión</h3>
        <p>Ofrecerte los mejores videojuegos, las últimas novedades y una experiencia de compra excepcional.</p>
      </v-col>
    </v-row>

    <v-row justify="space-around" class="mt-5">
      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/100/FF9800/FFFFFF?Text=Vision"
          max-height="100"
          contain
          class="mx-auto mb-2"
        ></v-img>
        <h3>Nuestra Visión</h3>
        <p>Ser la tienda de videojuegos en línea de referencia para jugadores de todos los niveles, ofreciendo calidad y variedad.</p>
      </v-col>

      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/100/4CAF50/FFFFFF?Text=Soporte"
          max-height="100"
          contain
          class="mx-auto mb-2"
        ></v-img>
        <h3>Nuestro Equipo de Soporte</h3>
        <p>Nuestro equipo está listo para ayudarte con cualquier pregunta o inquietud que puedas tener.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ImagenesView', // Mantenemos el nombre del componente
};
</script>

<style scoped>
.about-view h1 {
  color: #f06292;
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.about-view h3 {
  color: #e91e63;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
</style>