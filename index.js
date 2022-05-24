const express = require('express');
const {readdirSync} = require("fs")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express();

const { connectDatabase } = require('./src/config/database');

//handles uncaught errors
process.on('uncaughtException', err => {
  console.log(err.name, err.message);
  console.log('UNCAUGHT EXCEPTION! Shutting Down....')
  process.exit(1);
})

//Body Parser, reading data from body into req.body 
app.use(express.json({ limit: '10kb' }));

//cors
app.use(cors())
app.use(cookieParser())


connectDatabase(app);

//load all the routes files and specify the routes
readdirSync('./src/api/routes').map((r) => app.use("/", require('./src/api/routes/' + r)))

app.get('/', (req, res) => {
  res.send('<h1>Ecommerce API</h1>');
});

// app.use('/', itemRoutes);

console.log('Waiting for database...');