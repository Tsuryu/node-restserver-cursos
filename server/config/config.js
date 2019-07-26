// PUERTO
process.env.PORT = process.env.PORT || 3000;

// ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// BASE DE DATOS
let urlDB;
urlDB = process.env.NODE_ENV === 'local' ? 'mongodb://localhost:27017/cafe' : process.env.MONGO_URI;
process.env.URLDB = urlDB;

// TOKEN - AUTENTICACION
process.env.CADUCIDAD_TOKEN = '2d';
process.env.SEED = process.env.SEED || 'la-seed-secreta-para-encryptar-desarrollo';

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '922564660590-2chlqds5v3irrjbj4v3pv4d62timircd.apps.googleusercontent.com';