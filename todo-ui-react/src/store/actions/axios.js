import axios from "axios";

const instance = axios.create();
const localApiUrl = "http://localhost:8080";

let apiUrl = process.env.REACT_APP_API_BASE_URL;
console.log("REACT_APP_API_BASE_URL from env: " + apiUrl);
apiUrl = apiUrl || localApiUrl;
console.log("Effective REACT_APP_API_BASE_URL from env: " + apiUrl);
instance.defaults.baseURL = apiUrl;

// Set the AUTH token for any request
instance.interceptors.request.use(function(config) {
    const accessToken = localStorage.getItem("access_token");
    if (!config.headers.Authorization && accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

// Add a response interceptor
instance.interceptors.response.use(
    function(response) {
        return response;
    },
    function(error) {
        console.log(error);
        if (error.response.status === 401 || error.response.status === 403) {
            localStorage.removeItem("access_token");
            window.location = "/login";
        } else {
            return Promise.reject(error);
        }
    }
);

export default instance;
