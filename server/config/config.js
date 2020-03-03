//===================================
// Puerto
//===================================
process.env.PORT = process.env.PORT || 3000;

//===================================
// Entorno
//===================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================================
// Vencimiento del Token  60 s * 60 m * 24 h * 30 d
//===================================

process.env.CADUCIDAD_TOKEN = '48h';

//===================================
// SEED de autenticacion
//===================================

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//===================================
// B.D.
//===================================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;

}

process.env.URLDB = urlDB;


//===================================
// B.D. google client id
//===================================

let CLIENT_ID = '450442935401-mbclhot718gf2hc70po6sms9rlgn3hc7.apps.googleusercontent.com';
process.env.CLIENT_ID = process.env.CLIENT_ID || CLIENT_ID;
'450442935401-mbclhot718gf2hc70po6sms9rlgn3hc7.apps.googleusercontent.com'