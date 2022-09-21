import express from 'express';

const router = express.Router();
// routing
router.get('/', function(req, res) {
    res.json({msg: 'Hola Mundo en express'})
});
router.post('/', function(req, res) {
    res.json({msg: 'respuesta de tipo post'})
});

export default router