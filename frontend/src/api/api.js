import * as axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:3000'
});

export const authAPI = {
    async connection(redirect) {
        return await instance.post('/auth/connection', {redirect});
    },
    async login(_id, code, redirect) {
        return await instance.post('/auth/login', {_id, code, redirect});
    }
}

export const userAPI = {
    async getUsers() {
        return await axios.get('https://jsonplaceholder.typicode.com/users');
    },
    async getPosts() {
        return await axios.get('https://jsonplaceholder.typicode.com/posts');
    },
    async findUsers(id) {
        return await instance.get(`/user/${id}`);
    },
    async deleteUser(user, authId) {
        return await instance.delete(`/user/${user.id}/${authId}`);
    },
    async saveUser(user, authId) {
        return await instance.post('/user', {user, authId});
    }
}