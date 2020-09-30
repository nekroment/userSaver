import React, { useState, useEffect } from 'react';
import { userAPI, authAPI } from '../api/api';
import NotSavedUsersColumn from './NotSavedUsersColumn';
import SavedUsersColumn from './SavedUsersColumn';
import { withRouter } from 'react-router-dom';
import Modal from 'react-modal';
import ModalWindow from './ModalWindow';
import Navbar from './NavBar';
const queryString = require('query-string');
require('dotenv/config');
Modal.setAppElement('#root');

const UserManager = (props) => {

    //Шаблон авторизированного пользователя
    const emptyUser = {
        name: '',
        email: '',
        img: '',
        _id: ''
    }
    const redirect = `${process.env.REDIRECT}`

    //Состояния
    const [googleLink, setGoogleLink] = useState('');
    const [savedUsers, setSavedUsers] = useState([]);
    const [notSavedUsers, setNotSavedUsers] = useState([]);
    const [modalPosts, setModalPosts] = useState([]);
    const [modalUser, setModalUser] = useState({});
    const [isAuth, setIsAuth] = useState(false);
    const [userData, setUserData] = useState(emptyUser);
    const [posts, setPosts] = useState([]);
    const [isModal, setIsModal] = useState(false);

    //Запрос пользователей
    async function getUsers() {
        try {
            const response = await userAPI.getUsers();
            let isSave = [];
            let saveUsers;
            if (localStorage.getItem('_id')) {
                isSave = await userAPI.findUsers(localStorage.getItem('_id'));
                saveUsers = response.data.map((user) => {
                    for (let i = 0; i < isSave.data.length; i++) {
                        if (user.id === isSave.data[i].id) {
                            user.isSave = true;
                            return user;
                        }
                    }
                    user.isSave = false;
                    return user;
                })
            } else {
                saveUsers = response.data.map((user) => {
                    user.isSave = false;
                    return user;
                })
            }
            setSavedUsers((savedUsers) => { return saveUsers.filter(user => user.isSave === true) });
            setNotSavedUsers((notSavedUsers) => { return saveUsers.filter(user => user.isSave === false) });
        } catch (error) {
            throw error;
        }
    }

    //Запрос постов
    async function getPosts() {
        try {
            const response = await userAPI.getPosts();
            setPosts(posts => response.data);
        } catch (error) {
            throw error;
        }
    }

    //Запрос ссылки авторизации
    async function getGoogleLink() {
        try {
            const response = await authAPI.connection(redirect);
            setGoogleLink(link => response.data);
        } catch (error) {
            throw error;
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
                throw error;
            }
        }
    }

    //Выход пользователя
    async function logOut() {
        setIsAuth(isAuth => false);
        setUserData(user => emptyUser);
        localStorage.removeItem('_id');
    }

    //Модальное окно открыто
    async function openModal(user) {
        try {
            const userPosts = await posts.filter(post => post.userId === user.id);
            setModalPosts(() => { return userPosts });
            setModalUser(() => { return user });
            setIsModal(isModal => true);
        } catch (error) {
            throw error;
        }
    }

    //Модальное окно закрыто
    async function closeModal() {
        setModalPosts(() => { return [] });
        setModalUser(() => { return {} });
        setIsModal(isModal => false);
    }

    //Сохранение карточки user
    async function saveUser(user) {
        if (localStorage.getItem('_id')) {
            try {
                await userAPI.saveUser(user, localStorage.getItem('_id'));
                getUsers();
            } catch (error) {
                throw error;
            }
        }
    }

    //Удаление карточки user
    async function deleteUser(user) {
        if (localStorage.getItem('_id')) {
            try {
                await userAPI.deleteUser(user, localStorage.getItem('_id'));
                getUsers();
            } catch (error) {
                throw error;
            }
        }
    }

    //запрос к базе данных на авторизацию
    async function idAuth() {
        try {
            const response = await authAPI.login(localStorage.getItem('_id'), '', redirect);
            setUserData(user => response.data);
            setIsAuth(isAuth => true);
        } catch (error) {
            throw error;
        }
    }

    //Если сохраннен id пользователя, сделать запрос к базе данных на авторизацию
    useEffect(() => {
        if (localStorage.getItem('_id')) {
            idAuth();
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
            <Navbar logOut={logOut} googleLink={googleLink} name={userData.name} img={userData.img} isAuth={isAuth}/>
            <div className="container">
                <div className="row">
                    <div className={"col-lg-5 col-md-10 col-sm-10 col-xs-10"}>
                        <NotSavedUsersColumn saveUser={saveUser} openModal={openModal} users={notSavedUsers} />
                    </div>
                    <div className={"col-lg-5 col-md-10 col-sm-10 col-xs-10 offset-lg-1"}>
                        <SavedUsersColumn deleteUser={deleteUser} openModal={openModal} users={savedUsers} />
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
