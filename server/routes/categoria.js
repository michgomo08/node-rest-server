const express = require('express')

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

const app = express()

const Categoria = require('../models/categoria')


//===================================
// Mostrar todas las categorias
//===================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                categorias
            });


        });

});


//===================================
// Mostrar categoria por ID
//===================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoriaBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!categoriaBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaBD
            });


        });

});


//===================================
// Crear nueva categoria
//===================================
app.post('/categoria', verificaToken, function(req, res) {

    let idUsuario = req.usuario._id;

    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: idUsuario
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//===================================
// Modificar categoria por ID
//===================================
app.put('/categoria/:id', verificaToken, function(req, res) {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }


    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
})

//===================================
// Eliminar categoria por ID
//===================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], function(req, res) {

    let id = req.params.id;

    /*
        Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if (!usuarioDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                });
            }

            res.json({
                ok: true,
                usuario: usuarioDB
            });
        })
    */

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    })

})


module.exports = app;