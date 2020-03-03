const express = require('express')

const { verificaToken } = require('../middlewares/autenticacion')

const app = express()

const Producto = require('../models/producto')

// ===========================
// Obtener todos los productos
// ===========================
app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario, categoria
    //paginado


    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 10;
    limite = Number(limite);

    Producto.find({ disponible: true })
        //.sort('nombre')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                productos
            });


        });


});


// ===========================
// Obtener un producto por ID
// ===========================
app.get('/productos/:id', verificaToken, (req, res) => {
    //populate: usuario, categoria

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoBD
            });


        });

});

// ===========================
// Buscar productos
// ===========================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;
    let regEx = new RegExp(termino, 'i');

    Producto.find({ nombre: regEx })
        //.sort('nombre')
        //.populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                productos
            });


        });


});


// ===========================
// Crear nuevo producto
// ===========================
app.post('/productos', verificaToken, (req, res) => {
    //grabar producto, grabar una categoria

    let idUsuario = req.usuario._id;

    let producto = new Producto({
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        disponible: req.body.disponible,
        categoria: req.body.idCategoria,
        usuario: idUsuario
    })

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });

    });


});


// ===========================
// Actualizar producto
// ===========================
app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar producto, grabar una categoria

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no existe'
                }
            });
        }

        productoDB.nombre = req.body.nombre;
        productoDB.precioUni = req.body.precioUni;
        productoDB.descripcion = req.body.descripcion;
        productoDB.disponible = req.body.disponible;
        productoDB.categoria = req.body.idCategoria;


        productoDB.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }


            res.status(200).json({
                ok: true,
                producto: productoGuardado
            });
        });
    });

});


// ===========================
// Borrar producto
// ===========================
app.delete('/productos/:id', verificaToken, (req, res) => {
    //borrar logicamente con el atrib disponible

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.status(200).json({
                ok: true,
                producto: productoBorrado,
                mensaje: 'Producto borrado'
            });

        });
    });


});


module.exports = app;