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
})
