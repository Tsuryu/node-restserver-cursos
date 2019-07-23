// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE DATOS
let urlDB;
urlDB = process.env.NODE_ENV === 'local' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://admin:ytQRyTYt3TYBvxdR@cluster0-4tilj.mongodb.net/cafe';

process.env.URLDB = urlDB;