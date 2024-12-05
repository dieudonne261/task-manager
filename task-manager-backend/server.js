const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const tasksRoutes = require("./routes/tasks");

const app = express();
const PORT = 5000;
const MONGO_URI = "mongodb://localhost:27017/task_manager";

app.use((err, req, res, next) => {
  console.error("Erreur globale :", err.stack);
  res.status(500).send({ message: "Erreur interne au serveur" });
});
app.use(cors());
app.use(express.json());
app.use("/api/tasks", tasksRoutes);

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connexion à MongoDB réussie");
    app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
  });
