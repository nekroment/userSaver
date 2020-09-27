import React, { useState, useEffect } from 'react';
import { userAPI } from '../api/api';
import NotSavedUsersColumn from './NotSavedUsersColumn';

const UserManager = (props) => {

    const [users, setUsers] = useState([]);
    const [modal, setModal] = useState({});
    const [isAuth, setIsAuth] = useState(false);

    async function getUsers() {
        const response = await userAPI.getUsers();
        setUsers(users => response.data);
    }

    useEffect(() => {
        getUsers();
    }, [isAuth])

console.log(users);
    return(
        <div>
            <NotSavedUsersColumn users = {users}/>
        </div>
    )
}

export default UserManager;