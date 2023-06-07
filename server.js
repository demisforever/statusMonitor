const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const dateFormat = require('date-and-time')

app.use(express.static("public"));

// Configuración de la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123123',
  database: 'statusmonitor',
  DB: "market",
  dialect: "mysql",
  multipleStatements: true //permite hacer mas de una query
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a MySQL: ', err);
    return;
  }
  console.log('Conexión a MySQL establecida correctamente');
});

const server = app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

// set the view engine to ejs
app.set('view engine', 'ejs');

// http://localhost:3000/humidity/10/temperature/20
app.get("/humidity/:humidity/temperature/:temperature", (req, res) => {
  const humidity = req.params.humidity;
  const temperature = req.params.temperature;

  const paramsData = {
    humidity,
    temperature,
    createdat: new Date(),
    updatedat: new Date(),
  };

  var query = "INSERT INTO statusmonitor.status SET ?; ";
  connection.query(query, paramsData, (err, rows) => {
    if (err) {
      console.error('Error al guardar los datos: ', err);
      res.status(500).send('Error al guardar los datos');
      return;
    }
    res.redirect("/");
  });
});


app.get("/", (req, res) => {
  var query = "SELECT * FROM statusmonitor.status ORDER BY createdat DESC LIMIT 10;";
  connection.query(query, (err, rows) => {
    if (err) {
      console.error('Error al obtener los datos: ', err);
      return;
    }

    if (rows.length > 0) {
      res.render('status', { data: rows, dateFormat }); //paso los datos recividos de la query y date para el formato
    }
  });
});

