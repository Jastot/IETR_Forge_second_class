const path = require('path');
const express = require('express');

const PORT = process.env.PORT || 3000;
const config = require('./config');
if (config.credentials.client_id == null || config.credentials.client_secret == null) {
    console.error('Missing FORGE_CLIENT_ID or FORGE_CLIENT_SECRET env. variables.');
    return;
}

let app = express();
var MongoClient = require("mongodb").MongoClient;
var dbTree;
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use('/api/forge/oauth', require('./routes/oauth'));
app.use('/api/forge/oss', require('./routes/oss'));
app.use('/api/forge/modelderivative', require('./routes/modelderivative'));
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode).json(err);
});

MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true }, function(err, database) {
    if (err) {
        return console.log(err);
    }
    dbTree = database.db('tree');
    console.log('CONNECTED');
    app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
});

app.get('/comp/:id', async function(req, res) {
    dbTree.collection('comp').find({}).toArray(function(err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components);
    });
});

app.get('/texts/:id', async function(req, res) {
    dbTree.collection('texts').find({ dbid: Number(req.params.id) }).toArray(function(err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components[0]);
    });
});