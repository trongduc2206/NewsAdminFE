import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/user";

class UserService {
    getAll(page, offset) {
        return axios.get(MAIN_URL, {params: {page: page, offset: offset}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    searchByUsername(username, page, offset) {
        return axios.get(MAIN_URL + "/search", {params: {page: page, offset: offset, username: username}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }

    update(user) {
        return axios.put(MAIN_URL + "/update", user, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
}

export default new UserService();