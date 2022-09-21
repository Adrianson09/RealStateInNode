const formularioLogin = (req, res) => {
    res.render('auth/login', {
        autenticado: false
    })
}
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {

    })
}

export {
    formularioLogin, 
    formularioRegistro
}