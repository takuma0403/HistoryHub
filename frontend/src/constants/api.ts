const BASE_URL =
  import.meta.env.MODE === "production"
    ? "/api/"
    : "http://localhost:8081";

export default BASE_URL;
