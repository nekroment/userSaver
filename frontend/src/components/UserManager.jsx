import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../api/api';
import NotSavedUsersColumn from './NotSavedUsersColumn';
import { withRouter } from 'react-router-dom';
const queryString = require('query-string');

const UserManager = (props) => {

    const emptyUser = {
        name: '',
        email: '',
        img: '',
        _id: ''
    }

    const [googleLink, setGoogleLink] = useState('');
    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(emptyUser);

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
        if (search.code) {
            try {

                const response = await authAPI.login(userData._id, search.code, redirect);
                setUserData(user => response.data);
                setIsAuth(isAuth => true);
                console.log(response.data._id)
                localStorage.setItem('_id', response.data._id);
            } catch (error) {
            }
        }
    }

    async function logOut() {
        setIsAuth(isAuth => false);
        setUserData(user => emptyUser);
        localStorage.removeItem('_id');
    }

    useEffect(async () => {
        if(localStorage.getItem('_id')) {
            const response = await authAPI.login(localStorage.getItem('_id'), '', redirect);
                setUserData(user => response.data);
                setIsAuth(isAuth => true);
        }
    }, [])
    useEffect(() => {
        getUserToken();
    }, [])

    useEffect(() => {
        getGoogleLink();
    }, []);

    useEffect(() => {
        getUsers();
    }, [isAuth]);

    return (
        <div>
            <nav class="navbar navbar-light bg-info">
                <span class="navbar-brand h1">
                    <img src={userData.img} className={isAuth ? '' :'hidden'} width="30" height="30" alt="" loading="lazy" />
                    <p  className={isAuth ? '' :'hidden'} >{userData.name}</p>
                </span>
                <a href={`${googleLink}`} className={"btn btn-default btn-lg" + " " + (!isAuth ? '' :'hidden')} role="button">Login with Google</a>
                <a onClick={logOut} className={"btn btn-default btn-lg" + ' ' + (isAuth ? '' :'hidden')} role="button">LogOut</a>
            </nav>
            <NotSavedUsersColumn users={users} />
        </div>
    )
}

export default withRouter(UserManager);