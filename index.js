'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3300;

mongoose.Promise = global.Promise;

mongoose.connect('url base de datos',{useNewUrlParser:true, useUnifiedTopology:true})
.then(()=>{
    console.log('Conexion a la base de datos correcta');
    app.listen(port,()=>{
        console.log('Servidor de express corriendo');
    })
}).catch(err=>{
    console.log('Error al conectarse a la base de datos, err');
});