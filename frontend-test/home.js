var testcafe = require('testcafe');
var Selector = testcafe.Selector;
var Role = testcafe.Role;

const loginEmailInput = Selector('#loginUser-form input[name="email"]');
const loginPasswordInput = Selector('#loginUser-form input[name="password"]');
const submitLoginButton = Selector('#btn-submitLogin');

const accUser = Role('localhost:3000/auth', async t => {
    await t
      .click(loginEmailInput)
      .typeText(loginEmailInput, 'demo@demo.com')
      .click(loginPasswordInput)
      .typeText(loginPasswordInput, 'demo')
      .click(submitLoginButton)
}, { preserveUrl: true });

fixture `Home Page`// declare the fixture
    .page `localhost:3000/home`  // specify the start page
    .beforeEach(async t => {
    		await t
          .useRole(accUser);
    	});


const createBoardButton = Selector('#createBoard');
const addBoardModal = Selector('#addBoardModal');
const addBoardFormInput = Selector('#addBoardTitle-form input[name="boardTitle"]');
const addBoardSubmitButton = Selector('#btn-submitAddBoardPage');

const editBoardModal = Selector('#editBoardModal');
const editBoardFormInput = Selector('#editBoardTitle-form input[name="boardTitle"]');
const editBoardSubmitButton = Selector('#btn-submitEditBoardPage');


//user creates board with same title (duplicate error)
test('User adds a new board but title already exists', async t => {
    await t
        .expect(Selector('.navbar-brand').innerText).eql('TM')
        .click(createBoardButton)
        .expect(addBoardModal.visible).ok()
        .click(addBoardFormInput)
        .typeText(addBoardFormInput, "TestCafe Board")
        .click(addBoardSubmitButton)
        .expect(Selector('.addBoardModal-error-container').visible).ok()
        .expect(Selector('.addBoardModal-error-container').innerText).eql("Board Name (TestCafe Board) already exists. Enter another");
});

//user successfully creates a new board
test('User creates a new board', async t => {
    await t
        .expect(Selector('.navbar-brand').innerText).eql('TM')
        .click(createBoardButton)
        .expect(addBoardModal.visible).ok()
        .click(addBoardFormInput)
        .typeText(addBoardFormInput, "New Board")
        .click(addBoardSubmitButton)
        .expect(Selector('#board2').innerText).eql('New Board');
});

//user enters spaces for board title
test('User creates a new board with empty spaces', async t => {
    await t
        .expect(Selector('.navbar-brand').innerText).eql('TM')
        .click(createBoardButton)
        .expect(addBoardModal.visible).ok()
        .click(addBoardFormInput)
        .typeText(addBoardFormInput, "          ")
        .click(addBoardSubmitButton)
        .expect(Selector('.addBoardModal-error-container').visible).ok()
        .expect(Selector('.addBoardModal-error-container').innerText).eql("Please do not leave it empty");
});

//user creates a new board but clicks X
test('User clicks X when creating a board', async t => {
    await t
        .expect(Selector('.navbar-brand').innerText).eql('TM')
        .click(createBoardButton)
        .expect(addBoardModal.visible).ok()
        .click(Selector('#addBoardModal .close'))
        .expect(addBoardModal.visible).notOk();
});


//user creates a new board but clicks cancels
test('User clicks cancles when creating a board', async t => {
    await t
        .expect(Selector('.navbar-brand').innerText).eql('TM')
        .click(createBoardButton)
        .expect(addBoardModal.visible).ok()
        .click(Selector('#btn-cancelAddBoardPage'))
        .expect(addBoardModal.visible).notOk();
});

//user clicks on existing board
test('User clicks on existing board', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#board1'))
      .expect(Selector('#boardPageName').innerText).eql('TestCafe Board');
});

//user cancels edit board name
test('User cancels edit board name', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#editButton1'))
      .expect(editBoardModal.visible).ok()
      .click(Selector('#btn-cancelEditBoardPage'))
      .expect(editBoardModal.visible).notOk()
      .expect(Selector('#board1').innerText).eql("TestCafe Board")
});

//user edits a board name
test('User edits a board name', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#editButton1'))
      .expect(editBoardModal.visible).ok()
      .click(editBoardFormInput)
      .pressKey('ctrl+a delete')
      .typeText(editBoardFormInput, "Testing")
      .click(editBoardSubmitButton)
      .expect(editBoardModal.visible).notOk()
      .expect(Selector('#board1').innerText).eql("Testing")
});

//user edits a board name (duplicate name error)
test('User edits a board name but it already exists', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#editButton1'))
      .expect(editBoardModal.visible).ok()
      .click(editBoardFormInput)
      .pressKey('ctrl+a delete')
      .typeText(editBoardFormInput, "Testing")
      .click(editBoardSubmitButton)
      .expect(Selector('.editBoardModal-error-container').visible).ok()
      .expect(Selector('.editBoardModal-error-container').innerText).eql("Board Name (Testing) already exists. Enter another");
});

//user enters empty spaces for editing a board title
test('User edits board name with empty spaces', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#editButton1'))
      .expect(editBoardModal.visible).ok()
      .click(editBoardFormInput)
      .pressKey('ctrl+a delete')
      .typeText(editBoardFormInput, "          ")
      .click(editBoardSubmitButton)
      .expect(Selector('.editBoardModal-error-container').visible).ok()
      .expect(Selector('.editBoardModal-error-container').innerText).eql("Please do not leave it empty");
});

//user deletes a board
test('User deletes a board', async t => {
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#deleteButton1'))
      .expect(Selector('#deleteBoardModal').visible).ok()
      .click(Selector('#btn-deleteBoard'))
      .expect(Selector('#deleteBoardModal').visible).notOk()
      .expect(Selector('deleteButton1').exists).notOk();
});

//logout user
test('User logouts', async t =>{
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('.ml-auto .nav-link'))
      .expect(Selector('#btn-submitRegister').exists).ok();

});
