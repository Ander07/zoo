'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');
var connectMultiParty = require('connect-multiparty');
var middlewareUpload = connectMultiParty({uploadDir: './uploads/users'});

api.post('/saveUser', userController.saveUser);
api.post('/login', userController.login);
api.get('/pruebaMiddle', middlewareAuth.ensureAuth, userController.pruebaMiddle);
api.put('/updateUser/:id', middlewareAuth.ensureAuth, userController.updateUser);
api.post('/updloadImage/:id', [middlewareAuth.ensureAuth, middlewareUpload], userController.updloadImage);
api.get('/getImage/:id/:image', middlewareAuth.ensureAuth, userController.getImage);
api.delete('/deleteUser/:id', middlewareAuth.ensureAuth, userController.deleteUser);

//Rutas que solo el admin puede ingresar
api.get('/listUsers', middlewareAuth.ensureAuthAdmin, userController.listUsers);

module.exports = api;