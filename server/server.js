require('./config/config');
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// consultar
app.get('/usuario', function(req, res) {
    res.json('get Usuario');
});

// crear
app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.nombre == undefined) {
        res.status(400).json({ ok: false, mensaje: 'el nombre es necesario' });
    } else {
        res.json({ persona: body });
    }
});

// actualizar
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({ id });
});

// borrar
app.delete('/usuario', function(req, res) {
    res.json('borrar Usuario');
});

app.get('/', function(req, res) {
    res.json('Hello World');
});

app.listen(process.env.PORT, () => console.log('escuchando puerto', process.env.PORT));