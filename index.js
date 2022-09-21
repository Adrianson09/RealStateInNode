// const express = require('express'); 
import express from 'express'

// const res = require('express/lib/response');

// Crear la app

const app = express()

// routing
app.get('/', function(req, res) {
    res.send('Hola Mundo en express')
});
app.get('/nosotros', function(req, res) {
    res.send('Información de Nosotros')
});

// definir un puerto y arrancar el proyectot
const port = 3000;

app.listen(port, () => {
    console.log(`EL servidor está funcionando en el puerto ${port}`)
});