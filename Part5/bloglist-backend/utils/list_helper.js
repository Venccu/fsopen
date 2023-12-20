const loadash = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    return sum + item
  }

  return blogs.length === 0
    ? 0
    : blogs.map(v => v.likes).reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {

  return blogs.length === 0
    ? 'Bloglist is empty, no favourite'
    : blogs.reduce(
      (prev, current) => {
        return prev.likes > current.likes ? prev : current
      }
    )
}

const mostBlogs = (blogs) => {

  if(blogs.length === 0) return 'Bloglist is empty'
  else {
    const grouped = loadash.groupBy(blogs,v => v.author)
    const authors_and_no_of_blogs = Object.entries(grouped).map(([key,value]) => [key, value.length])
    const max = authors_and_no_of_blogs.reduce(
      (prev, current) => {
        console.log(prev,current)
        console.log(prev[1],current[1])
        return prev[1] > current[1] ? prev : current
      })

    return {
      author: max[0],
      blogs: max[1]
    }

  }
}

const mostLikes = (blogs) => {

  if(blogs.length === 0) return 'Bloglist is empty'
  else {
    const grouped = loadash.groupBy(blogs,v => v.author)
    const authors_and_no_of_likes = Object.entries(grouped).map(([key,value]) => [key, totalLikes(value)])
    const max = authors_and_no_of_likes.reduce(
      (prev, current) => {
        console.log(prev,current)
        console.log(prev[1],current[1])
        return prev[1] > current[1] ? prev : current
      })

    return {
      author: max[0],
      likes: max[1]
    }

  }
}


module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}