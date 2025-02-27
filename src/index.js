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
    port: process.env.PORT_DB
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
    const { title, descript, fk_city, fk_country } = req.body;
    const insertTravel = "INSERT INTO travel (title, descript, fk_city, fk_country) VALUES (?, ?, ?, ?)"
    const [results] = await connection.query(insertTravel, [title, descript, fk_city, fk_country]);
    connection.end();

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
});

//endpoint actualizar un viaje existente (título y descripción)
server.put("/travel/:id", async(req, res) => {

  try {
    const connection = await getDBconnection();
    const { id } = req.params;
    const { title, descript } = req.body;
    const updateTravel = "UPDATE travel SET title = ?, descript = ? WHERE id_travel = ?";
    const [result] = await connection.query(updateTravel, [title, descript, id]);
    connection.end();

    if (result.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Viaje actualizado."
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Ha ocurrido un error"
      })
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
});

//endpoint eliminar una viaje
server.delete("/travel/:id", async (req, res) => {
  try {
    const connection = await getDBconnection();
    const { id } = req.params;
    const deleteTravel = "DELETE FROM travel WHERE id_travel = ?";
    const [result] = await connection.query(deleteTravel, [id]);
    if (result.affectedRows > 0) {
      res.status(200).json({
        success: true,
        message: "Viaje eliminado."
      })
    } else {
      res.status(400).json({
        success: false,
        message: "Ha ocurrido un error al intentar eliminar un viaje."
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
});


//endpoint para registrar usuario
server.post("/register", async (req, res) => {
  try {
    const connection = await getDBconnection();
    const { email, user, pass} = req.body;
    const selectEmail = "SELECT email FROM usuarios WHERE email = ?";
    const [result] = await connection.query(selectEmail, [email]);

    if (result.length === 0) {
      const passHashed = await bcrypt.hash(pass, 10);
      const insertUser = "INSERT INTO usuarios (email, nombre,  password) VALUES (?, ?, ?)";
      const [resultUser] = await connection.query(insertUser, [email, user, passHashed]);
      res.status(201).json({
        success: true,
        id: resultUser.insertId,
        token: passHashed,
      })
    } else {
      res.status(200).json({
        success: false,
        message: "Usuario ya existente.",
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
});

//endpoint inicio sesion
server.post("/login", async(req, res) => {

  try {
    const connection = await getDBconnection();
    const { email, pass } = req.body;
    const selectEmail = "SELECT * FROM usuarios WHERE email = ?";
    const [result] = await connection.query(selectEmail, [email]);
    if (result.length !== 0) {
      const passwordDB = result[0].password;
      const isSamePassword = await bcrypt.compare(pass, passwordDB);

      if (isSamePassword) {
        const infoToken = {email: result[0].email, id: result[0].id}
        const token = jwt.sign(infoToken, "secret_key", {expiresIn: "1h"});
        res.status(200).json({
          success: true,
          token: token,
        })
        } else {
          res.status(400).json({
            success: false,
            message: "Contraseña incorrecta"
          })
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Email incorrecto."
        })
      }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    })
  }
});

//funcion para authorizacion
function authorization (req, res, next) {
  const tokenCreated = req.headers.authorization;
  if(!tokenCreated) {
    res.status(400).json({success: false, message: "Usuario no autorizado."})
  } else {
    try {
      const token = tokenCreated.split(" ")[1];
      const verifyToken = jwt.verify(token, "secret_key");
      req.dataUser = verifyToken;
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error,
      })
    }
    next();
  }
};

//endpoint usuarios con authorizacion middleware
server.get("/users", authorization, async(req, res) => {
  
  const connection = await getDBconnection();
  const selectUsers = "SELECT * FROM usuarios";
  const [result] = await connection.query(selectUsers);
  res.status(200).json({
    success: true,
    info: result
  })

});

//static server
const staticServerPath = "./public";
server.use(express.static(staticServerPath))