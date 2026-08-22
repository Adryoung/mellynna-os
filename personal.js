// =====================================
// PERSONAL DATA
// =====================================

let personalTasks =
    JSON.parse(
        localStorage.getItem(
            'mellynnaPersonalTasksV2'
        )
    ) || [];


// =====================================
// EDIT MODE
// =====================================

let editingPersonalTaskIndex = null;


// =====================================
// ELEMENTS
// =====================================

const showPersonalForm =
    document.getElementById(
        'show-personal-form'
    );

const personalForm =
    document.getElementById(
        'personal-form'
    );

const personalFormTitle =
    document.getElementById(
        'personal-form-title'
    );

const personalTaskName =
    document.getElementById(
        'personal-task-name'
    );

const personalTaskDate =
    document.getElementById(
        'personal-task-date'
    );

const personalTaskCategory =
    document.getElementById(
        'personal-task-category'
    );

const personalTaskNotes =
    document.getElementById(
        'personal-task-notes'
    );

const cancelPersonalTask =
    document.getElementById(
        'cancel-personal-task'
    );

const savePersonalTaskButton =
    document.getElementById(
        'save-personal-task'
    );

const personalTaskList =
    document.getElementById(
        'personal-task-list'
    );

const personalTaskCount =
    document.getElementById(
        'personal-task-count'
    );

const personalOpenCount =
    document.getElementById(
        'personal-open-count'
    );

const personalCompletedCount =
    document.getElementById(
        'personal-completed-count'
    );

const personalTodayCount =
    document.getElementById(
        'personal-today-count'
    );


// =====================================
// GET TODAY
// =====================================

function getTodayDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            '0'
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            '0'
        );


    return (
        year +
        '-' +
        month +
        '-' +
        day
    );

}


// =====================================
// FORMAT DATE
// =====================================

function formatTaskDate(dateString) {

    if (!dateString) {
        return '';
    }

    const parts =
        dateString.split('-');

    if (parts.length !== 3) {
        return dateString;
    }

    return (
        parts[2] +
        '/' +
        parts[1] +
        '/' +
        parts[0]
    );

}


// =====================================
// SAVE PERSONAL TASKS
// =====================================

function savePersonalTasks() {

    localStorage.setItem(
        'mellynnaPersonalTasksV2',
        JSON.stringify(
            personalTasks
        )
    );

}


// =====================================
// RESET FORM
// =====================================

function resetPersonalForm() {

    personalTaskName.value = '';

    personalTaskDate.value = '';

    personalTaskCategory.value =
        'Home';

    personalTaskNotes.value = '';

    editingPersonalTaskIndex = null;

    personalFormTitle.textContent =
        'Add Personal Task';

    savePersonalTaskButton.textContent =
        'Add Task';

}


// =====================================
// UPDATE COUNTERS
// =====================================

function updatePersonalCounters() {

    const today =
        getTodayDate();


    const openTasks =
        personalTasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    const completedTasks =
        personalTasks.filter(
            function (task) {

                return task.completed;

            }
        );


    const todayTasks =
        personalTasks.filter(
            function (task) {

                return (
                    !task.completed &&
                    task.date === today
                );

            }
        );


    personalOpenCount.textContent =
        openTasks.length;


    personalCompletedCount.textContent =
        completedTasks.length;


    personalTodayCount.textContent =
        todayTasks.length;


    if (openTasks.length === 1) {

        personalTaskCount.textContent =
            '1 Task';

    } else {

        personalTaskCount.textContent =
            openTasks.length +
            ' Tasks';

    }

}


// =====================================
// CATEGORY CLASS
// =====================================

function getCategoryClass(
    category
) {

    if (category === 'Home') {
        return 'category-home';
    }

    if (category === 'Errands') {
        return 'category-errands';
    }

    if (category === 'Self') {
        return 'category-self';
    }

    if (
        category ===
        'Family / Friends'
    ) {
        return 'category-family-friends';
    }

    return 'category-other';

}


// =====================================
// CHECK OVERDUE
// =====================================

function isPersonalTaskOverdue(task) {

    if (
        !task.date ||
        task.completed
    ) {
        return false;
    }

    return (
        task.date <
        getTodayDate()
    );

}


// =====================================
// SORT TASKS
// =====================================

function sortPersonalTasks() {

    personalTasks.sort(
        function (a, b) {

            // Completed tasks at bottom
            if (
                a.completed !==
                b.completed
            ) {

                return (
                    a.completed
                        ? 1
                        : -1
                );

            }


            // No date at bottom
            if (
                !a.date &&
                b.date
            ) {
                return 1;
            }

            if (
                a.date &&
                !b.date
            ) {
                return -1;
            }

            if (
                !a.date &&
                !b.date
            ) {
                return 0;
            }


            // Earlier date first
            return (
                a.date.localeCompare(
                    b.date
                )
            );

        }
    );

}


// =====================================
// RENDER PERSONAL TASKS
// =====================================

