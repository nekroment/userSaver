import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../api/api';
import NotSavedUsersColumn from './NotSavedUsersColumn';
import { withRouter } from 'react-router-dom';
const queryString = require('query-string');

const UserManager = (props) => {

    const [googleLink, setGoogleLink] = useState('');
    const [token, setToken] = useState('');
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState({});
    const [isAuth, setIsAuth] = useState(false);

    const redirect = 'http://localhost:3002';

    async function getUsers() {
        const response = await userAPI.getUsers();
        setUsers(users => response.data);
    }

    async function getGoogleLink() {
        try {
            const response = await authAPI.connection(redirect);
            setGoogleLink(link => response.data);
        } catch (error) {
        }
    }

    async function getUserToken() {
        let search = queryString.parse(props.location.search);
        if(search.code) {
            try {
                const response = await authAPI.login(search.code, redirect);
                debugger
            } catch (error) {
                debugger
            }
        }
    }

    useEffect(() => {
        getUserToken();
    }, [])

    useEffect(() => {
        getGoogleLink();
    }, []);

    useEffect(() => {
        getUsers();
    }, [isAuth]);

    console.log(users);
    return (
        <div>
            <a href={`${googleLink}`}>Login with Google</a>
            <NotSavedUsersColumn users={users} />
        </div>
    )
}

export default withRouter(UserManager);