import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/auth";

class AuthService {
        signin(request) {
            return axios.post(MAIN_URL + '/signin', request)
        }
}

export default new AuthService();