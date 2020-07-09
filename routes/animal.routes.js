'use strict'

var express = require('express');
var animalController = require('../controllers/animal.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');
var connectMultiParty = require('connect-multiparty');
var middlewareUpload = connectMultiParty({uploadDir: './uploads/animals'});

api.post('/saveAnimal', middlewareAuth.ensureAuthAdmin, animalController.saveAnimal);
api.put('/updateAnimal/:id', middlewareAuth.ensureAuthAdmin, animalController.updateAnimal);
api.post('/uploadImageAnimal/:id', [middlewareAuth.ensureAuthAdmin, middlewareUpload], animalController.uploadImageAnimal);
api.get('/getImage/:id/:image', middlewareAuth.ensureAuthAdmin, animalController.getImage);
api.delete('/deleteAnimal/:id', middlewareAuth.ensureAuthAdmin, animalController.deleteAnimal);

api.get('/listAnimals', animalController.listAnimals);

module.exports = api;