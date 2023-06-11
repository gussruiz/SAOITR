import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4444'
    // baseURL: 'http://10.20.8.195:24000'
    // baseURL: 'http://10.20.8.196:22000'
    // baseURL: 'http://10.20.8.109:23000'
    // baseURL: 'http://10.20.8.80:25000'
});
