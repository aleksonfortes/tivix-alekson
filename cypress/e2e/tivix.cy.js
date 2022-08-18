/// <reference types="cypress" />

//////
// ● I created the main structure about cypress for Tivix interview page, we still have many opportunities to improve this small project.
// ● We could do much more tests, but I think here is enough to show my knowledge about cypress.
// ● Also, would be nice to work closer to developers to plan the tests and do some scenarios in the componenet/integration level instead of e2e tests.
// ● I created many TODOs here regarding selectors. What I would suggest is using data-cy element to map better the page elements as cypress docs recommends.
//////

const alertMessageFillPickupAndDropoff = 'Please fill pickup and drop off dates'
const alertMessageEnterValidDate = 'Please enter a valid date!'
const alertMessageCardNumberWrongChars = 'Card number contains wrong chars'
const alertMessageProvideEmail = 'Please provide valid email'
const alertNameIsRequired = 'Name is required'
const alertLasNameIsRequired = 'Last name is required'
const alertEmailIsRequired = 'Email is required'
const alertCardNumberIsRequired = 'Card number is required'
const titleOfThePage = 'Searc'
const carModel = 'Skoda Octavia'
const carCompany = 'Bender-Hamilton'
const country = 'Poland'
const city = 'Cracow'
const price = '63'
const plate = 'LCE3493'
const pickup = '2022-08-26'
const dropoff = '2022-08-28'


describe('Tivix interview - Alekson Fortes - automated tests on cypress', () => {
  beforeEach(() => {
    cy.visit('http://qalab.pl.tivixlabs.com/')
  })

  it('test the layout of the page when accessing the tivix web link', () => {
    cy.get('.nav-link').should('be.visible').should('contain', titleOfThePage)
    // TODO: I would ask the dev or even I would add a selector for each element to not use nth-child selector.
    cy.get(':nth-child(1) > .col-sm-4').should('be.visible').should('contain', 'Country')
    cy.get(':nth-child(2) > .col-sm-4').should('be.visible').should('contain', 'City')
    cy.get(':nth-child(3) > .col-sm-4').should('be.visible').should('contain', 'Model')
    cy.get(':nth-child(4) > .col-sm-4').should('be.visible').should('contain', 'Pick-up date')
    cy.get(':nth-child(5) > .col-sm-4').should('be.visible').should('contain', 'Drop-off date')
    cy.get('.alert').should('be.visible').should('contain', alertMessageFillPickupAndDropoff)
  })

  it('test that a user should be able to search for a car in a specific country/city - happy path e2e.', () => {
    // search page test steps
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(pickup)
    cy.get('#dropoff').type(dropoff)
    // TODO: add a specific selector for search buttom. 
    cy.get('#search_form > .btn').click()

    // results page test steps
    // TODO: add a specific selector for rent buttom.
    cy.get(':nth-child(1) > :nth-child(7) > .btn').click()
    validateCarDetailsDisplayedOnDetailsScreen(carModel, carCompany, country, city, plate, pickup, dropoff)
    cy.get('.btn').click()

     // rent form test steps
    validateRentDetailsDisplayedOnSummaryScreen(carCompany, price, country, city, plate, pickup, dropoff)
    cy.get(':nth-child(2) > .col-form-label').should('contain', 'Name (length < 50)')
    cy.get(':nth-child(3) > .col-form-label').should('contain', 'Last name (length < 50)')
    cy.get(':nth-child(4) > .col-form-label').should('contain', 'Card number (only digits, length < 25)')
    cy.get(':nth-child(5) > .col-form-label').should('contain', 'Email (must contain @ and length < 50)')

    providePersonalDataInRentForm('Alekson', 'Fortes', '1234567812345678', 'alekson.fortes@tivix.com')
    cy.get('.btn').click()

    // TODO: add assert to validate that the rent was made with success. Fix it when fixing the defect xxxx regarding the error 404 when renting a car.
  })

  it('test the summary page - unhappy path - invalid card.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(pickup)
    cy.get('#dropoff').type(dropoff)
    cy.get('#search_form > .btn').click()
    cy.get(':nth-child(1) > :nth-child(7) > .btn').click()
    cy.get('.btn').click()
    providePersonalDataInRentForm('Alekson', 'Fortes', 'xxxx', 'alekson.fortes@tivix.com')
    cy.get('.btn').click()
    cy.get('.alert').should('contain', alertMessageCardNumberWrongChars)
  })

  it('test the summary page - unhappy path - invalid email.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(pickup)
    cy.get('#dropoff').type(dropoff)
    cy.get('#search_form > .btn').click()
    cy.get(':nth-child(1) > :nth-child(7) > .btn').click()
    cy.get('.btn').click()
    providePersonalDataInRentForm('Alekson', 'Fortes', '1234567812345678', 'alekson.fortes')
    cy.get('.btn').click()
    cy.get('.alert').should('contain', alertMessageProvideEmail)
  })

  it('test the summary page - unhappy path - all fields with no typed values.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(pickup)
    cy.get('#dropoff').type(dropoff)
    cy.get('#search_form > .btn').click()
    cy.get(':nth-child(1) > :nth-child(7) > .btn').click()
    cy.get('.btn').click()
    cy.get('.btn').click()
    cy.get('#rent_form > :nth-child(1)').should('contain', alertNameIsRequired)
    cy.get('#rent_form > :nth-child(2)').should('contain', alertLasNameIsRequired)
    cy.get('#rent_form > :nth-child(3)').should('contain', alertEmailIsRequired)
    cy.get('#rent_form > :nth-child(4)').should('contain', alertCardNumberIsRequired)
  })

  it('test that to rent a car, the user needs to provide dates. Test without providing a pickup date.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').clear();
    cy.get('#dropoff').type(dropoff)
    cy.get('#search_form > .btn').click()
    cy.get('.alert').should('contain', alertMessageFillPickupAndDropoff)
  })

  it('test that to rent a car, the user needs to provide dates. Test without providing a dropoff date.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(pickup)
    cy.get('#dropoff').clear()
    cy.get('#search_form > .btn').click()
    cy.get('.alert').should('contain', alertMessageFillPickupAndDropoff)
  })

  it('test that to rent a car, the user needs to provide dates. Test providing dropoff date before pickup date.', () => {
    selectCountryAndCityOnSearchScreen(country, city)
    cy.get('#pickup').type(dropoff)
    cy.get('#dropoff').type(pickup)
    cy.get('#search_form > .btn').click()
    cy.get('.alert').should('contain', alertMessageEnterValidDate)
  })

  // TODO: Add test that verifies if the Model field is working properly as soon the defect xxxx is fixed. 
  // TODO: Add test that verifies the list returned on the search results page after fixing defects.
  // TODO: Add test that verifies the price listed on the search results as soon fixing defects.
  // TODO: Add test that verifies the list returned on the search results page after fixing defects.

})

