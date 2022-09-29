import express from 'express';
import { formularioLogin, autenticar, formularioRegistro, registrar, confirmar, formularioOlvidePassword, resetPassword, comprobarToken, nuevoPassword } from '../controllers/usuarioController.js';
const router = express.Router();

router.get('/login', formularioLogin );
router.post('/login', autenticar );

router.get('/registro', formularioRegistro );
router.post('/registro', registrar );

router.get('/confirmar/:token', confirmar);

router.get('/olvide-password', formularioOlvidePassword );
router.post('/olvide-password', resetPassword );

// ALmacena el nuevo password

router.get('/olvide-password/:token', comprobarToken );
router.post('/olvide-password/:token', nuevoPassword );

export default router