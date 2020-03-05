import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-js-firebase-7013d.firebaseio.com/'
});

export default instance;