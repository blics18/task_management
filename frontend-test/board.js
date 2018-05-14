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
      .click(Selector('#board1'))
}, { preserveUrl: true });

fixture `Board Page`// declare the fixture
    .page `localhost:3000/board/TestCafe%20Board/board-id/1`  // specify the start page
    .beforeEach(async t => {
    		await t
          .useRole(accUser);
    	});

const addCategoryButton = Selector('#addCategory');
const addCategoryModal = Selector('#addCategoryModal');
const addCategoryFormInput = Selector('#addCategoryTitle-form input[name="categoryTitle"]');
const addCategorySubmitButton = Selector('#btn-submitAddCategoryPage');
const editCategoryModal = Selector('#editCategoryModal');
const editCategoryFormInput = Selector('#editCategoryTitle-form input[name="categoryTitle"]');
const editCategorySubmitButton = Selector('#btn-submitEditCategoryPage');
const addTaskFormInput = Selector('#addTask-form input[name="taskDescription"]');
const addTaskSubmitButton = Selector('#btn-submitAddTaskPage');

test('User adds a new category', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(addCategoryButton)
        .expect(addCategoryModal.visible).ok()
        .click(addCategoryFormInput)
        .typeText(addCategoryFormInput, "TestCafe")
        .click(addCategorySubmitButton)
        .expect(addCategoryModal.visible).notOk()
        .expect(Selector('#categoryId1').innerText).eql("TestCafe");
});

//adding a category that already exists (duplicate error)
test('User adds a new category but it already exists', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(addCategoryButton)
        .expect(addCategoryModal.visible).ok()
        .click(addCategoryFormInput)
        .typeText(addCategoryFormInput, "TestCafe")
        .click(addCategorySubmitButton)
        .expect(Selector('.addCategoryModal-error-container').visible).ok()
        .expect(Selector('.addCategoryModal-error-container').innerText).eql("Category Name (TestCafe) already exists. Enter another");
});

//empty spaces as new category
test('User enters empty spaces for new category', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(addCategoryButton)
        .expect(addCategoryModal.visible).ok()
        .click(addCategoryFormInput)
        .typeText(addCategoryFormInput, "         ")
        .click(addCategorySubmitButton)
        .expect(Selector('.addCategoryModal-error-container').visible).ok()
        .expect(Selector('.addCategoryModal-error-container').innerText).eql("Please do not leave it empty");
});

//cancel adding a new category
test('User decides to cancel adding a new category by clicking cancel', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(addCategoryButton)
        .expect(addCategoryModal.visible).ok()
        .expect(Selector('.addCategoryModal-error-container').visible).notOk()
        .click(Selector('#btn-cancelAddCategoryPage'))
        .expect(addCategoryModal.visible).notOk();
});

//edit category
test('User edits category title', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(Selector('#editButton1'))
        .expect(editCategoryModal.visible).ok()
        .expect(Selector('.editCategoryModal-error-container').visible).notOk()
        .click(editCategoryFormInput)
        .pressKey('ctrl+a delete')
        .typeText(editCategoryFormInput, "Cafe")
        .click(editCategorySubmitButton)
        .expect(editCategoryModal.visible).notOk()
        .expect(Selector('#categoryId1').innerText).eql("Cafe");
});

//edit category title with spaces
test('User edits category title with only spaces which is invalid', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(Selector('#editButton1'))
        .expect(editCategoryModal.visible).ok()
        .expect(Selector('.editCategoryModal-error-container').visible).notOk()
        .click(editCategoryFormInput)
        .pressKey('ctrl+a delete')
        .typeText(editCategoryFormInput, "           ")
        .click(editCategorySubmitButton)
        .expect(Selector('.editCategoryModal-error-container').visible).ok()
        .expect(Selector('.editCategoryModal-error-container').innerText).eql("Please do not leave it empty")
        .expect(Selector('#categoryId1').innerText).eql("Cafe");
});

//edit category with existing title
test('User edits category title that already exists', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(Selector('#editButton1'))
        .expect(editCategoryModal.visible).ok()
        .expect(Selector('.editCategoryModal-error-container').visible).notOk()
        .click(editCategoryFormInput)
        .pressKey('ctrl+a delete')
        .typeText(editCategoryFormInput, "Cafe")
        .click(editCategorySubmitButton)
        .expect(Selector('.editCategoryModal-error-container').visible).ok()
        .expect(Selector('.editCategoryModal-error-container').innerText).eql("Category Name (Cafe) already exists. Enter another")
        .expect(Selector('#categoryId1').innerText).eql("Cafe");
});

