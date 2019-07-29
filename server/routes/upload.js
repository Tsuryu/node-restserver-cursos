const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) return res.status(400).json({ ok: false, err: { message: 'No se ha seleccionado ningun archivo' } });

    // Valida tipo
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No es un tipo valido',
                tiposValidos: tiposValidos.join(', ')
            }
        });
    }

    let archivo = req.files.archivo;
    let archivoSubido = archivo.name.split('.');
    let extension = archivoSubido[archivoSubido.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({ ok: false, err: { message: 'Extension no permitida', extensionesValidas: extensionesValidas.join(', ') } });
    }

    // cambiar nombre del archivo
    let nombreArchivoAGuardar = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivoAGuardar}`, err => {
        if (!req.files) return res.status(500).json({ ok: false, err });

        // aqui, imagen cargada
        switch (tipo) {
            case 'productos':
                imagenProducto(id, res, nombreArchivoAGuardar);
                break;
            case 'usuarios':
                imagenUsuario(id, res, nombreArchivoAGuardar);
                break
            default:
                return res.status(500).json({ ok: false, err: { message: 'Tipo no valido' } });
                break;
        }

        //res.json({ ok: true, message: 'Imagen subida correctamente' });
    });
});


function imagenUsuario(id, res, nombreArchivoAGuardar) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivoAGuardar, 'usuarios');
            return res.status(500).json({ ok: false, err });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivoAGuardar, 'usuarios');
            return res.status(400).json({ ok: false, err: { message: 'El usuario no existe' } });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivoAGuardar;

        usuarioDB.save((err, usuarioGuardado) => {
            if (err) return res.status(500).json({ ok: false, err });

            res.json({ ok: true, usuario: usuarioGuardado, img: nombreArchivoAGuardar });
        });
    });
}

function imagenProducto(id, res, nombreArchivoAGuardar) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivoAGuardar, 'productos');
            return res.status(500).json({ ok: false, err });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivoAGuardar, 'productos');
            return res.status(400).json({ ok: false, err: { message: 'El producto no existe' } });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivoAGuardar;

        productoDB.save((err, productoGuardado) => {
            if (err) return res.status(500).json({ ok: false, err });

            res.json({ ok: true, producto: productoGuardado, img: nombreArchivoAGuardar });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;