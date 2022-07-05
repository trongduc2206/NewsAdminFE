import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/source";

class SourceService {
    getAll(page, offset) {
        return axios.get(MAIN_URL, {params: {page: page, offset: offset}})
    }
    searchByUsername(name, page, offset) {
        return axios.get(MAIN_URL + "/search", {params: {page: page, offset: offset, name: name}})
    }
}

export default new SourceService();