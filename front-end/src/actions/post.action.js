import axios from "axios";

export const GET_POSTS = "GET_POSTS";

export const getPosts = () => {
	return (dispatch) => {
		return axios.get("http://localhost:5000/api/movies").then((res) => {
			console.log(res);
		});
	};
};
