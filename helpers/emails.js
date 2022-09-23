import nodemailer from 'nodemailer'

const emailRegistro = async (datos) =>{
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const { email, nombre, token} = datos

      // Enviar el email

      await transport.sendMail({
        from: 'caribehospitality.com',
        to: email,
        subject: 'Confirmar la cuenta en caribehospitality.com',
        text: 'Confirmar la cuenta en caribehospitality.com',
        html: `
              <p> Hola ${nombre} confirme su cuenta en caribehospitality.com</p>

              <p> Su cuenta ya está lista, solo debe confirmar en el siguiente enlace:
              <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a> </p>

              <p> Si usted no creo esta cuenta, puede ignorar este mensaje</p>
        `
      })
}



export {
    emailRegistro
}