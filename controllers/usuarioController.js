import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt'
import Usuario from '../models/Usuario.js'
import { generarJWT, generarId } from '../helpers/tokens.js'
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js'


const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    })
}

const autenticar = async (req, res) => {
//  Validacion
await check('email').isEmail().withMessage('Eso Email es obligatorio').run(req)
await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

let resultado = validationResult(req)


// Verificar el resultado

if (!resultado.isEmpty()) {
    // Errores
    return res.render('auth/Login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken(),
        errores: resultado.array()
        
        })
    }
    const { email, password } = req.body

    // Comprobar si el usuario existe
    const usuario = await Usuario.findOne({ where: { email}})
    if (!usuario) {
        return res.render('auth/Login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no existe'}]
    })
}

    // Comprobar si el usuario está confirmado
    if (!usuario.confirmado) {
        return res.render('auth/Login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El usuario no está confirmado'}]
    })
    }
    // Comprobar el password
    if (!usuario.verificarPassword(password)) {
        return res.render('auth/Login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg: 'El password es incorrecto'}]
        })
    }

    // Autenticar al usuario
    const token = generarJWT({ id: usuario.id, nombre: usuario.nombre })
    console.log(token)

    // Almacenar cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure:true 

    }).redirect('/mis-propiedades')

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
        pagina: 'Recuperar acceso a Caribe Hospitality',
        csrfToken: req.csrfToken()

    })
}

const resetPassword = async (req, res) => {
    // Validación
    await check('email').isEmail().withMessage('Eso no parece un Email').run(req)

    let resultado = validationResult(req)


    // Verificar el resultado

    if (!resultado.isEmpty()) {
        // Errores
        return res.render('auth/olvide-password', {
            pagina: 'Recuperar acceso a Caribe Hospitality',
            csrfToken: req.csrfToken(),
            errores: resultado.array()
           
        })
    }

    // Buscar el usuario

    const { email } = req.body

    const usuario = await Usuario.findOne({ where: { email } } )

    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recuperar acceso a Caribe Hospitality',
            csrfToken: req.csrfToken(),
            errores: [{msg:'EL email no pertenece a ningún usuario'}]
        })
    }
    // Generar un token y enviar el email

    usuario.token = generarId();
    await usuario.save();

    // Enviar un email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // Renderizar un mensaje
    res.render('templates/mensaje', {
        pagina: 'Restablece su Password Correctamente',
        mensaje: 'Hemos Enviado un Email con las instrucciones'
    })

}

const comprobarToken = async (req, res, ) => {
    
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Restablezca su Password',
            mensaje: 'Hubo un error al validar su información',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        pagina: 'Restablezca su password',
        csrfToken: req.csrfToken()
    })
}
    const nuevoPassword = async (req, res) => {
    
        // Validar el password
        await check('password').isLength({ min: 8 }).withMessage('El password debe ser de al menos 8 caracteres').run(req)

        let resultado = validationResult(req)


        // Verificar el resultado
    
        if (!resultado.isEmpty()) {
            // Errores
            return res.render('auth/reset-password', {
                pagina: 'Restablezca su password',
                csrfToken: req.csrfToken(),
                errores: resultado.array()
            })
        }

        const { token } = req.params;
        const { password} = req.body;
        // Identificar quien hace el cambio
        const usuario = await Usuario.findOne({ where: {token} })
        // Hashear el nuevo password
        const salt = await bcrypt.genSalt(10)
        usuario.password = await bcrypt.hash( password, salt);
        usuario.token = null 

        await usuario.save();
         
        res.render('auth/confirmar-cuenta', {
            pagina: 'Password reestablecido',
            mensaje: 'El Password se guardó correctamente'

        })
    }


export {
    formularioLogin, 
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    resetPassword,
    comprobarToken,
    nuevoPassword
}