import React from 'react';
import { ItemTypes } from '../common/ItemTypes';
import { useDrag } from 'react-dnd';

const User = ({ user, openModal, saveUser, deleteUser, isSaved }) => {

    const [{ isDragging }, drag] = useDrag({
        item: { name: user.name, type: ItemTypes.USER },
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult()
            if (item && dropResult) {
                if(dropResult.name === 'saveColumn' && !isSaved) {
                    saveUser(user);
                }
                if(dropResult.name === 'deleteColumn' && isSaved) {
                    deleteUser(user);
                }
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging()
        })
    })
    const opacity = isDragging ? 0 : 1;
    return (
        <div ref={drag} style={{ opacity, wordWrap: 'break-word'}} onDoubleClick={() => openModal(user)} className={'jumbotron m-3 align-self-center'}>
            <p style={{fontWeight: 'bolder'}}>{user.name}</p>
            <hr class="my-4"></hr>
            <p>username: {user.username}</p>
            <p>adress: {user.address.city}</p>
            <p>email: {user.email}</p>
            <p>website: {user.website}</p>
        </div>
    )
}

export default User;