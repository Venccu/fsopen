import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content but does not show url or likes', () => {
  const blog = {
    title: 'Testing is fun',
    author: 'My Author',
    url: 'www.test.com',
    likes: 2,
    user: {
      id: '5a43e6b6c37f3d065eaaa581',
      username: 'user',
      name: 'Person'
    }
  }

  render(<Blog blog={blog} />)

  const element = screen.findByText('Testing is fun')
  expect(element).toBeDefined()

  // no url or number of likes
  const urlelement = screen.queryByText('www.test.com')
  expect(urlelement).toBeNull()
  const likeselement = screen.queryByText('likes')
  expect(likeselement).toBeNull()
})

test('displays url and likes when show button is clicked', async () => {

  const blog = {
    title: 'Testing is fun',
    author: 'My Author',
    url: 'www.test.com',
    likes: 2,
    user: {
      id: '5a43e6b6c37f3d065eaaa581',
      username: 'user',
      name: 'Person'
    }
  }



  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const urlelement = screen.queryByText('www.test.com')
  const likeselement = screen.queryByText('likes')
  expect(urlelement).toBeDefined()
  expect(likeselement).toBeDefined()

})


test('like button is called twice when it is clicked twice', async() => {

  const blog = {
    title: 'Testing is fun',
    author: 'My Author',
    url: 'www.test.com',
    likes: 0,
    user: {
      id: '5a43e6b6c37f3d065eaaa581',
      username: 'user',
      name: 'Person'
    }
  }
  const mockHandler = jest.fn()

  render(<Blog blog={blog} onUpdate = {mockHandler}/>)

  // click view
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  // click like twice
  const likebutton = screen.getByText('like')
  await user.click(likebutton)
  await user.click(likebutton)
  expect(mockHandler.mock.calls).toHaveLength(2)


})