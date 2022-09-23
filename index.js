import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import db from './config/db.js'
// Crear la app
const app = express()

// Habilitar lectura de datos de formularios

app.use( express.urlencoded({extended: true}) )

// Conexión a la base de datos
try {
    await db.authenticate();
    db.sync()
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
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`EL servidor está funcionando en el puerto ${port}`)
});