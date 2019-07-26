const express = require('express');
const Categoria = require('../models/categoria');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

app.get('/categoria', verificaToken, (req, res) => {
    /*Categoria.find((err, categorias) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categorias });
    });*/

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        //.populate('modelo2', 'campos2')
        .exec((err, categorias) => {
            if (err) return res.status(400).json({ ok: false, err });

            res.json({ ok: true, categorias });
        });
});

app.get('/categoria/:id', verificaToken, (req, res) => {
    let idCategoria = req.params.id;
    if (!idCategoria) return res.status(400).json({ ok: false, err: { message: 'El id es requerido para buscar una categoria' } });

    //Categoria.find({ '_id': idCategoria }, (err, categoriaDB) => {
    Categoria.findById(idCategoria, (err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categoria: categoriaDB });
    });
});

app.post('/categoria', verificaToken, (req, res) => {
    let categoria = new Categoria({
        descripcion: req.body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categoria: categoriaDB });
    });
});

app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let idCategoria = req.params.id;
    if (!idCategoria) return res.status(400).json({ ok: false, err: { message: 'El id es requerido para modificar una categoria' } });

    let descripcion = req.body.descripcion;

    Categoria.findOneAndUpdate({ '_id': idCategoria }, { descripcion }, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categoria: categoriaDB });
    });
});

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let idCategoria = req.params.id;
    if (!idCategoria) return res.status(400).json({ ok: false, err: { message: 'El id es requerido para borrar una categoria' } });

    Categoria.findByIdAndRemove(idCategoria, (err, categoriaDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        if (!categoriaDB) return res.status(400).json({ ok: false, err });

        res.json({ ok: true, categoria: categoriaDB });
    });
});

module.exports = app;