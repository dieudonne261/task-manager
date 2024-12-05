const express = require("express");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { name, description, date_fin } = req.body;

  const task = new Task({
    name,
    description,
    date_fin: date_fin || null,
  });

  try {
    const newTask = await task.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  const { name, description, date_fin } = req.body;

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Tâche introuvable" });

    task.name = name || task.name;
    task.description = description || task.description;
    task.date_fin = date_fin || task.date_fin;
    task.statue = task.date_fin ? "terminé" : "non terminé";

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const query = { _id: new ObjectId(req.params.id) };
    const result = await Task.collection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Tâche introuvable" });
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    res.status(500).json({ message: "Erreur interne au serveur" });
  }
});


module.exports = router;