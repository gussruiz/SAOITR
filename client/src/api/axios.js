import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4444'
    // baseURL: 'http://10.20.8.195:24000'
});
