const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');


const { dbConnection } = require('../database/config');


class Server {

   constructor() {
      this.app = express();
      this.port =  process.env.PORT; 

      this.paths = {
         auth:       '/api/auth',
         buscar:       '/api/buscar',
         usuarios:   '/api/users',
         categorias: '/api/categorias',
         productos: '/api/productos',
         uploads: '/api/uploads'
      }


      //conectar BD
      this.conectarDB();    

      //Middlewares
      this.middlewares();

      //Rutas
      this.routes();
   }
   

   async conectarDB() {
        await dbConnection(); 
   }

   middlewares(){
      //CORS
      this.app.use( cors() )

      //lectura y parseo del body
      this.app.use( express.json() );

      //Directorio Público
      this.app.use( express.static('public') );

      //FIleUpload - Carga de archivos
      this.app.use( fileUpload({
         useTempFiles : true,
         tempFileDir : '/tmp/',
         createParentPath: true
     }));
   }

   routes(){
      this.app.use( this.paths.auth, require('../routes/auth'));
      this.app.use( this.paths.buscar, require('../routes/buscar'));
      this.app.use( this.paths.categorias, require('../routes/categorias'));
      this.app.use( this.paths.usuarios , require('../routes/users.routes'));
      this.app.use( this.paths.productos , require('../routes/productos'));
      this.app.use( this.paths.uploads , require('../routes/uploads'));
   }

   listen(){
      this.app.listen( this.port, ()=>{
         console.log('servidor corriendo en ', this.port );
      })
   }

}

module.exports = Server;