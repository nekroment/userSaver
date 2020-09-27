import React from 'react';

const User = ({user}) => {
    return (
        <div className={'jumbotron'}>
            <h1>{user.name}</h1>
            <hr class="my-4"></hr>
            <p>username: {user.username}</p>
            <p>email: {user.email}</p>
        </div>
    )
}

export default User;