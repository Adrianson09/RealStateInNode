import express from 'express';

const router = express.Router();

router.get('/login', (req, res) => {
    res.render('auth/login', {
        autenticado: false
    })
});


export default router