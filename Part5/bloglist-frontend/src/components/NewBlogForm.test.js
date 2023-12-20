import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

test('<NewBlogForm /> works', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()
  render(<NewBlogForm createNew={createBlog} />)

  const input_title = screen.getByPlaceholderText('Title')
  const input_author = screen.getByPlaceholderText('Author')
  const input_url = screen.getByPlaceholderText('Url')
  const sendButton = screen.getByText('create')

  expect(input_title).toBeDefined()
  expect(sendButton).toBeDefined()

  await user.type(input_title, 'this should be the title')
  await user.type(input_author, 'this should be the author')
  await user.type(input_url, 'this should be the url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('this should be the title')
  expect(createBlog.mock.calls[0][0].author).toBe('this should be the author')
  expect(createBlog.mock.calls[0][0].url).toBe('this should be the url')
})