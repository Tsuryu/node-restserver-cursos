const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');

const app = express();

// consultar
app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) return res.status(400).json({ ok: false, err });

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({ ok: true, usuarios, cuantos: conteo });
            });
        });
});

// crear
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        //img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });

        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

    /*if (body.nombre == undefined) {
        res.status(400).json({ ok: false, mensaje: 'el nombre es necesario' });
    } else {
        res.json({ persona: body });
    }*/
});

// actualizar
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    //let body = req.body;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    delete body.password;
    delete body.google;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });


        res.json({ ok: true, usuario: usuarioDB });
    });

});

// borrar
app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    // baja logica
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        if (!usuarioDB) return res.status(400).json({ ok: false, err: { message: 'usuario no encontrado' } });

        res.json({ ok: true, usuario: usuarioDB });
    });

    // baja fisica
    /*Usuario.findByIdAndRemove(id, (err, usuarioDB) => {
        if (err) return res.status(400).json({ ok: false, err });
        if (!usuarioDB) return res.status(400).json({ ok: false, err: { message: 'usuario no encontrado' } });

        res.json({ ok: true, usuario: usuarioDB });
    });*/
});

module.exports = app;