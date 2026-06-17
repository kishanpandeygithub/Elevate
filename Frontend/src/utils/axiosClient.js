import axios from "axios";

const axiosClient = axios.create({
    baseURL:"https://elevate-backend-web.onrender.com",
    withCredentials:true ,
    headers:{
        'Content-Type':'application/json'
    }
})

export default axiosClient;
