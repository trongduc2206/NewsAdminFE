import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/source";

class SourceService {

    getAll(page, offset) {
        return axios.get(MAIN_URL, {params: {page: page, offset: offset}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
        // return axios.get(MAIN_URL, {params: {page: page, offset: offset}})
    }
    searchByUsername(name, page, offset) {
        return axios.get(MAIN_URL + "/search", {params: {page: page, offset: offset, name: name}, headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
    update(request) {
        console.log("call api update with request ", request)
        return axios.put(MAIN_URL + "/update", request, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
    create(request) {
        return axios.post(MAIN_URL + "/create", request, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
    stop(id) {
        return axios.put(MAIN_URL + "/stop/" + id,null, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
    start(id) {
        return axios.put(MAIN_URL + "/start/" + id, null, {headers: { Authorization: "Bearer " + JSON.parse(localStorage.getItem('user')).accessToken }})
    }
}

export default new SourceService();