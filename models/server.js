const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

   constructor() {
      this.app = express();
      this.port =  process.env.PORT; 
      this.usersPath = '/api/users'

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
   }

   routes(){
      this.app.use( this.usersPath, require('../routes/users.routes'));
   }

   listen(){
      this.app.listen( this.port, ()=>{
         console.log('servidor corriendo en ', this.port );
      })
   }

}

module.exports = Server;