import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/source";

class SourceService {
    getAll(page, offset) {
        return axios.get(MAIN_URL, {params: {page: page, offset: offset}})
    }
    searchByUsername(name, page, offset) {
        return axios.get(MAIN_URL + "/search", {params: {page: page, offset: offset, name: name}})
    }
    update(request) {
        console.log("call api update with request ", request)
        return axios.put(MAIN_URL + "/update", request)
    }
    create(request) {
        return axios.post(MAIN_URL + "/create", request)
    }
    stop(id) {
        return axios.put(MAIN_URL + "/stop/" + id )
    }
    start(id) {
        return axios.put(MAIN_URL + "/start/" + id)
    }
}

export default new SourceService();