import { check, validationResult } from 'express-validator'
import Usuario from '../models/Usuario.js'
import { generarId } from '../helpers/tokens.js'
import { emailRegistro } from '../helpers/emails.js'


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}
const formularioRegistro = (req, res) => {
    console.log(req.csrfToken())
    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    })
}

const registrar = async (req, res) => {
// validation 
    await check('nombre').notEmpty().withMessage('El nombre es Obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req)
    await check('password').isLength({ min: 8 }).withMessage('El password debe ser de al menos 8 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords deben ser iguales').run(req)


    let resultado = validationResult(req)


    // Verificar el resultado

    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    // Extraer los datos

    const { nombre, email, password } = req.body

    // Verificar que el usuario no este duplicado

    const existeUsuario = await Usuario.findOne( { where : { email } } )

   

    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario ya está registrado'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    
    // almacenar un usuario

    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // envia email de confirmacion
        emailRegistro({
            nombre: usuario.nombre,
            email: usuario.email,
            token: usuario.token
        })


    // Mostrar Mensaje de confirmación 
    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos Enviado un Email de confirmación'
    })
}

// funcion para confirmar cuenta 
const confirmar = async (req, res) => {

    const { token } = req.params;


//    verificar la cuenta

    const usuario = await Usuario.findOne({ where: {token} })

    if (!usuario) {
       return res.render('auth/confirmar-cuenta', {
        pagina: 'Error al confirmar la cuenta',
        mensaje: 'Hubo un error al confirmar',
        error: true
       })
    }

//  confirmar la cuenta 
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'Su cuenta se ha confirmado correctamente',
    })
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
    confirmar,
    formularioOlvidePassword
}