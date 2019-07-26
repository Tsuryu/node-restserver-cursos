const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');

// buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate()
        .exec((err, productos) => {
            if (err) return res.status(500).json({ ok: false, err });

            res.json({ ok: true, productos })
        });
});

// Obtener todos los productos
app.get('/producto', verificaToken, (req, res) => {
    let { limite = 5, skip = 0 } = req.body;
    limite = Number(limite);
    skip = Number(skip);

    Producto.find({ disponible: true })
        .limit(limite)
        .skip(skip)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) return res.status(500).json({ ok: false, err });

            Producto.count({}, (err, conteo) => {
                res.json({ ok: true, productos, cuantos: conteo });
            });
        });
});

// Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    Producto.findById(req.params.id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) return res.status(500).json({ ok: false, err });

            res.json({ ok: true, producto });
        });
});

// Crear un producto
app.post('/producto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUnitario,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.status(201).json({ ok: true, producto: productoDB });
    });

});

// Actualiza un producto
app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let { nombre, precioUnitario: precioUni, descripcion } = req.body;

    Producto.findOneAndUpdate(id, { nombre, precioUni, descripcion }, { new: true, runValidators: true }, (err, producto) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.json({ ok: true, producto });
    });
});

// Borrar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findOneAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) return res.status(500).json({ ok: false, err });

        res.json({ ok: true, productoDB, message: 'Producto borrado' });
    });
});



module.exports = app;