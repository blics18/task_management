var testcafe = require('testcafe');
var Selector = testcafe.Selector;

fixture `Login/Registration Page`// declare the fixture
    .page `localhost:3000/auth`;  // specify the start page

const firstNameInput = Selector('input[name="firstName"]');
const lastNameInput = Selector('input[name="lastName"]');
const registrationEmailInput = Selector('input[name="email"]');
const registrationPasswordInput = Selector('input[name="password"]');
const submitRegisterButton = Selector('#btn-submitRegister');

const loginEmailInput = Selector('#loginUser-form input[name="email"]');
const loginPasswordInput = Selector('#loginUser-form input[name="password"]');
const submitLoginButton = Selector('#btn-submitLogin');

//TODO change to test database


test('Register Correctly', async t => {
    await t
        .click(firstNameInput)
        .typeText(firstNameInput, 'John')
        .click(lastNameInput)
        .typeText(lastNameInput, 'Smith')
        .click(registrationEmailInput)
        .typeText(registrationEmailInput, 'js@gmail.com')
        .click(registrationPasswordInput)
        .typeText(registrationPasswordInput, 'js')
        .click(submitRegisterButton)

        //exepct to be on home page
        .expect(Selector('.navbar-brand').innerText).eql('TM');
});

//test with duplicate email
test('Register with existing email', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('.register-error-container').innerText).eql('Email already in use');
});

//submit with missing first name
test('Register with first name input missing', async t => {
  await t
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit with first name as spaces
test('Register with first name input as spaces', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, '      ')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('.register-error-container').innerText).eql('Please fill out everything');
});

//submit with missing last name
test('Register with last name input missing', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit with first name as spaces
test('Register with last name input as spaces', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, '       ')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('.register-error-container').innerText).eql('Please fill out everything');
});


//submit with missing email
test('Register with email input missing', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit incorrect email format
test('Register with incorrect email format', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit with email as spaces
test('Register with email input as spaces', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, '         ')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, 'js')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit with missing password
test('Register with password input missing', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(submitRegisterButton)

  .expect(Selector('#btn-submitRegister').exists).ok();
});

//submit with password as spaces
test('Register with password input as spaces', async t => {
  await t
  .click(firstNameInput)
  .typeText(firstNameInput, 'John')
  .click(lastNameInput)
  .typeText(lastNameInput, 'Smith')
  .click(registrationEmailInput)
  .typeText(registrationEmailInput, 'js@gmail.com')
  .click(registrationPasswordInput)
  .typeText(registrationPasswordInput, '            ')
  .click(submitRegisterButton)

  .expect(Selector('.register-error-container').innerText).eql('Please fill out everything');
});


test('Login with registered user', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, 'a@a.com') //demo@demo.com
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, 'a') //demo
      .click(submitLoginButton)

      //exepct to be on home page
      .expect(Selector('.navbar-brand').innerText).eql('TM');
});

//submit with email and password not matching
test('Login with email and password not matching', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, 'a@a.com') //demo@demo.com
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, 'b') //demo
      .click(submitLoginButton)

      .expect(Selector('.login-error-container').innerText).eql('Incorrect Username or Password');
});

//submit with missing email
test('Login with email missing', async t => {
    await t
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, 'a') //demo
      .click(submitLoginButton)

      .expect(Selector('#btn-submitLogin').exists).ok();
});

//submit with email as spaces
test('Login with email input as spaces', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, '     ')
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, 'a') //demo
      .click(submitLoginButton)

      .expect(Selector('#btn-submitLogin').exists).ok();
});

//submit with missing password
test('Login with password missing', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, 'a@a.com')
      .click(submitLoginButton)

      .expect(Selector('#btn-submitLogin').exists).ok();
});

//submit with password as spaces
test('Login with password input as spaces', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, 'a@a.com')
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, '      ')
      .click(submitLoginButton)

      .expect(Selector('.login-error-container').innerText).eql('Please fill out everything');
});
