/// <reference types="cypress" />

////// Acceptance criterias:
// ● a user should be able to search for a car in a specific country/city,
// ● to rent a car, the user needs to provide dates,
// ● the user should be able to see car details after clicking "Rent” button,
// ● the user should be able to provide personal data in the rent form,
//////

const alertMessage = 'Please fill pickup and drop off dates'
const titleOfThePage = "Search"


describe('Tivix interview - Alekson Fortes - tests automated on cypress', () => {
  beforeEach(() => {
    cy.visit('http://qalab.pl.tivixlabs.com/')
  })

  it('displays Search on the title of the page when accessing page link', () => {
    cy.get('.nav-link').should('be.visible')
    cy.get('.nav-link').should('contain', titleOfThePage)
  })

  it('displays alert on the page when accessing page link', () => {
    cy.get('.alert').should('be.visible')
    cy.get('.alert').should('contain', alertMessage)
  })

  it('displays all the search fields when accessing page link', () => {
    // TODO: I would ask the dev or even I would add a selector for each element to not use nth-child selector.
    cy.get(':nth-child(1) > .col-sm-4').should('be.visible')
    cy.get(':nth-child(2) > .col-sm-4').should('be.visible')
    cy.get(':nth-child(3) > .col-sm-4').should('be.visible')
    cy.get(':nth-child(4) > .col-sm-4').should('be.visible')
    cy.get(':nth-child(5) > .col-sm-4').should('be.visible')
  })

  it.only('tests that a user should be able to search for a car in a specific country/city,', () => {
    cy.get('#country').select("Poland")
    cy.get('#city').select("Cracow")
    cy.get('#pickup').type('2022-08-16')
    cy.get('#dropoff').type('2022-08-18')
    // TODO: add a specific selector for search buttom. 
    cy.get('#search_form > .btn').click()
    // TODO: add a specific selector for rent buttom.
    cy.get(':nth-child(1) > :nth-child(7) > .btn').click()

  })

  it('tests that to rent a car, the user needs to provide dates. Test without providing a pickup date.', () => {
    cy.get('#country').select("Poland")
    cy.get('#city').select("Cracow")
    cy.get('#pickup').clear()
    cy.get('#dropoff').type('2022-08-18')
    // TODO: add a selector for search buttom. 
    cy.get('#search_form > .btn').click()
    cy.get('.alert').should('contain', alertMessage)
  })

  it('tests that to rent a car, the user needs to provide dates. Test without providing a dropoff date.', () => {
    cy.get('#country').select("Poland")
    cy.get('#city').select("Cracow")
    cy.get('#pickup').type('2022-08-18')
    cy.get('#dropoff').clear()
    // TODO: add a selector for search buttom. 
    cy.get('#search_form > .btn').click()
    cy.get('.alert').should('contain', alertMessage)
  })

  // TODO: Add test that verifies if the Model field is working properly as soon the defect xxxx is fixed. 



  
  
})
