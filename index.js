//index.js

const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const apiRouter = require('./routers/api');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
  
    next();
  });

mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`);

const store = new MongoDBStore({
    uri: `${process.env.DB_URL}/${process.env.DB_NAME}`,
    collection: 'sessions'
});

app.use(session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: store // Use MongoDB as session store
}));

app.use(express.static('upload'));
app.use('/upload', express.static('upload'));
app.use('/api', apiRouter);

app.get('/', (req, res) => {
    res.send('Hello World, from express');
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) });
