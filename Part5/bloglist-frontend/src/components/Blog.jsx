import { useState } from 'react'

const Blog = ({ blog, onUpdate, onRemove, userid }) => {

  const [visible, setVisible] = useState(false)
  const showRemoveButton = userid === blog.user.id

  const updateLikes = (event) => {
    event.preventDefault()
    const updateObject = { likes: blog.likes + 1 }
    onUpdate(blog.id,updateObject)
  }

  const removeBlog = (event) => {
    event.preventDefault()
    if (window.confirm(`Do you want to delete ${blog.title}`)) {
      onRemove(blog.id)
    }
  }

  const infoForm = () => {

    return(
      <>
        <p>{blog.url}</p>
        <p>likes: {blog.likes} <button onClick = {updateLikes}>like</button></p>
        <p>{blog.user.name}</p>
        {showRemoveButton && <button onClick = {removeBlog}>remove</button>}
      </>
    )

  }

  return(
    <div className = "blog">
      {blog.title} by {blog.author}
      {visible ? <button onClick = {() => setVisible(false)}>hide</button> : <button onClick = {() => setVisible(true)}>view</button>}
      {visible && infoForm()}
    </div>
  )

}

export default Blog