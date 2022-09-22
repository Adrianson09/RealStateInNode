import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'
// Crear la app
const app = express()

// Conexión a la base de datos
try {
    await db.authenticate();
    console.log('Conexión correcta a la BD ')
} catch (error) {
    console.log(error)
}
// habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

// Carpeta pública

app.use( express.static('public') )

// routing
app.use('/auth', usuarioRoutes)
// definir un puerto y arrancar el proyectot
const port = 3000;

app.listen(port, () => {
    console.log(`EL servidor está funcionando en el puerto ${port}`)
});