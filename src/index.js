//imports
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise')


//crear el servidor
const server = express();

// configurar el servidor
server.use(cors());
server.use(express.json({limit:"25mb"}));
server.set("view engine", "ejs");
require('dotenv').config();


//funcion para conectarse a la BD
async function getDBconnection() {
  const connection = await mysql.createConnection({
    host: process.env.HOST_DB,
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    database: process.env.NAME_DB,
  });
  await connection.connect();
  return connection;
};

const PORT = 5005;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});

//endpoint listar entradas existentes
server.get("/travel", async(req, res) => {
  try {
    const connection = await getDBconnection();
    const selectTravel = "SELECT * from travel";
    const [results] = await connection.query(selectTravel);
    connection.end();
    res.status(200).json({
      success: true,
      results: results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
});

//endpoint insertar una entrada en travel
server.post("/travel", async(req, res) => {
  try {
    const connection = await getDBconnection();
    const {title, descript, fk_city, fk_country} = req.body;
    const insertTravel = "INSERT INTO travel (title, descript, fk_city, fk_country) VALUES (?, ?, ?, ?)"
    const [results] = await connection.query(insertTravel, [title, descript, fk_city, fk_country]);

    if (results) {
      res.status(201).json({
        success: true,
        id: results.insertId,
        result: results,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "El viaje no se ha insertado."
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
})
