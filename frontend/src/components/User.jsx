import React from 'react';

const User = ({user, openModal}) => {
    return (
        <div onDoubleClick={() => openModal(user)} className={'jumbotron m-3 align-self-center'}>
            <h1>{user.name}</h1>
            <hr class="my-4"></hr>
            <p>username: {user.username}</p>
            <p>adress: {user.address.city}</p>
            <p>email: {user.email}</p>
            <p>website: {user.website}</p>
        </div>
    )
}

export default User;