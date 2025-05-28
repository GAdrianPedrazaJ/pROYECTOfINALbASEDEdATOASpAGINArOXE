const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger'); // Asegúrate de que esta línea esté correcta

const app = express();
const PORT = 3001; // Este es el puerto para la documentación de Swagger

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(PORT, () => {
    console.log(`Servidor de Documentación corriendo en http://localhost:${PORT}/api-docs`);
});