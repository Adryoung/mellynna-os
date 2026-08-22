// ==========================================
// MELLYNNA OS - WORK TASKS WITH SUPABASE
// ==========================================

let workTasks = [];
let editingTaskId = null;


// ==========================================
// ELEMENTS
// ==========================================

const showWorkForm =
    document.getElementById("show-work-form");

const workForm =
    document.getElementById("work-form");

const workFormTitle =
    document.getElementById("work-form-title");

const workTaskName =
    document.getElementById("work-task-name");

const workTaskDate =
    document.getElementById("work-task-date");

const workTaskNotes =
    document.getElementById("work-task-notes");

const cancelWorkTask =
    document.getElementById("cancel-work-task");

const saveWorkTaskButton =
    document.getElementById("save-work-task");

const workTaskList =
    document.getElementById("work-task-list");

const workTaskCount =
    document.getElementById("work-task-count");

const workOpenCount =
    document.getElementById("work-open-count");

const workCompletedCount =
    document.getElementById("work-completed-count");

const workTodayCount =
    document.getElementById("work-today-count");


// ==========================================
// DEBUG CHECK
// ==========================================

console.log("WORK.JS LOADED");


// ==========================================
// GET CURRENT USER
// ==========================================

async function getCurrentUser() {

    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {

        console.error(
            "User error:",
            error
        );

        return null;
    }

    console.log(
        "CURRENT USER:",
        user
    );

    return user;
}


// ==========================================
// TODAY DATE
// ==========================================

function getTodayDate() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            now.getDate()
        ).padStart(
            2,
            "0"
        );

    return `${year}-${month}-${day}`;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatTaskDate(
    dateString
) {

    if (!dateString) {
        return "";
    }

    const parts =
        dateString.split("-");

    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );
}


// ==========================================
// LOAD TASKS FROM SUPABASE
// ==========================================

