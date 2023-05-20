import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
// import { useSelector } from "react-redux";

function App() {
	const [title, setTitle] = useState("");
	const [director, setDirector] = useState("");
	const [year, setYear] = useState("");
	const [color, setColor] = useState("");
	const [duration, setDuration] = useState("");
	const [data, setData] = useState([]);
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
	console.info(data);
	// const posts = useSelector((state) => state.postReducer)

	const postData = (data) => {
		axios
			.post("http://localhost:5000/api/movies", data)
			.then((response) => {
				console.log("Données envoyées avec succès !");
			})
			.catch((error) => {
				console.error("Erreur lors de l'envoi des données :", error);
			});
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		// Créez un objet avec les données à envoyer
		const data = {
			title: title,
			director: director,
			year: year,
			color: color,
			duration: parseInt(duration),
		};

		// Appelez la fonction postData pour envoyer les données
		postData(data);
	};
	const handleReset = () => {
		setTimeout(() => {
			setTitle("");
			setDirector("");
			setYear("");
			setColor("");
			setDuration("");
		}, 1000);
	};

	return (
		<div className="App">
			{data.map((item) => (
				<>
					<p>{item.title}</p>
					<p>{item.year}</p>
					<p>{item.productor}</p>
				</>
			))}
			<form id="myForm" onSubmit={handleSubmit}>
				<input
					type="text"
					value={title}
					placeholder="titre"
					onChange={(e) => setTitle(e.target.value)}
				/>
				<input
					type="text"
					value={year}
					placeholder="année"
					onChange={(e) => setYear(e.target.value)}
				/>
				<input
					type="text"
					placeholder="producteur"
					value={director}
					onChange={(e) => setDirector(e.target.value)}
				/>
				<input
					type="text"
					placeholder="couleur"
					value={color}
					onChange={(e) => setColor(e.target.value)}
					required
				/>
				<input
					type="number"
					placeholder="durer"
					value={duration}
					onChange={(e) => setDuration(e.target.value)}
					required
				/>
				<button type="submit" onClick={handleReset}>
					Envoyer
				</button>
			</form>
		</div>
	);
}

export default App;
