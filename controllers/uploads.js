const { response } = require("express");

const cargarArchivo = ( req, res = response) => {

   res.json({
      msg: 'HOla file..'
   })

}

module.exports = {
   cargarArchivo
}