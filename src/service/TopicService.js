import axios from "axios";

const MAIN_URL = "http://localhost:8080/api/topic/";

class TopicService {
    getTopicDisplay() {
        return axios
            .get(MAIN_URL + "display");
    }

    getTopicByKey(key) {
        console.log(key)
        return axios.get(MAIN_URL + key);
    }

    getTopicByParentKey(key) {
        return axios.get(MAIN_URL + "parent/" + key);
    }

    getNonChildrenTopic() {
        return axios.get(MAIN_URL)
    }

    saveTopicClick(request) {
        return axios.post(MAIN_URL + "click", request)
    }

    getTopicDisplayUser(userId) {
        return axios.get(MAIN_URL + "display/" + userId)
    }

    getTopicLv1(topicKey) {
        return axios.get(MAIN_URL + "lv1/" + topicKey)
    }
}

export default new TopicService();