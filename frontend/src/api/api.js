import * as axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000'
});

export const authAPI = {
    async connection(redirect) {
        return await instance.post('/auth/connection', {redirect});
    },
    async login(token, redirect) {
        return await instance.post('/auth/login', {token, redirect});
    }
}

export const userAPI = {
    async getUsers() {
        return await axios.get('https://jsonplaceholder.typicode.com/users');
    },
    async findeUsers(id) {
        return await instance.get(`/user/${id}`);
    },
    async deleteUser(id) {
        return await instance.delete(`/user/${id}`);
    },
    async saveUser(user, id) {
        return await instance.post('/user', {user, id});
    }
}