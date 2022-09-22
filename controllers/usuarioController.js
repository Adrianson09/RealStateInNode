import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {
// validation 
    await check('nombre').notEmpty().withMessage('El nombre es Obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req)
    await check('password').isLength({ min: 8 }).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    await check('repetir-password').equals('password').withMessage('Los passwords no son iguales').run(req)


    let resultado = validationResult(req)

    // return res.json(resultado.array())

    // Verificar el resultado

    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array()
        })
    }


    const usuario = await Usuario.create(req.body);

    res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recuperar acceso a Caribe Hospitality'
    })
}

export {
    formularioLogin, 
    formularioRegistro,
    registrar,
    formularioOlvidePassword
}