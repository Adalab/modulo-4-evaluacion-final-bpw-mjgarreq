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

const PORT = 5005;
server.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