async function loadWorkTasks() {

    console.log(
        "LOADING WORK TASKS..."
    );

    const user =
        await getCurrentUser();

    if (!user) {

        console.log(
            "NO USER FOUND"
        );

        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from("work_tasks")
        .select("*")
        .eq(
            "user_id",
            user.id
        )
        .order(
            "completed",
            {
                ascending: true
            }
        )
        .order(
            "due_date",
            {
                ascending: true,
                nullsFirst: false
            }
        );


    if (error) {

        console.error(
            "LOAD WORK TASKS ERROR:",
            error
        );

        return;
    }


    console.log(
        "WORK TASKS FROM SUPABASE:",
        data
    );


    workTasks =
        data || [];


    renderWorkTasks();
}


// ==========================================
// RESET FORM
// ==========================================

function resetWorkForm() {

    workTaskName.value =
        "";

    workTaskDate.value =
        "";

    workTaskNotes.value =
        "";

    editingTaskId =
        null;

    workFormTitle.textContent =
        "Add Work Task";

    saveWorkTaskButton.textContent =
        "Add Task";
}


// ==========================================
// UPDATE COUNTERS
// ==========================================

function updateWorkCounters() {

    const today =
        getTodayDate();


    const openTasks =
        workTasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    const completedTasks =
        workTasks.filter(
            function (task) {

                return task.completed;

            }
        );


    const dueTodayTasks =
        workTasks.filter(
            function (task) {

                return (
                    !task.completed &&
                    task.due_date ===
                    today
                );

            }
        );


    if (workOpenCount) {
        workOpenCount.textContent =
            openTasks.length;
    }


    if (workCompletedCount) {
        workCompletedCount.textContent =
            completedTasks.length;
    }


    if (workTodayCount) {
        workTodayCount.textContent =
            dueTodayTasks.length;
    }


    if (workTaskCount) {

        workTaskCount.textContent =
            openTasks.length === 1
                ? "1 Task"
                : `${openTasks.length} Tasks`;

    }
}


// ==========================================
// CHECK OVERDUE
// ==========================================

function isTaskOverdue(
    task
) {

    if (
        !task.due_date ||
        task.completed
    ) {

        return false;

    }


    return (
        task.due_date <
        getTodayDate()
    );
}


// ==========================================
// RENDER WORK TASKS
// ==========================================

function renderWorkTasks() {

    if (!workTaskList) {

        console.error(
            "work-task-list element not found"
        );

        return;
    }


    workTaskList.innerHTML =
        "";


    updateWorkCounters();


    if (
        workTasks.length === 0
    ) {

        workTaskList.innerHTML = `

            <div class="empty-state">

                <h3>
                    No work tasks yet
                </h3>

                <p>
                    Click + Add Task to create your first task.
                </p>

            </div>

        `;

        return;
    }


    workTasks.forEach(
        function (task) {

            const taskItem =
                document.createElement(
                    "div"
                );


            taskItem.className =
                "task-item";


            if (task.completed) {

                taskItem.classList.add(
                    "completed"
                );

            }


            const dueToday =
                (
                    !task.completed &&
                    task.due_date ===
                    getTodayDate()
                );


            const overdue =
                isTaskOverdue(
                    task
                );


            const displayDate =
                formatTaskDate(
                    task.due_date
                );


            taskItem.innerHTML = `

                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? "checked" : ""}
                >


                <div class="task-details">

                    <h3>
                        ${task.name}
                    </h3>


                    <div class="task-meta">

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
                                : ""
                        }


                        ${
                            overdue
                                ? `
                                    <span class="badge overdue-badge">
                                        Overdue
                                    </span>
                                `
                                : ""
                        }

                    </div>


                    ${
                        task.notes
                            ? `
                                <p class="task-notes">
                                    ${task.notes}
                                </p>
                            `
                            : ""
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


            // COMPLETE

            const checkbox =
                taskItem.querySelector(
                    ".task-checkbox"
                );


            checkbox.addEventListener(
                "change",
                function (event) {

                    updateTaskStatus(
                        task.id,
                        event.target.checked
                    );

                }
            );


            // EDIT

            taskItem
                .querySelector(
                    ".edit-button"
                )
                .addEventListener(
                    "click",
                    function () {

                        editingTaskId =
                            task.id;


                        workTaskName.value =
                            task.name;


                        workTaskDate.value =
                            task.due_date || "";


                        workTaskNotes.value =
                            task.notes || "";


                        workFormTitle.textContent =
                            "Edit Work Task";


                        saveWorkTaskButton.textContent =
                            "Save Changes";


                        workForm.classList.remove(
                            "hidden"
                        );


                        workTaskName.focus();

                    }
                );


            // DELETE

            taskItem
                .querySelector(
                    ".delete-button"
                )
                .addEventListener(
                    "click",
                    function () {

                        deleteWorkTask(
                            task.id,
                            task.name
                        );

                    }
                );


            workTaskList.appendChild(
                taskItem
            );

        }
    );
}


// ==========================================
// SAVE TASK
// ==========================================

async function saveWorkTask() {

    console.log(
        "SAVE WORK TASK CLICKED"
    );


    const name =
        workTaskName
            .value
            .trim();


    const dueDate =
        workTaskDate.value ||
        null;


    const notes =
        workTaskNotes
            .value
            .trim();


    console.log(
        "FORM VALUES:",
        {
            name: name,
            dueDate: dueDate,
            notes: notes
        }
    );


    if (!name) {

        alert(
            "Please enter a task name."
        );


        workTaskName.focus();

        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {

        alert(
            "No active login session."
        );


        window.location.replace(
            "login.html"
        );

        return;
    }


    console.log(
        "TRYING TO INSERT/UPDATE:",
        {
            user_id:
                user.id,

            name:
                name,

            due_date:
                dueDate,

            notes:
                notes,

            completed:
                false
        }
    );


    saveWorkTaskButton.disabled =
        true;


    try {

        // ==================================
        // INSERT NEW TASK
        // ==================================

        if (
            editingTaskId ===
            null
        ) {

            const {
                data,
                error
            } = await supabaseClient
                .from(
                    "work_tasks"
                )
                .insert({

                    user_id:
                        user.id,

                    name:
                        name,

                    due_date:
                        dueDate,

                    notes:
                        notes,

                    completed:
                        false

                })
                .select();


            console.log(
                "INSERT RESPONSE:",
                {
                    data,
                    error
                }
            );


            if (error) {

                throw error;

            }

        }


        // ==================================
        // UPDATE EXISTING TASK
        // ==================================

        else {

            const {
                data,
                error
            } = await supabaseClient
                .from(
                    "work_tasks"
                )
                .update({

                    name:
                        name,

                    due_date:
                        dueDate,

                    notes:
                        notes

                })
                .eq(
                    "id",
                    editingTaskId
                )
                .eq(
                    "user_id",
                    user.id
                )
                .select();


            console.log(
                "UPDATE RESPONSE:",
                {
                    data,
                    error
                }
            );


            if (error) {

                throw error;

            }

        }


        resetWorkForm();


        workForm.classList.add(
            "hidden"
        );


        await loadWorkTasks();


    } catch (error) {

        console.error(
            "SAVE TASK ERROR:",
            error
        );


        alert(
            "Unable to save task. Check Console."
        );

    } finally {

        saveWorkTaskButton.disabled =
            false;

    }
}


// ==========================================
// UPDATE TASK STATUS
// ==========================================

async function updateTaskStatus(
    taskId,
    completed
) {

    const user =
        await getCurrentUser();


    if (!user) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "work_tasks"
        )
        .update({

            completed:
                completed

        })
        .eq(
            "id",
            taskId
        )
        .eq(
            "user_id",
            user.id
        )
        .select();


    console.log(
        "STATUS UPDATE:",
        {
            data,
            error
        }
    );


    if (error) {

        console.error(
            "UPDATE STATUS ERROR:",
            error
        );

        return;
    }


    await loadWorkTasks();
}


// ==========================================
// DELETE TASK
// ==========================================

async function deleteWorkTask(
    taskId,
    taskName
) {

    const confirmDelete =
        confirm(
            `Delete "${taskName}"?`
        );


    if (!confirmDelete) {
        return;
    }


    const user =
        await getCurrentUser();


    if (!user) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient
        .from(
            "work_tasks"
        )
        .delete()
        .eq(
            "id",
            taskId
        )
        .eq(
            "user_id",
            user.id
        )
        .select();


    console.log(
        "DELETE RESPONSE:",
        {
            data,
            error
        }
    );


    if (error) {

        console.error(
            "DELETE TASK ERROR:",
            error
        );

        alert(
            "Unable to delete task."
        );

        return;
    }


    await loadWorkTasks();
}


// ==========================================
// SHOW FORM
// ==========================================

if (showWorkForm) {

    showWorkForm.addEventListener(
        "click",
        function () {

            console.log(
                "SHOW WORK FORM CLICKED"
            );


            resetWorkForm();


            workForm.classList.remove(
                "hidden"
            );


            workTaskName.focus();

        }
    );

} else {

    console.error(
        "show-work-form button not found"
    );

}


// ==========================================
// CANCEL
// ==========================================

if (cancelWorkTask) {

    cancelWorkTask.addEventListener(
        "click",
        function () {

            resetWorkForm();


            workForm.classList.add(
                "hidden"
            );

        }
    );

}


// ==========================================
// SAVE BUTTON
// ==========================================

if (saveWorkTaskButton) {

    saveWorkTaskButton.addEventListener(
        "click",
        saveWorkTask
    );

} else {

    console.error(
        "save-work-task button not found"
    );

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "WORK PAGE READY"
        );


        loadWorkTasks();

    }
);