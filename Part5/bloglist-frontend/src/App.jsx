import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import ErrorMsg from './components/ErrorMsg'
import Notification from './components/Notification'
import NewBlogForm from './components/NewBlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errormsg, setErrorMsg] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const noteFormRef = useRef()

  const loginForm = () => (

    <form onSubmit={handleLogin}>
      <h2>login</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          id="username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          id="password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit" id="login-button">login</button>
    </form>
  )

  const logoutForm = () => (
    <>
      <p> {user.name} logged in <button onClick = {() => logOutUser()}>logout</button> </p>
    </>
  )

  const blogForm = () => (
    <div>
      <h2>user info</h2>
      {logoutForm()}
      {/* {createForm()} */}
      <Togglable buttonLabel='Add a new blog' ref={noteFormRef}>
        <NewBlogForm createNew = {handleNewBlog}/>
      </Togglable>
      <h2>list of blogs</h2>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} onUpdate = {handleUpdate} onRemove = {handleRemove} userid = {user.id}/>
      )}
    </div>
  )

  const logOutUser = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification('Logout successful!')
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotification('Login successful!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      setErrorMsg('Wrong username or password')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }



  const handleNewBlog = async (blogObject) => {
    noteFormRef.current.toggleVisibility()

    try {
      await blogService.
        create(blogObject)
      setNotification(`Creation successful! A new blog ${blogObject.title} by ${blogObject.author}`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const blogs = await blogService.getAll()
      setBlogs( blogs )

    } catch (exception) {
      console.log(exception)
      setErrorMsg('Bad request, please provide title, author and url')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }

  }

  const handleUpdate = async (id, blogObject) => {

    try {
      await blogService.
        update(id, blogObject)
      setNotification('Update successful!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const blogs = await blogService.getAll()
      setBlogs( blogs )

    } catch (exception) {
      console.log(exception)
      setErrorMsg(`Error, ${exception.response.data.error}`)
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }
  const handleRemove = async (id) => {

    try {
      await blogService.
        remove(id)
      setNotification('Deletion successful!')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      const blogs = await blogService.getAll()
      setBlogs( blogs )

    } catch (exception) {
      setErrorMsg(`Error, ${exception.response.data.error}`)
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h1>Blog App</h1>
      <ErrorMsg message = {errormsg} />
      <Notification message={notification} />
      {user === null && loginForm()}
      {user !== null && blogForm()}
    </div>
  )
}

export default App