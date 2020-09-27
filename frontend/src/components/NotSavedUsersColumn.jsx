import React from 'react';
import User from './User';

const NotSavedusersColumn = (props) => {

    const createUserCard = (users) => {
        return users.map(user => <User key = {user.id} user = {user}/>)
    }

    const usersCards = createUserCard(props.users);
    return (
        <div className = {'container'}>
            {usersCards}
        </div>
    )
}

export default NotSavedusersColumn;