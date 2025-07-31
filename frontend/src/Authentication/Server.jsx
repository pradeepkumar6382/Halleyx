import axios from "axios";

const server = axios.create({
    baseURL: "https://halleyx-backend.onrender.com",
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
});

export default server;
