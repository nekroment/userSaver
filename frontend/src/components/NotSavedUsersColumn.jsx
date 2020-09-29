import React, { useState } from 'react';
import User from './User';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../common/ItemTypes';

const NotSavedUsersColumn = (props) => {

    const [, drop] = useDrop({
        accept: ItemTypes.USER,
        drop: () => ({ name: 'deleteColumn' }),
        collect: (monitor) => ({
        })
    })

    const ref = React.createRef();

    const [sort, setSort] = useState('username');

    const createUserCard = (users) => {
        const sortUser = users.sort((first, second) => {
            if (sort === 'address') {
                if (first[sort].city > second[sort].city) {
                    return 1;
                } else {
                    return -1;
                }
            } else {
                if (first[sort] > second[sort]) {
                    return 1;
                } else {
                    return -1;
                }
            }

        });
        return sortUser.map(user => <User isSaved={false} saveUser={props.saveUser} openModal={props.openModal} key={user.id} user={user} />)
    }

    const changeSort = () => {
        setSort(sort => ref.current.value);
    }

    const usersCards = createUserCard(props.users);
    return (
        <>

            <div ref={drop} style={{ backgroundColor: "blue" }}>
                <form onSubmit={changeSort}>
                    <select defaultValue={'username'} ref={ref} onChange={changeSort} className="form-control">
                        <option value='username'>Username</option>
                        <option value='email' >Email</option>
                        <option value='address' >Adress</option>
                        <option value='website' >Website</option>
                    </select>
                </form>
                {usersCards.length > 0 ? usersCards :
                        <div style={{ wordWrap: 'break-word', }} className={'jumbotron m-3 align-self-center'}>
                            <p style={{ fontWeight: 'bolder' }}>Нет не сохраненных данных</p>
                            <hr className="my-4"></hr>
                            <p>Перетащите сюда карточку пользователя, чтобы удалить</p>
                        </div>
                }
                <div className={"row"}></div>
            </div>

        </>
    )
}

export default NotSavedUsersColumn;