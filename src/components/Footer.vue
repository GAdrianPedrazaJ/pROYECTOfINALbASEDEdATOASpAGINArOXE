<template>
  <v-footer class="app-footer">
    <v-container>
      <v-row justify="space-around">
        <v-col cols="12" md="3" class="text-center">
          <h3 class="white--text">ROXE</h3>
          <div class="body-1 white--text">
            Venta de videojuegos para plataforfa PC
          </div>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <h3 class="white--text">Métodos de pago</h3>
          <div class="body-1 white--text">
            Nequi
          </div>
          <div class="body-1 white--text">
            Daviplata
          </div>
          <div class="body-1 white--text">
            PC
          </div>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <h3 class="white--text">¿Porqué iniciar sesión?</h3>
          <div class="body-1 white--text">
            Nos permite agilizar las compras; además, podrás recibir ofertas o descuentos atribuidos al cliente.
          </div>
        </v-col>
        <v-col cols="12" md="3" class="text-center">
          <h3 class="white--text">Encuéntranos en:</h3>
          <div class="d-flex justify-center">
            <v-btn icon href="#" target="_blank">
              <v-icon color="green accent-4">mdi-whatsapp</v-icon>
            </v-btn>
            <v-btn icon href="#" target="_blank">
              <v-icon color="blue darken-2">mdi-facebook</v-icon>
            </v-btn>
          </div>
          <div class="body-1 white--text mt-2">
            para sugerencias, reclamos, comentarios puedes escribirnos la siguiente Correo
          </div>
          <div class="body-1 white--text mt-2">
            Correo: <a href="mailto:roxe.games@gmail.com" class="white--text">roxe.games@gmail.com</a>
          </div>
        </v-col>
      </v-row>
      <v-divider class="mt-4"></v-divider>
      <v-row justify="center mt-2">
        <v-col cols="auto" class="text-center white--text">
          ROXE &copy; {{ new Date().getFullYear() }}
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
};
</script>

<style scoped>
.app-footer {
  background-color: #1a1a1a !important; /* Fondo oscuro como la barra de navegación */
  color: white !important;
  padding: 24px 0;
}

.app-footer h3 {
  color: #f06292 !important; /* Color rosa para los títulos */
  margin-bottom: 16px;
}

.app-footer a {
  text-decoration: none;
}
</style>