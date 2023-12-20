import { useState } from 'react'

const NewBlogForm = ({ createNew }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog =(event) => {
    event.preventDefault()

    createNew({
      title: title,
      author: author,
      url: url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <form onSubmit={addBlog}>
        <h2>create new</h2>
        <div>
          title
          <input
            type="text"
            value={title}
            placeholder="Title"
            id = 'title'
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            type="text"
            value={author}
            placeholder="Author"
            id = 'author'
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url
          <input
            type="text"
            value={url}
            placeholder="Url"
            id = 'url'
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit" id='create-button'>create</button>
      </form>
    </>
  )
}

export default NewBlogForm