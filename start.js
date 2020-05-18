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
MongoClient.connect(db_url, { useUnifiedTopology: true }, function (err, database) {
    if (err) {
        return console.log(err);
    }
    db = database.db('heroku_whcx8gwx');
    console.log(`CONNECTED TO ${db.databaseName}`);
    app.listen(PORT, () => { console.log(`Server listening on port ${PORT}`); });
});

app.get('/texts/:id', function (req, res) {
    db.collection('texts').find({ dbid: Number(req.params.id) }).toArray(function (err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components[0]);
    });
});

app.get('/tree/texts', function (req, res) {
    db.collection('texts').find({ id: req.query.id }).toArray(function (err, textoid) {
        if (err) {
            console.log(err);
        }
        res.send(textoid[0]);
    });
});

app.post('/comp_names', function (req) {
    console.log(typeof req.body.chi);
});

app.get('/comp_names', function (req, res) {
    db.collection('comp_names').find({}, { projection: { _id: 0 } }).toArray(function (err, components) {
        if (err) {
            console.log(err);
        }
        res.send(components);
    });
});

app.get('/tree', function (req, res) {
    db.collection('tree').find({}, { projection: { _id: 0, element_id: 0 } }).sort({ element_id: 1 }).toArray(function (err, tree) {
        if (err) {
            console.log(err);
        }
        res.send(tree);
    });
});

app.get('/model_id/id', function (req, res) {
    db.collection('model_id').find({ id: req.query.id }).toArray(function (err, obj) {
        if (err) {
            console.log(err);
        }
        res.send(obj[0].modelId);
    })
});

app.get('/model_id/type', function (req, res) {
    db.collection('model_id').find({ type: req.query.type }).toArray(function (err, obj) {
        if (err) {
            console.log(err);
        }
        res.send(obj[0].modelId);
    })
});

app.post('/annotations', function (req, res) {
    db.collection('annotations').insertOne({
        "index": Number(req.body.annotation.index),
        "x": req.body.annotation.x,
        "y": req.body.annotation.y,
        "z": req.body.annotation.z,
        "text": req.body.annotation.text,
        "sX": req.body.annotation.sX,
        "sY": req.body.annotation.sY
    });
    res.status(200).send();
});

app.get('/annotations', function (req, res) {
    db.collection('annotations').find().sort({ index: -1 }).toArray(function (err, obj) {
        if (err) {
            console.log(err);
        }
        res.send(obj);
        // console.log(obj);
    })
});

app.delete('/annotations', function (req, res) {
    db.collection('annotations').deleteOne({ index: Number(req.body.id) }, function (err, obj) {
        if (err) {
            console.log(err);
        }
        res.status(200).send();
    })
});