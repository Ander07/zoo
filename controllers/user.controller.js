'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

function saveUser(req, res){
    var params = req.body;
    var user = new User();

    if(params.name &&
        params.username &&
        params.email &&
        params.password){
            User.findOne({$or:[{username: params.username},
            {email: params.email}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general'});
                }else if(userFind){
                    res.send({message: 'Usuario o correo ya utilizado'});
                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.email = params.email;
                    user.password = params.password;
                    user.role = 'CARER';

                    bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error de encriptacion'});
                        }else{
                            user.password = hashPassword;

                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general al guardar usuario'});
                                }else if(userSaved){
                                    res.send({user: userSaved});
                                }else{
                                    res.status(418).send({message: 'Usuario no validado'});
                                }
                            });
                        }
                    });
                }
            });
    }else{
        res.status({message: 'Ingresa todos los datos'});
    }
}

function login(req, res){
    var params = req.body;

    if(params.username || params.email){
        if(params.password){
        User.findOne({$or:[{username: params.username},
        {email: params.email}]}, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'});
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password,(err, checkPassword)=>{
                    if(err){
                        res.status(500).send({message: 'Erro al comparar contraseñas'});
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({token: jwt.createToken(userFind)});
                        }else{
                        res.send({user: userFind});
                        }
                    }else{
                        res.status(401).send({message: 'Contraseña incorrecta'});
                    }
                });
            }else{
                res.send({message: 'Usuario no encontrado'});
            }
        });
        }else{
        res.send({message: 'Por favor ingrese la contraseña'});
        }
    }else{  
        res.send({message: 'Ingresa el nombre de usuario o correo'});
    }
}

function pruebaMiddle(req, res){
    var user = req.user;
    res.send({message: 'Middleware funcionando', user: user});
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Erro de permisos, usuario no logueado'});
    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate)=>{
            if(err){
                res.status(500).send({message: 'Error general al actualizar'});
            }else if(userUpdate){
                res.send({user: userUpdate});
            }else{
                res.status(404).send({message: 'No se ha podido actualizar'});
            }
        });
    }
}

function updloadImage(req, res){
    var userId = req.params.id;
    var fileName = 'Sin imagen';

    if(userId != req.user.sub){
        res.status(403).send({message: 'Erro de permisos, usuario no logueado'});
    }else{
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

                User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, updloadImageUser)=>{
                    if(err){
                        res.status(500).send({message: 'Error general al actualizar'});
                    }else if(updloadImageUser){
                        res.send({user: updloadImageUser, nameImage: updloadImageUser.image});
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
}

function getImage(req, res){
    var userId = req.params.id;
    var imageName = req.params.image;
    var filePath = './uploads/users/'+ imageName;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Erro de permisos, usuario no logueado'});
    }else{
        fs.exists(filePath, (exists)=>{
        if(exists){
            res.sendFile(path.resolve(filePath));
        }else{
            res.status(404).send({message: 'Imagen inexistente'});
        }
        });
    }
}

function listUsers(req,res){
    User.find({}, (err, users)=>{
        if(err){
            res.status(500).send({message: 'Error general en la búsqueda'});
        }else if(users){
            res.send({user: users});
        }else{
            res.status(418).send({message: 'Sin datos para mostra4'});
        }
    });
}

function deleteUser(req, res){
    var userId = req.params.id;

    User.findByIdAndRemove(userId, (err, userDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general'})
        }else if(userDeleted){
            res.send({message: 'Usuario eliminado', userDeleted})
        }else{
            res.status(404).send({message: 'Error al eliminar el usuario'});
        }
    });
}

module.exports = {
    saveUser,
    login,
    pruebaMiddle, 
    updateUser,
    updloadImage,
    getImage,
    listUsers,
    deleteUser
}