function selectCountryAndCityOnSearchScreen(country, city) { 
  cy.get('#country').select(country)
  cy.get('#city').select(city)
}

function providePersonalDataInRentForm(name, lastName, cardNumber, email) { 
  cy.get('#name').type(name)
  cy.get('#last_name').type(lastName)
  cy.get('#card_number').type(cardNumber)
  cy.get('#email').type(email)
}

function validateCarDetailsDisplayedOnDetailsScreen(model, company, country, city, plate, pickup, dropoff) { 
  cy.get('.card-header').should('contain', model)
  cy.get('.card-title').should('contain', 'Company: '+ company)
  // TODO: add specific selectors for all the fields here
  cy.get('.card-body > :nth-child(3)').should('contain', 'Location: ' + country + ', ' + city)
  cy.get('.card-body > :nth-child(4)').should('contain', 'License plate: ' + plate)
  cy.get('.card-body > :nth-child(5)').should('contain', 'Pickup date: ' + pickup)
  cy.get('.card-body > :nth-child(6)').should('contain', 'Dropoff date: ' + dropoff)
}

function validateRentDetailsDisplayedOnSummaryScreen(carCompany, price, country, city, plate, pickup, dropoff) { 
  cy.get('h2').should('contain', 'Summary')
  cy.get('.card-title').should('contain', 'Company: ' + carCompany)
  // TODO: add specific selectors for all the fields here
  cy.get('.col-md-4 > :nth-child(3)').should('contain', 'Price per day: ' + price)
  cy.get('.col-md-4 > :nth-child(4)').should('contain', 'Location: ' + country + ', ' + city)
  cy.get('.col-md-4 > :nth-child(5)').should('contain', 'License plate: ' + plate)
  cy.get('.col-md-4 > :nth-child(6)').should('contain', 'Pickup date: ' + pickup)
  cy.get('.col-md-4 > :nth-child(7)').should('contain', 'Dropoff date: ' + dropoff)
}
