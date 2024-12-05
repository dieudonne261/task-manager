import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

function App() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);
  const [currentTask, setCurrentTask] = useState({
    _id: null,
    name: "",
    description: "",
    date_creation: "",
    date_fin: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTask({ ...currentTask, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/tasks/${currentTask._id}`, currentTask);
        setNotification({ type: "success", message: "Tâche modifiée avec succès !" });
      } else {
        await axios.post("http://localhost:5000/api/tasks", currentTask);
        setNotification({ type: "success", message: "Tâche ajoutée avec succès !" });
      }

      setCurrentTask({ _id: null, name: "", description: "", date_creation: "", date_fin: "" });
      setIsEditMode(false);
      fetchTasks();
    } catch (error) {
      setNotification({
        type: "danger",
        message: "Erreur lors de l'ajout ou la modification de la tâche.",
      });
    }

    setTimeout(() => setNotification(null), 5000);
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/tasks/${taskId}`);
      if (response.status === 200) {
        console.log("Tâche supprimée :", taskId);
        setTasks(tasks.filter((task) => task._id !== taskId));
      }
    } catch (err) {
      console.error("Erreur lors de la suppression :", err.response?.data || err.message);
    }
  };
  
  

  const handleEdit = (task) => {
    setCurrentTask(task);
    setIsEditMode(true);
  };

  return (
    <div className="container mt-5 pt-5">
      

      <nav className="m-2 navbar-light pt-2 fixed-top" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
          <h1 className="text-center display-1">
              My Task
          </h1>
          <div className="container d-flex justify-content-end mb-3 align-items-center">
              <input
                  type="text"
                  className="form-control me-3"
                  placeholder="Rechercher une tâche..."
                  value={search}
                  onChange={handleSearch}
              />
              <img 
                  src="avatar.png" 
                  alt="Avatar" 
                  className="rounded-circle" 
                  style={{ width: '40px', height: '40px' }}
              />
          </div>
          {notification && (
        <div
          className={`alert alert-${notification.type} alert-dismissible fade show`}
          role="alert"
        >
          {notification.message}
        </div>
      )}
      </nav>





      
      <div className="row mt-5">
        {tasks.filter((task) => task?.name && task.name.toLowerCase().includes(search))
          .length > 0 ? (
          tasks
            .filter((task) => task?.name && task.name.toLowerCase().includes(search))
            .map((task) => (
              <div className="col-md-4 mb-3" key={task._id}>
                <div className={`card ${task.date_fin ? "bg-light shadow" : "bg-secondary shadow text-light"}`}>
                  <div className="card-body">
                    <h5 className="card-title">{task.name}</h5>
                    
                    <p className="card-text">{task.description}</p>
                    <p className="card-text">
                      Statut :{" "}
                      <strong>{task.date_fin ? "Terminé" : "Non terminé"}</strong>
                    </p>
                    <p className="card-text">
                        Crée :{" "}
                      {new Date(task.date_creation).toLocaleDateString()}
                    </p>
                    {task.date_fin && (
                      <p className="card-text">
                        Terminé : {new Date(task.date_fin).toLocaleDateString()}
                      </p>
                    )}
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleEdit(task)}
                      data-bs-toggle="modal"
                      data-bs-target="#addTaskModal"
                    >
                      Modifier
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
        ) : (
          <div className="col-12 text-center my-5">
            <img src="none.gif" alt="Aucune tâche trouvée" className="img-fluid " />
            <h3 className="text-muted">Aucune tâche trouvée</h3>
          </div>

        )}
      </div>

      <button
        className="btn btn-primary position-fixed bottom-0 end-0 m-3"
        data-bs-toggle="modal"
        data-bs-target="#addTaskModal"
        onClick={() => {
          setCurrentTask({ _id: null, name: "", description: "", date_creation: "", date_fin: "" });
          setIsEditMode(false);
        }}
      >
        + Nouveau
      </button>

      <div
        className="modal fade"
        id="addTaskModal"
        tabIndex="-1"
        aria-labelledby="addTaskModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addTaskModalLabel">
                {isEditMode ? "Modifier la tâche" : "Nouvelle tâche"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="taskName" className="form-label">
                  Nom
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="taskName"
                  name="name"
                  value={currentTask.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="taskDescription"
                  name="description"
                  rows="3"
                  value={currentTask.description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="taskDateCreation" className="form-label">
                  Date de création
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="taskDateCreation"
                  name="date_creation"
                  value={currentTask.date_creation}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="taskDateFin" className="form-label">
                  Date de fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="taskDateFin"
                  name="date_fin"
                  value={currentTask.date_fin}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                data-bs-dismiss="modal"
              >
                {isEditMode ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;