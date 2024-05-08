import express from "express";
import axios from "axios";
import _ from "lodash";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";

const app = express();
const PORT = process.env.PORT || 3000;

let usuarios = {
  male: [],
  female: [],
};

app.get("/", (req, res) => {
  res.redirect("/usuarios");
});

app.get("/usuarios", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=1");

    
    const usuario = response.data.results[0];
    const nuevoUsuario = {
      id: uuidv4().slice(0, 6), 
      genero: usuario.gender,
      nombre: usuario.name.first,
      apellido: usuario.name.last,
      timestamp: moment().format(), 
    };

    
    usuarios[usuario.gender] = _.concat(usuarios[usuario.gender], nuevoUsuario);

   
    console.log(
      chalk.bgWhite.blue(
        `Genero: ${nuevoUsuario.genero}, Nombre: ${nuevoUsuario.nombre}, Apellido: ${nuevoUsuario.apellido}, ID: ${nuevoUsuario.id}, Timestamp: ${nuevoUsuario.timestamp}`
      )
    );

    
    let html = "<h3>Usuarios Registrados</h3>";
    html += "<ul>";
    _.forEach(usuarios, (usuariosPorGenero, genero) => {
      _.forEach(usuariosPorGenero, (usuario) => {
        html += `<li>${genero} ${usuario.nombre} ${usuario.apellido} ${usuario.id} ${usuario.timestamp}</li>`;
      });
    });
    html += "</ul>";


    res.send(html);
  } catch (error) {
    console.error("Error al consultar la API Random User:", error.message);
    res.status(500).send("Error al consultar la API Random User");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
