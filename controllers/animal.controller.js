'use strict'

var Animal = require('../models/animal.model');
var fs = require('fs');
var path = require('path');

function saveAnimal(req, res){
    var params = req.body;
    var animal = new Animal();

    animal.name = params.name;
    animal.nickname = params.nickname;
    animal.age = params.age;
    animal.carer = params.carer;

    animal.save((err, animalSaved)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(animalSaved){
            res.send({message: animalSaved});
        }else{
            res.status(200).send({message: 'Error al guardar animal.'});
        }
    });
}

function updateAnimal(req, res){
    var animalId = req.params.id;
    var update = req.body;

    Animal.findByIdAndUpdate(animalId, update, {new: true}, (err, animalUpdate)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(animalUpdate){
            res.send({animal: animalUpdate});
        }else{
            res.status(404).send({message: 'No se ha podido actualizar'});
        }
    });
}

function uploadImageAnimal(req, res){
    var animalId = req.params.id;
    var fileName = 'Sin imagen';

    if(req.files){
        //Ruta completa 
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[2];

        var ext = fileName.split('\.');
        var fileExt = ext[1];
        if(fileExt == 'png' ||
            fileExt == 'jpg' ||
            fileExt == 'jpeg' ||
            fileExt == 'gif'){

                Animal.findByIdAndUpdate(animalId, {image: fileName}, {new: true}, (err, updloadImageAnimal)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al actualizar'});
                    }else if(updloadImageAnimal){
                        res.send({user: updloadImageAnimal, nameImage: updloadImageAnimal.image});
                    }else{
                        res.status(404).send({message: 'No se ha podido subir la imagen'});
                    }
                });
            }else{
                fs.unlink(filePath, (err)=>{
                    if(err){
                        res.status(418).send({message: 'Extensión de archivo no válido, archivo eliminado'});
                    }else{
                        res.send({message: 'Imagen guardada'});
                    }
            });
        }
    }else{
        res.status(418).send({message: 'Envía un archivo'});
    }
}

function getImage(req, res){
    var imageName = req.params.image;
    var filePath = './uploads/animals/'+ imageName;

    fs.exists(filePath, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
    });
}

function deleteAnimal(req, res){
    var animalId = req.params.id;

    Animal.findByIdAndRemove(animalId, (err, animalDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(animalDeleted){
            res.send({message: 'Animal eliminado', animalDeleted});
        }else{
            res.status(404).send({message: 'Error al eliminar el animal'});
        }
    });
}

function listAnimals(req, res){
    Animal.find({}, (err, animals)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(animals){
            res.send({animals: animals});
        }else{
            res.status(418).send({message: 'Sin datos para mostrar'});
        }
    });
}

module.exports={
    saveAnimal,
    updateAnimal,
    uploadImageAnimal,
    getImage,
    deleteAnimal,
    listAnimals
}