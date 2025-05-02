const BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://your-production-domain.com"
    : "http://localhost:8081";

export default BASE_URL;