//cancel edit category
test('User cancels editing category title', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(Selector('#editButton1'))
        .expect(editCategoryModal.visible).ok()
        .expect(Selector('.editCategoryModal-error-container').visible).notOk()
        .click(Selector('#btn-cancelEditCategoryPage'))
        .expect(Selector('#categoryId1').innerText).eql("Cafe");
});

//add new task with spaces
test('User enters spaces as a new task', async t => {
  await t
    .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
    .click(Selector('#addTaskButton1'))
    .expect(Selector('#addTaskModal').visible).ok()
    .expect(Selector('.addTaskModal-error-container').visible).notOk()
    .click(addTaskFormInput)
    .typeText(addTaskFormInput, "        ")
    .click(addTaskSubmitButton)
    .expect(Selector('.addTaskModal-error-container').visible).ok()
    .expect(Selector('.addTaskModal-error-container').innerText).eql("Please do not leave it empty")
});

//add new task
test('User adds a new task under a category', async t => {
    await t
      .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
      .click(Selector('#addTaskButton1'))
      .expect(Selector('#addTaskModal').visible).ok()
      .expect(Selector('.addTaskModal-error-container').visible).notOk()
      .click(addTaskFormInput)
      .typeText(addTaskFormInput, "Cafe Task 1")
      .click(addTaskSubmitButton)
      .expect(Selector('#addTaskModal').visible).notOk()
      .expect(Selector('#sortable1 #1').visible).ok();
});

//cancel add task
test('User cancels adding a task', async t => {
    await t
      .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
      .click(Selector('#addTaskButton1'))
      .expect(Selector('#addTaskModal').visible).ok()
      .expect(Selector('.addTaskModal-error-container').visible).notOk()
      .click(Selector('#btn-cancelAddTaskPage'))
      .expect(Selector('#addTaskModal').visible).notOk();
});

//drag task to a different category
test('User drags a task to a different category', async t => {
    await t
      .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
      .click(addCategoryButton)
      .expect(addCategoryModal.visible).ok()
      .click(addCategoryFormInput)
      .typeText(addCategoryFormInput, "Coffee")
      .click(addCategorySubmitButton)
      .expect(addCategoryModal.visible).notOk()
      .expect(Selector('#categoryId2').innerText).eql("Coffee")

      .click(Selector('#addTaskButton1'))
      .expect(Selector('#addTaskModal').visible).ok()
      .expect(Selector('.addTaskModal-error-container').visible).notOk()
      .click(addTaskFormInput)
      .typeText(addTaskFormInput, "Cafe Task 2")
      .click(addTaskSubmitButton)
      .expect(Selector('#addTaskModal').visible).notOk()
      .expect(Selector('#sortable1 #2').visible).ok()

      .click(Selector('#addTaskButton2'))
      .expect(Selector('#addTaskModal').visible).ok()
      .expect(Selector('.addTaskModal-error-container').visible).notOk()
      .click(addTaskFormInput)
      .typeText(addTaskFormInput, "Coffee Task 1")
      .click(addTaskSubmitButton)
      .expect(Selector('#addTaskModal').visible).notOk()
      .expect(Selector('#sortable2 #3').visible).ok()

      .click(Selector('#addTaskButton2'))
      .expect(Selector('#addTaskModal').visible).ok()
      .expect(Selector('.addTaskModal-error-container').visible).notOk()
      .click(addTaskFormInput)
      .typeText(addTaskFormInput, "Coffee Task 2")
      .click(addTaskSubmitButton)
      .expect(Selector('#addTaskModal').visible).notOk()
      .expect(Selector('#sortable2 #4').visible).ok()

      .dragToElement('#sortable1 #2', '#sortable2')
      .expect(Selector('#sortable2 .list-group-item').count).eql(3)
      .expect(Selector('#sortable1 .list-group-item').count).eql(1);
});

//delete task
test('User deletes a task under a category', async t => {
    await t
      .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
      .click(Selector('#sortable1 #deleteTask1'))
      .expect(Selector('#sortable1 #1').exits).notOk();
})

//delete category
test('User deletes category', async t => {
    await t
        .expect(Selector('#boardPageName').innerText).eql('TestCafe Board')
        .click(Selector('#deleteButton1'))
        .expect(Selector('#deleteCategoryModal').visible).ok()
        .click(Selector('#btn-deleteCategory'))
        .expect(Selector('#categoryId1').exists).notOk()
        .expect(Selector('#categoryId2').exists).ok();
});

//test home
test('User goes back to home page', async t =>{
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('#home'))
      .expect(Selector('#board1').exists).ok();

});

//logout
test('User logouts', async t =>{
    await t
      .expect(Selector('.navbar-brand').innerText).eql('TM')
      .click(Selector('.ml-auto .nav-link'))
      .expect(Selector('#btn-submitRegister').exists).ok();

});
