import React from 'react';

const ModalWindow = ({ user, posts }) => {

    function createPostCard() {
        return posts.map((post) => {
            return (<div key={post.id} className="jumbotron" style={{ backgroundColor: "green", color: "white" }}>
                <p>{post.title}</p>
                <p>{post.body}</p>
            </div>)
        })
    }
    const postCard = createPostCard()
    return (
        <div className="container">
            <div className="row">
                <div class="page-header col-6">
                    <h1>{user.name}</h1>
                </div>
                {postCard}
            </div>
        </div>
    )
}

export default ModalWindow;