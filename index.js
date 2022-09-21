// const express = require('express'); 
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'

// const res = require('express/lib/response');

// Crear la app

const app = express()

app.use('/', usuarioRoutes)

// definir un puerto y arrancar el proyectot
const port = 3000;

app.listen(port, () => {
    console.log(`EL servidor está funcionando en el puerto ${port}`)
});