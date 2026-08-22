// =====================================
// EXPENSE DATA
// =====================================

let expenses =
    JSON.parse(
        localStorage.getItem(
            'mellynnaExpensesV2'
        )
    ) || [];


// =====================================
// EDIT MODE
// =====================================

let editingExpenseIndex = null;


// =====================================
// ELEMENTS
// =====================================

const showExpenseForm =
    document.getElementById(
        'show-expense-form'
    );

const expenseForm =
    document.getElementById(
        'expense-form'
    );

const expenseFormTitle =
    document.getElementById(
        'expense-form-title'
    );

const expenseName =
    document.getElementById(
        'expense-name'
    );

const expenseAmount =
    document.getElementById(
        'expense-amount'
    );

const expenseDate =
    document.getElementById(
        'expense-date'
    );

const expenseCategory =
    document.getElementById(
        'expense-category'
    );

const expenseNotes =
    document.getElementById(
        'expense-notes'
    );

const cancelExpense =
    document.getElementById(
        'cancel-expense'
    );

const saveExpenseButton =
    document.getElementById(
        'save-expense'
    );

const expenseList =
    document.getElementById(
        'expense-list'
    );

const expenseListCount =
    document.getElementById(
        'expense-list-count'
    );

const monthlyExpenseTotal =
    document.getElementById(
        'monthly-expense-total'
    );

const todayExpenseTotal =
    document.getElementById(
        'today-expense-total'
    );

const expenseTransactionCount =
    document.getElementById(
        'expense-transaction-count'
    );

const categoryGroceryTotal =
    document.getElementById(
        'category-grocery-total'
    );

const categoryFoodTotal =
    document.getElementById(
        'category-food-total'
    );

const categoryTransportTotal =
    document.getElementById(
        'category-transport-total'
    );

const categoryBillsTotal =
    document.getElementById(
        'category-bills-total'
    );


// =====================================
// DATE HELPERS
// =====================================

function getTodayDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, '0');

    const day =
        String(
            now.getDate()
        ).padStart(2, '0');

    return (
        year +
        '-' +
        month +
        '-' +
        day
    );

}


function formatExpenseDate(
    dateString
) {

    if (!dateString) {
        return '';
    }

    const parts =
        dateString.split('-');

    return (
        parts[2] +
        '/' +
        parts[1] +
        '/' +
        parts[0]
    );

}


// =====================================
// MONEY
// =====================================

function formatMoney(amount) {

    return (
        'RM ' +
        Number(
            amount || 0
        ).toFixed(2)
    );

}


// =====================================
// SAVE
// =====================================

function saveExpenses() {

    localStorage.setItem(
        'mellynnaExpensesV2',
        JSON.stringify(
            expenses
        )
    );

}


// =====================================
// RESET FORM
// =====================================

function resetExpenseForm() {

    expenseName.value = '';

    expenseAmount.value = '';

    expenseDate.value =
        getTodayDate();

    expenseCategory.value =
        'Grocery';

    expenseNotes.value = '';

    editingExpenseIndex = null;

    expenseFormTitle.textContent =
        'Add Expense';

    saveExpenseButton.textContent =
        'Save Expense';

}


// =====================================
// CATEGORY CLASS
// =====================================

function getExpenseCategoryClass(
    category
) {

    if (category === 'Grocery') {
        return 'category-grocery';
    }

    if (category === 'Food') {
        return 'category-food';
    }

    if (category === 'Transport') {
        return 'category-transport';
    }

    if (category === 'Bills') {
        return 'category-bills';
    }

    if (category === 'Shopping') {
        return 'category-shopping';
    }

    if (
        category ===
        'Entertainment'
    ) {
        return 'category-entertainment';
    }

    return 'category-other';

}


// =====================================
// UPDATE SUMMARY
// =====================================

function updateExpenseSummary() {

    const today =
        getTodayDate();

    const now =
        new Date();

    const currentYear =
        now.getFullYear();

    const currentMonth =
        now.getMonth();


    let monthlyTotal = 0;

    let todayTotal = 0;

    let groceryTotal = 0;

    let foodTotal = 0;

    let transportTotal = 0;

    let billsTotal = 0;


    expenses.forEach(
        function (expense) {

            const amount =
                Number(
                    expense.amount || 0
                );


            if (expense.date) {

                const date =
                    new Date(
                        expense.date +
                        'T00:00:00'
                    );


                const isThisMonth =
                    (
                        date.getFullYear() ===
                            currentYear &&
                        date.getMonth() ===
                            currentMonth
                    );


                if (isThisMonth) {

                    monthlyTotal +=
                        amount;


                    if (
                        expense.category ===
                        'Grocery'
                    ) {

                        groceryTotal +=
                            amount;

                    }


                    if (
                        expense.category ===
                        'Food'
                    ) {

                        foodTotal +=
                            amount;

                    }


                    if (
                        expense.category ===
                        'Transport'
                    ) {

                        transportTotal +=
                            amount;

                    }


                    if (
                        expense.category ===
                        'Bills'
                    ) {

                        billsTotal +=
                            amount;

                    }

                }

            }


            if (
                expense.date === today
            ) {

                todayTotal +=
                    amount;

            }

        }
    );


    monthlyExpenseTotal.textContent =
        formatMoney(
            monthlyTotal
        );


    todayExpenseTotal.textContent =
        formatMoney(
            todayTotal
        );


    expenseTransactionCount.textContent =
        expenses.length;


    categoryGroceryTotal.textContent =
        formatMoney(
            groceryTotal
        );


    categoryFoodTotal.textContent =
        formatMoney(
            foodTotal
        );


    categoryTransportTotal.textContent =
        formatMoney(
            transportTotal
        );


    categoryBillsTotal.textContent =
        formatMoney(
            billsTotal
        );


    expenseListCount.textContent =
        expenses.length +
        (
            expenses.length === 1
                ? ' Entry'
                : ' Entries'
        );

}


