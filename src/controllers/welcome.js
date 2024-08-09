import axios from "axios";

const URL = "http://localhost:8080"

 
export const loginAPI = (loginObj) => {
   
    return axios.post(URL + '/api/login', loginObj, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};


export const registerAPI = (registerObj) => {
    return axios.post(URL + '/api/register', registerObj, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

 