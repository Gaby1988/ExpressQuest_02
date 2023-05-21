import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [savedData, setSavedData] = useState({});

  const getData = () => {
    axios
      .get("http://localhost:5000/api/movies")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const updateData = (id, newData) => {
    axios
      .put(`http://localhost:5000/api/movies/${id}`, newData)
      .then((response) => {
        console.log("Données mises à jour avec succès !");
        const updatedData = { ...savedData };
        delete updatedData[id];
        setSavedData(updatedData);
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour des données :", error);
      });
  };

  const handleEdit = (id) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: true,
    }));
  };

  const handleSave = (id) => {
    const newData = editedData[id];
    if (newData) {
      updateData(id, newData);
    }
  };

  const handleInputChange = (id, property, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [id]: {
        ...prevData[id],
        [property]: value,
      },
    }));
  };

  const handleCancel = (id) => {
    setEditedData((prevData) => {
      const updatedData = { ...prevData };
      delete updatedData[id];
      return updatedData;
    });
  };

  return (
    <div className="App">
      {data.map((item) => (
        <div key={item.id}>
          {editedData[item.id] ? (
            <>
              <input
                type="text"
                value={editedData[item.id].title || item.title}
                onChange={(e) =>
                  handleInputChange(item.id, "title", e.target.value)
                }
              />
              <input
                type="text"
                value={editedData[item.id].year || item.year}
                onChange={(e) =>
                  handleInputChange(item.id, "year", e.target.value)
                }
              />
              <input
                type="text"
                value={editedData[item.id].director || item.director}
                onChange={(e) =>
                  handleInputChange(item.id, "director", e.target.value)
                }
              />
              <button onClick={() => handleSave(item.id)}>Enregistrer</button>
              <button onClick={() => handleCancel(item.id)}>Annuler</button>
            </>
          ) : (
            <>
              <p onClick={() => handleEdit(item.id)}>{item.title}</p>
              <p onClick={() => handleEdit(item.id)}>{item.year}</p>
              <p onClick={() => handleEdit(item.id)}>{item.director}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
