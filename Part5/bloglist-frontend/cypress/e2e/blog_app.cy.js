describe('Blog app', function() {

  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    // create a new user
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:5173')
  })


  it('Login form is shown', function() {
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('wrong')
      cy.get('#password').type('faulty')
      cy.get('#login-button').click()

      cy.get('.error').should('contain', 'Wrong username or password')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('Add a new blog').click()
      cy.get('#title').type('My Title')
      cy.get('#author').type('My Author')
      cy.get('#url').type('My Url')
      cy.get('#create-button').click()
      cy.contains('Creation successful!')
      cy.contains('list of blogs')
        .parent().contains('My Title')
    })
  })

  describe('When logged in and blogs exist', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
      cy.createBlog({ title: 'My Title', author: 'My Author', url: 'My Url' })
    })

    it('A blog can be liked', function() {
      cy.contains('list of blogs')
        .parent().contains('My Title')
        .parent().contains('view').click()
      cy.contains('like').click()
      cy.contains('likes: 1')
    })

    it('A blog can be deleted by authorized user', function() {
      cy.contains('list of blogs')
        .parent().contains('My Title')
        .parent().contains('view').click()
      cy.contains('remove').click()
      cy.contains('My Title').should('not.exist')
    })

    it('delete button can only be seen by creator', function() {
      cy.contains('logout').click()
      // add a new user and login
      const user2 = {
        name: 'Another Person',
        username: 'usr',
        password: 'secret'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user2)
      cy.login({ username: 'usr', password: 'secret' })

      cy.contains('view').click()
      cy.contains('remove').should('not.exist')
    })

    it('blogs are sorted according to likes', function() {
      // add a few blogs
      cy.createBlog({ title: 'Second most likes', author: 'My Author', url: 'My Url' })
      cy.createBlog({ title: 'Third most likes', author: 'My Author', url: 'My Url' })
      cy.createBlog({ title: 'Most likes', author: 'My Author', url: 'My Url' })

      // give three likes
      cy.contains('list of blogs')
        .parent().contains('Most likes').contains('view').click()
      cy.contains('Most likes')
        .contains('like').click()
      // wait
      cy.contains('likes: 1')
      cy.contains('Most likes')
        .contains('like').click()
      // wait
      cy.contains('likes: 2')
      cy.contains('Most likes')
        .contains('like').click()
      cy.contains('hide').click()

      // give two likes
      cy.contains('Second most likes').contains('view').click()
      cy.contains('Second most likes')
        .contains('like').click()
      // wait
      cy.contains('likes: 1')
      cy.contains('Second most likes')
        .contains('like').click()
      // wait
      cy.contains('likes: 2')
      cy.contains('hide').click()

      // give one like
      cy.contains('Third most likes').contains('view').click()
      cy.contains('Third most likes')
        .contains('like').click()
      // wait
      cy.contains('likes: 1')

      cy.get('.blog').eq(0).should('contain', 'Most likes')
      cy.get('.blog').eq(1).should('contain', 'Second most likes')
      cy.get('.blog').eq(2).should('contain', 'Third most likes')

    })
  })

})