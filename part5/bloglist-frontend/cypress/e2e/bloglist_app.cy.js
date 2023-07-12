describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', Cypress.env('BACKEND') + '/testing/reset')

    cy.request('POST', Cypress.env('BACKEND') + '/users', {
      username: 'TestUser',
      name: 'Test User',
      password: 'TestPassword'
    })

    cy.visit('')
  })

  it('Login form is shown by default', function() {
    cy.contains('Login')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('input#usernameInput').type('TestUser')
      cy.get('input#passwordInput').type('TestPassword')
      cy.contains('Login').click()

      cy.contains('Test User logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('input#usernameInput').type('TestUser')
      cy.get('input#passwordInput').type('WrongPassword')
      cy.contains('Login').click()

      cy.contains('Wrong username or password')
      cy.get('Test User logged in').should('not.exist')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'TestUser', password: 'TestPassword' })
    })

    it('A blog can be created', function() {
      cy.request(Cypress.env('BACKEND') + '/blogs').its('body').should('have.length', 0)

      cy.contains('Test Title Test Author').should('not.exist')

      cy.contains('Create Blog').click()

      cy.get('input#titleInput').type('Test Title')
      cy.get('input#authorInput').type('Test Author')
      cy.get('input#urlInput').type('http://test.com')

      cy.contains(/^Create$/).click()

      cy.contains('Test Title Test Author')
      cy
        .request(Cypress.env('BACKEND') + '/blogs')
        .its('body')
        .should('have.length', 1)
        .and((blogs) => {
          expect(blogs[0]).to.deep.include({ title: 'Test Title', author: 'Test Author', url: 'http://test.com' })
        })
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'Test Title', author: 'Test Author', url: 'http://test.com' })
      })

      it('it can be liked', function() {
        cy
          .request(Cypress.env('BACKEND') + '/blogs')
          .its('body')
          .should((blogs) => expect(blogs[0].likes).to.equal(0))

        cy.contains('0 likes')

        cy.contains('Show').click()
        cy.contains('Like').click()

        cy.contains('1 likes')
        cy
          .request(Cypress.env('BACKEND') + '/blogs')
          .its('body')
          .should((blogs) => expect(blogs[0].likes).to.equal(1))
      })
    })
  })
})
