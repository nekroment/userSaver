import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../api/api';
import NotSavedUsersColumn from './NotSavedUsersColumn';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import ModalWindow from './ModalWindow';
const queryString = require('query-string');
require('dotenv/config');
Modal.setAppElement('#root');

const UserManager = (props) => {

    const emptyUser = {
        name: '',
        email: '',
        img: '',
        _id: ''
    }
    const redirect = 'http://localhost:3002'

    //Состояния
    const [googleLink, setGoogleLink] = useState('');
    const [users, setUsers] = useState([]);
    const [modalPosts, setModalPosts] = useState([]);
    const [modalUser, setModalUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(emptyUser);
    const [posts, setPosts] = useState([]);
    const [isModal, setIsModal] = useState(false);

    //Запрос пользователей
    async function getUsers() {
        const response = await userAPI.getUsers();
        setUsers((users) => { return response.data });
    }

    //Запрос постов
    async function getPosts() {
        const response = await userAPI.getPosts();
        setPosts(posts => response.data);
    }

    //Запрос ссылки авторизации
    async function getGoogleLink() {
        try {
            const response = await authAPI.connection(redirect);
            setGoogleLink(link => response.data);
        } catch (error) {
        }
    }

    //Авторизация пользователя в гугл
    async function getUserToken() {
        let search = queryString.parse(props.location.search);
        if (search.code) {
            try {
                const response = await authAPI.login(userData._id, search.code, redirect);
                setUserData(user => response.data);

                setIsAuth(isAuth => true);
                localStorage.setItem('_id', response.data._id);
            } catch (error) {
            }
        }
    }

    //Выход пользователя
    async function logOut() {
        setIsAuth(isAuth => false);
        setUserData(user => emptyUser);
        localStorage.removeItem('_id');
    }

    async function openModal(user) {
        const userPosts = await posts.filter(post => post.userId === user.id);
        setModalPosts(() => { return userPosts });
        setModalUser(() => { return user });
        setIsModal(isModal => true);

    }

    async function closeModal() {

        setModalPosts(() => { return [] });
        setModalUser(() => { return {} });
        setIsModal(isModal => false);

    }

    //Если сохраннен id пользователя, сделать запрос к базе данных на авторизацию
    useEffect(async () => {
        if (localStorage.getItem('_id')) {
            const response = await authAPI.login(localStorage.getItem('_id'), '', redirect);
            setUserData(user => response.data);
            setIsAuth(isAuth => true);
        }
    }, []);

    //Эффект авторизации
    useEffect(() => {
        getUserToken();
    }, [])

    //Эффект получения ссылки авторизации
    useEffect(() => {
        getGoogleLink();
    }, []);

    //Эффект получения пользователей и их постов
    useEffect(() => {
        getUsers();
        getPosts();
    }, [isAuth]);

    return (
        <>
            <nav class="navbar navbar-light bg-info">
                <span class="navbar-brand h1">
                    <img src={userData.img} className={isAuth ? '' : 'hidden'} width="30" height="30" alt="" loading="lazy" />
                    <p className={isAuth ? '' : 'hidden'} >{userData.name}</p>
                </span>
                <a href={`${googleLink}`} className={"btn btn-default btn-lg" + " " + (!isAuth ? '' : 'hidden')} role="button">Login with Google</a>
                <a onClick={logOut} className={"btn btn-default btn-lg" + ' ' + (isAuth ? '' : 'hidden')} role="button">LogOut</a>
            </nav>
            <div className="container">
                <div className="row">
                    <div className={"col-lg-5 col-md-5 col-sm-10 col-xs-10"}>
                        <NotSavedUsersColumn openModal={openModal} users={users} />
                    </div>
                    <div className={"col-lg-5 col-md-5 col-sm-10 col-xs-10 offset-lg-1 offset-md-1"}>
                        <NotSavedUsersColumn openModal={openModal} users={users} />
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModal}
                onRequestClose={closeModal}
                style={{
                    overlay: {
                        backgroundColor: 'grey'
                    }
                }}>
                <ModalWindow user={modalUser} posts={modalPosts} />
            </Modal>
        </>
    )
}

export default withRouter(UserManager);