function renderPersonalTasks() {

    personalTaskList.innerHTML = '';


    sortPersonalTasks();

    updatePersonalCounters();


    // EMPTY STATE

    if (
        personalTasks.length === 0
    ) {

        const emptyState =
            document.createElement(
                'div'
            );

        emptyState.className =
            'empty-state';

        emptyState.innerHTML = `
            <h3>No personal tasks yet</h3>

            <p>
                Click + Add Personal Task to create your first task.
            </p>
        `;

        personalTaskList.appendChild(
            emptyState
        );

        return;

    }


    personalTasks.forEach(
        function (task, index) {

            const taskItem =
                document.createElement(
                    'div'
                );

            taskItem.className =
                'task-item';


            if (task.completed) {

                taskItem.classList.add(
                    'completed'
                );

            }


            const today =
                getTodayDate();


            const dueToday =
                (
                    !task.completed &&
                    task.date === today
                );


            const overdue =
                isPersonalTaskOverdue(
                    task
                );


            const displayDate =
                formatTaskDate(
                    task.date
                );


            const categoryClass =
                getCategoryClass(
                    task.category
                );


            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    ${task.completed ? 'checked' : ''}
                >


                <div class="task-details">

                    <h3>
                        ${task.name}
                    </h3>


                    <div class="task-meta">

                        <span
                            class="badge ${categoryClass}"
                        >
                            ${task.category}
                        </span>


                        ${
                            displayDate
                                ? `
                                    <span>
                                        Due ${displayDate}
                                    </span>
                                `
                                : `
                                    <span>
                                        No due date
                                    </span>
                                `
                        }


                        ${
                            dueToday
                                ? `
                                    <span class="badge due-today">
                                        Due Today
                                    </span>
                                `
                                : ''
                        }


                        ${
                            overdue
                                ? `
                                    <span class="badge overdue-badge">
                                        Overdue
                                    </span>
                                `
                                : ''
                        }

                    </div>


                    ${
                        task.notes
                            ? `
                                <p class="task-notes">
                                    ${task.notes}
                                </p>
                            `
                            : ''
                    }

                </div>


                <div class="task-actions">

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


            // CHECKBOX

            const checkbox =
                taskItem.querySelector(
                    'input[type="checkbox"]'
                );


            checkbox.addEventListener(
                'change',
                function () {

                    personalTasks[
                        index
                    ].completed =
                        checkbox.checked;


                    savePersonalTasks();

                    renderPersonalTasks();

                }
            );


            // EDIT

            const editButton =
                taskItem.querySelector(
                    '.edit-button'
                );


            editButton.addEventListener(
                'click',
                function () {

                    editingPersonalTaskIndex =
                        index;


                    personalTaskName.value =
                        task.name;


                    personalTaskDate.value =
                        task.date || '';


                    personalTaskCategory.value =
                        task.category ||
                        'Other';


                    personalTaskNotes.value =
                        task.notes || '';


                    personalFormTitle.textContent =
                        'Edit Personal Task';


                    savePersonalTaskButton.textContent =
                        'Save Changes';


                    personalForm.classList.remove(
                        'hidden'
                    );


                    personalForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });


                    personalTaskName.focus();

                }
            );


            // DELETE

            const deleteButton =
                taskItem.querySelector(
                    '.delete-button'
                );


            deleteButton.addEventListener(
                'click',
                function () {

                    const confirmDelete =
                        confirm(
                            'Delete "' +
                            task.name +
                            '"?'
                        );


                    if (!confirmDelete) {
                        return;
                    }


                    personalTasks.splice(
                        index,
                        1
                    );


                    savePersonalTasks();

                    renderPersonalTasks();

                }
            );


            personalTaskList.appendChild(
                taskItem
            );

        }
    );

}


// =====================================
// SHOW FORM
// =====================================

showPersonalForm.addEventListener(
    'click',
    function () {

        resetPersonalForm();

        personalForm.classList.remove(
            'hidden'
        );

        personalTaskName.focus();

    }
);


// =====================================
// CANCEL FORM
// =====================================

cancelPersonalTask.addEventListener(
    'click',
    function () {

        resetPersonalForm();

        personalForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// ADD / EDIT PERSONAL TASK
// =====================================

savePersonalTaskButton.addEventListener(
    'click',
    function () {

        const name =
            personalTaskName
                .value
                .trim();


        const date =
            personalTaskDate.value;


        const category =
            personalTaskCategory.value;


        const notes =
            personalTaskNotes
                .value
                .trim();


        if (name === '') {

            alert(
                'Please enter a task name.'
            );

            personalTaskName.focus();

            return;

        }


        // ADD

        if (
            editingPersonalTaskIndex ===
            null
        ) {

            const newTask = {

                id:
                    Date.now(),

                name:
                    name,

                date:
                    date,

                category:
                    category,

                notes:
                    notes,

                completed:
                    false,

                createdAt:
                    new Date()
                        .toISOString()

            };


            personalTasks.push(
                newTask
            );

        }


        // EDIT

        else {

            const currentTask =
                personalTasks[
                    editingPersonalTaskIndex
                ];


            personalTasks[
                editingPersonalTaskIndex
            ] = {

                ...currentTask,

                name:
                    name,

                date:
                    date,

                category:
                    category,

                notes:
                    notes

            };

        }


        savePersonalTasks();

        renderPersonalTasks();

        resetPersonalForm();

        personalForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// START PERSONAL PAGE
// =====================================

renderPersonalTasks();