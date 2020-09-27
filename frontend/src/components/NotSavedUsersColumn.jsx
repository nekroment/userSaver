import React, { useState } from 'react';
import User from './User';

const NotSavedusersColumn = (props) => {

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
        return sortUser.map(user => <User key={user.id} user={user} />)
    }

    const changeSort = () => {
        setSort(sort => ref.current.value);
    }

    const usersCards = createUserCard(props.users);
    return (
        <>
            <div className={'container'}>
                <form onSubmit={changeSort}>
                    <select ref={ref} onChange={changeSort} className="form-control">
                        <option value='username' selected>Username</option>
                        <option value='email' >Email</option>
                        <option value='address' >Adress</option>
                        <option value='website' >Website</option>
                    </select>
                </form>
                {usersCards}
            </div>
        </>
    )
}

export default NotSavedusersColumn;