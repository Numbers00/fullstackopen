describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', Cypress.env('BACKEND') + '/testing/reset')
    cy.visit('')
  })

  it('Login form is shown by default', function() {
    cy.contains('Login')
  })
})
