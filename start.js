const path = require('path');
const express = require('express');
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}
var bodyParser = require('body-parser');


let app = express();
var MongoClient = require("mongodb").MongoClient;
var db;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

var db_url = process.env.MONGODB_URI;
MongoClient.connect(db_url, { useUnifiedTopology: true }, function(err, database) {
    if (err) {
        return console.log(err);
    }
    db = database.db('heroku_whcx8gwx');
    console.log(`CONNECTED TO ${db.databaseName}`);
    app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
});

app.get('/texts/:id', function(req, res) {
    db.collection('texts').find({ dbid: Number(req.params.id) }).toArray(function(err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components[0]);
    });
});

app.post('/comp_names', function(req) {
    console.log(typeof req.body.chi);
});

app.get('/comp_names', function(req, res) {
    db.collection('comp_names').find({}, { projection: { _id: 0 } }).toArray(function(err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components);
    });
});