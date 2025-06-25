class Servicio {
  getVerificaUsuario(user,pass) {
    if(user==='uno' && pass==='unomasuno')
      return true
    else
      return false
  }
}
export default new Servicio()