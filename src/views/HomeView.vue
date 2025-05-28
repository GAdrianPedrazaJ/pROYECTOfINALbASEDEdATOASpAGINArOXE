<template>
  <v-container fluid class="home-view">
    <v-row justify="center">
      <v-col cols="12" class="text-center">
        <h1>¡Explora el Mundo de los Juegos de PC!</h1>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="10" class="text-center">
        <p>Descubre una amplia variedad de juegos emocionantes para tu PC. ¡Encuentra tu próxima aventura!</p>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <v-row justify="space-around">
      <v-col
        md="6"
        lg="4"
        sm="10"
        cols="12"
        class="mb-4"
        v-for="product in products"
        :key="product.id"
      >
        <v-card>
          <v-card-title class="headline">{{ product.nombre }}</v-card-title>
          <v-img
            :src="product.imagen_url"
            height="200px"
            class="align-end"
          ></v-img>
          <v-card-subtitle class="pb-0">{{ product.descripcion }}</v-card-subtitle>
          <v-card-text class="text--primary">${{ product.precio }}</v-card-text>
          <v-card-actions>
            <v-btn
              color="purple accent-2"
              dark
              @click="addToCart(product)"
            >
              Agregar al carrito
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-5"></v-divider>

    <v-row justify="space-around" class="mt-5">
      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/150/00BCD4/FFFFFF?Text=Info%201"
          max-height="150"
          class="mx-auto mb-2"
          contain
        ></v-img>
        <h3>Nuestra Pasión por los Juegos</h3>
        <p>Conoce nuestra dedicación por ofrecerte los mejores títulos y una experiencia de compra inigualable.</p>
      </v-col>

      <v-col md="6" class="text-center">
        <v-img
          src="https://via.placeholder.com/150/00/FFFFFF?Text=Info%202"
          max-height="150"
          class="mx-auto mb-2"
          contain
        ></v-img>
        <h3>Encuentra tu Próxima Aventura</h3>
        <p>Desde épicas campañas hasta intensas batallas multijugador, tenemos el juego perfecto para ti.</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      products: [],
    };
  },
  methods: {
    ...mapActions('cart', ['addToCart']),
    async cargarProductos() {
      try {
        const response = await axios.get('http://localhost:3000/api/productos/obtener');
        this.products = response.data.map(product => {
          let imageUrl = 'https://via.placeholder.com/200x200?text=No+Image';

          if (product.imagen_url) {
            imageUrl = `http://localhost:3000${product.imagen_url}`;
            imageUrl += `?_t=${new Date().getTime()}`;
          }
          
          return {
            ...product,
            imagen_url: imageUrl, 
          };
        });
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    },
  },
  mounted() {
    this.cargarProductos();
  },
};
</script>

<style scoped>
/* Tu estilo existente */
.home-view h1 {
  color: #f06292;
  font-size: 2.5em;
  margin-bottom: 0.5em;
}

.home-view h3 {
  color: #e91e63;
  margin-top: 1em;
  margin-bottom: 0.5em;
}
</style>