// =====================================
// SORT
// =====================================

function sortExpenses() {

    expenses.sort(
        function (a, b) {

            return (
                b.date || ''
            ).localeCompare(
                a.date || ''
            );

        }
    );

}


// =====================================
// RENDER EXPENSES
// =====================================

function renderExpenses() {

    expenseList.innerHTML = '';


    sortExpenses();

    updateExpenseSummary();


    if (
        expenses.length === 0
    ) {

        const empty =
            document.createElement(
                'div'
            );


        empty.className =
            'empty-state';


        empty.innerHTML = `
            <h3>
                No expenses yet
            </h3>

            <p>
                Click + Add Expense to start tracking your spending.
            </p>
        `;


        expenseList.appendChild(
            empty
        );


        return;

    }


    expenses.forEach(
        function (
            expense,
            index
        ) {

            const row =
                document.createElement(
                    'div'
                );


            row.className =
                'expense-item';


            const categoryClass =
                getExpenseCategoryClass(
                    expense.category
                );


            row.innerHTML = `

                <div class="expense-details">

                    <h3>
                        ${expense.name}
                    </h3>


                    <div class="expense-meta">

                        <span
                            class="badge ${categoryClass}"
                        >
                            ${expense.category}
                        </span>

                        <span>
                            ${formatExpenseDate(
                                expense.date
                            )}
                        </span>

                    </div>


                    ${
                        expense.notes
                            ? `
                                <p class="expense-notes">
                                    ${expense.notes}
                                </p>
                            `
                            : ''
                    }

                </div>


                <div class="expense-amount">
                    ${formatMoney(
                        expense.amount
                    )}
                </div>


                <div class="expense-actions">

                    <button
                        type="button"
                        class="edit-button"
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        class="delete-button"
                    >
                        Delete
                    </button>

                </div>

            `;


            // EDIT

            row
                .querySelector(
                    '.edit-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        editingExpenseIndex =
                            index;


                        expenseName.value =
                            expense.name;


                        expenseAmount.value =
                            expense.amount;


                        expenseDate.value =
                            expense.date;


                        expenseCategory.value =
                            expense.category;


                        expenseNotes.value =
                            expense.notes || '';


                        expenseFormTitle.textContent =
                            'Edit Expense';


                        saveExpenseButton.textContent =
                            'Save Changes';


                        expenseForm.classList.remove(
                            'hidden'
                        );


                        expenseForm.scrollIntoView({
                            behavior:
                                'smooth'
                        });

                    }
                );


            // DELETE

            row
                .querySelector(
                    '.delete-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        const confirmDelete =
                            confirm(
                                'Delete "' +
                                expense.name +
                                '"?'
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        expenses.splice(
                            index,
                            1
                        );


                        saveExpenses();

                        renderExpenses();

                    }
                );


            expenseList.appendChild(
                row
            );

        }
    );

}


// =====================================
// SHOW FORM
// =====================================

showExpenseForm.addEventListener(
    'click',
    function () {

        resetExpenseForm();


        expenseForm.classList.remove(
            'hidden'
        );


        expenseName.focus();

    }
);


// =====================================
// CANCEL
// =====================================

cancelExpense.addEventListener(
    'click',
    function () {

        resetExpenseForm();


        expenseForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// ADD / EDIT
// =====================================

saveExpenseButton.addEventListener(
    'click',
    function () {

        const name =
            expenseName
                .value
                .trim();


        const amount =
            Number(
                expenseAmount.value
            );


        const date =
            expenseDate.value;


        const category =
            expenseCategory.value;


        const notes =
            expenseNotes
                .value
                .trim();


        if (
            name === ''
        ) {

            alert(
                'Please enter an expense name.'
            );

            expenseName.focus();

            return;

        }


        if (
            !amount ||
            amount <= 0
        ) {

            alert(
                'Please enter a valid amount.'
            );

            expenseAmount.focus();

            return;

        }


        if (
            date === ''
        ) {

            alert(
                'Please select a date.'
            );

            return;

        }


        if (
            editingExpenseIndex ===
            null
        ) {

            expenses.push({

                id:
                    Date.now(),

                name:
                    name,

                amount:
                    amount,

                date:
                    date,

                category:
                    category,

                notes:
                    notes,

                createdAt:
                    new Date()
                        .toISOString()

            });

        } else {

            const currentExpense =
                expenses[
                    editingExpenseIndex
                ];


            expenses[
                editingExpenseIndex
            ] = {

                ...currentExpense,

                name:
                    name,

                amount:
                    amount,

                date:
                    date,

                category:
                    category,

                notes:
                    notes

            };

        }


        saveExpenses();

        renderExpenses();

        resetExpenseForm();

        expenseForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// START
// =====================================

renderExpenses();