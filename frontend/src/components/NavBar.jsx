import React from 'react'; 

const Navbar = (props) => {
    return(
        <ul className="nav">
        {props.isAuth && <li className={"nav-item"}>
            <img src={props.img} width="30" height="30" alt="" loading="lazy" />
            <p className={"d-inline m-2"} >{props.name}</p>
        </li>}
        <li className={"nav-item" + 
        " " + 
        (!props.isAuth ? "" : "hidden")}>
            <a href={`${props.googleLink}`} className={"nav-link"}>Login with Google</a>
        </li>
        <li className={"nav-item" + 
        " " + 
        (props.isAuth ? "" : "hidden")}>
            <a onClick={props.logOut} className={"nav-link"} href="/#">LogOut</a>
        </li>
    </ul>
    )
}

export default Navbar;