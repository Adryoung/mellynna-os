// ==========================================
// MELLYNNA OS - HOME DASHBOARD
// ==========================================


// ==========================================
// ELEMENTS
// ==========================================

const currentDate =
    document.getElementById("current-date");

const greetingText =
    document.getElementById("greeting-text");

const todayCount =
    document.getElementById("today-count");

const workCount =
    document.getElementById("work-count");

const personalCount =
    document.getElementById("personal-count");

const plansCount =
    document.getElementById("plans-count");

const spendingTotal =
    document.getElementById("spending-total");

const kitchenSpending =
    document.getElementById("kitchen-spending");

const dailySpending =
    document.getElementById("daily-spending");

const taskCountLabel =
    document.querySelector(".task-count");

const taskList =
    document.querySelector(".task-list");

const upcomingList =
    document.querySelector(".upcoming-list");


// ==========================================
// DEBUG
// ==========================================

console.log("HOME.JS LOADED");


// ==========================================
// DATE HELPERS
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


    return (
        year +
        "-" +
        month +
        "-" +
        day
    );
}


// ==========================================
// DATE & GREETING
// ==========================================

function updateDateAndGreeting() {

    const now =
        new Date();


    if (currentDate) {

        currentDate.textContent =
            now.toLocaleDateString(
                "en-GB",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    const hour =
        now.getHours();


    if (!greetingText) {
        return;
    }


    if (hour < 12) {

        greetingText.textContent =
            "Good Morning 👋";

    } else if (hour < 18) {

        greetingText.textContent =
            "Good Afternoon 👋";

    } else {

        greetingText.textContent =
            "Good Evening 👋";

    }
}


// ==========================================
// GET CURRENT USER
// ==========================================

async function getHomeUser() {

    const {
        data: { user },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (error) {

        console.error(
            "HOME USER ERROR:",
            error
        );

        return null;
    }


    return user;
}


// ==========================================
// WORK COUNT FROM SUPABASE
// ==========================================

async function updateWorkCount() {

    const user =
        await getHomeUser();


    if (!user) {

        console.log(
            "HOME: NO USER FOUND"
        );

        return;
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("work_tasks")
            .select("id")
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "completed",
                false
            );


    if (error) {

        console.error(
            "HOME WORK COUNT ERROR:",
            error
        );

        return;
    }


    const total =
        data
            ? data.length
            : 0;


    if (workCount) {

        workCount.textContent =
            total;

    }


    console.log(
        "HOME WORK COUNT:",
        total
    );
}


// ==========================================
// TODAY WORK TASKS FROM SUPABASE
// ==========================================

async function getTodayWorkTasks() {

    const user =
        await getHomeUser();


    if (!user) {

        return [];

    }


    const today =
        getTodayDate();


    const {
        data,
        error
    } =
        await supabaseClient
            .from("work_tasks")
            .select("*")
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "completed",
                false
            )
            .eq(
                "due_date",
                today
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "HOME TODAY WORK ERROR:",
            error
        );

        return [];
    }


    return (
        data || []
    );
}


// ==========================================
// LOCAL STORAGE HELPER
// TEMPORARY FOR MODULES NOT MIGRATED YET
// ==========================================

function getLocalArray(key) {

    const saved =
        localStorage.getItem(key);


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        console.error(
            "LOCAL STORAGE ERROR:",
            error
        );

        return [];
    }
}


// ==========================================
// PERSONAL - TEMP LOCAL STORAGE
// ==========================================

function getPersonalTasks() {

    return getLocalArray(
        "mellynnaPersonalTasksV2"
    );
}


// ==========================================
// PLANS - TEMP LOCAL STORAGE
// ==========================================

function getPlans() {

    return getLocalArray(
        "mellynnaPlansV2"
    );
}


// ==========================================
// EXPENSES - TEMP LOCAL STORAGE
// ==========================================

function getExpenses() {

    return getLocalArray(
        "mellynnaExpensesV2"
    );
}


// ==========================================
// PERSONAL COUNT
// TEMP UNTIL PERSONAL SUPABASE MIGRATION
// ==========================================

function updatePersonalCount() {

    const personalTasks =
        getPersonalTasks();


    const openTasks =
        personalTasks.filter(
            function (task) {

                return !task.completed;

            }
        );


    if (personalCount) {

        personalCount.textContent =
            openTasks.length;

    }
}


// ==========================================
// PLANS COUNT
// TEMP UNTIL PLANNER SUPABASE MIGRATION
// ==========================================

function updatePlansCount() {

    const today =
        getTodayDate();


    const plans =
        getPlans();


    const upcomingPlans =
        plans.filter(
            function (plan) {

                return (
                    plan.date &&
                    plan.date >=
                    today
                );

            }
        );


    if (plansCount) {

        plansCount.textContent =
            upcomingPlans.length;

    }
}


// ==========================================
// TODAY PERSONAL TASKS
// TEMP LOCAL STORAGE
// ==========================================

function getTodayPersonalTasks() {

    const today =
        getTodayDate();


    return getPersonalTasks()
        .filter(
            function (task) {

                return (
                    !task.completed &&
                    task.date ===
                    today
                );

            }
        );
}


// ==========================================
// RENDER TODAY'S FOCUS
// ==========================================

async function renderTodayFocus() {

    const workToday =
        await getTodayWorkTasks();


    const personalToday =
        getTodayPersonalTasks();


    const combinedTasks =
        [];


    workToday.forEach(
        function (task) {

            combinedTasks.push({

                id:
                    task.id,

                name:
                    task.name,

                notes:
                    task.notes || "",

                source:
                    "Work",

                cloud:
                    true

            });

        }
    );


    personalToday.forEach(
        function (task) {

            combinedTasks.push({

                id:
                    task.id,

                name:
                    task.name,

                notes:
                    task.notes || "",

                source:
                    "Personal",

                cloud:
                    false

            });

        }
    );


    if (todayCount) {

        todayCount.textContent =
            combinedTasks.length;

    }


    if (taskCountLabel) {

        taskCountLabel.textContent =
            combinedTasks.length === 1
                ? "1 Task"
                : `${combinedTasks.length} Tasks`;

    }


    if (!taskList) {

        return;
    }


    taskList.innerHTML =
        "";


    if (
        combinedTasks.length === 0
    ) {

        taskList.innerHTML = `

            <div class="empty-state">

                Nothing urgent today

            </div>

        `;


        return;
    }


    combinedTasks.forEach(
        function (task) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "task-item";


            item.innerHTML = `

                <div>

                    <h3>
                        ${task.name}
                    </h3>

                    <p>
                        ${task.source}
                        · Due Today
                    </p>

                    ${
                        task.notes
                            ? `
                                <p>
                                    ${task.notes}
                                </p>
                            `
                            : ""
                    }

                </div>

            `;


            taskList.appendChild(
                item
            );

        }
    );
}


// ==========================================
// UPCOMING PLANS
// TEMP LOCAL STORAGE
// ==========================================

function renderUpcomingPlans() {

    if (!upcomingList) {

        return;
    }


    const today =
        getTodayDate();


    const plans =
        getPlans()
            .filter(
                function (plan) {

                    return (
                        plan.date &&
                        plan.date >=
                        today
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        a.date || ""
                    ).localeCompare(
                        b.date || ""
                    );

                }
            )
            .slice(
                0,
                4
            );


    upcomingList.innerHTML =
        "";


    if (
        plans.length === 0
    ) {

        upcomingList.innerHTML = `

            <div class="empty-state">

                No upcoming plans

            </div>

        `;


        return;
    }


    plans.forEach(
        function (plan) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "upcoming-item";


            item.innerHTML = `

                <div>

                    <h3>
                        ${plan.name}
                    </h3>

                    <p>
                        ${plan.date}
                    </p>

                </div>

            `;


            upcomingList.appendChild(
                item
            );

        }
    );
}


// ==========================================
// SPENDING
// TEMP LOCAL STORAGE
// ==========================================

function updateSpending() {

    const expenses =
        getExpenses();


    const now =
        new Date();


    const currentYear =
        now.getFullYear();


    const currentMonth =
        now.getMonth();


    let total =
        0;


    let grocery =
        0;


    let others =
        0;


    expenses.forEach(
        function (expense) {

            if (!expense.date) {

                return;

            }


            const date =
                new Date(
                    expense.date +
                    "T00:00:00"
                );


            const sameMonth =
                (
                    date.getFullYear() ===
                    currentYear &&
                    date.getMonth() ===
                    currentMonth
                );


            if (!sameMonth) {

                return;

            }


            const amount =
                Number(
                    expense.amount ||
                    0
                );


            total +=
                amount;


            if (
                expense.category ===
                "Grocery"
            ) {

                grocery +=
                    amount;

            } else {

                others +=
                    amount;

            }

        }
    );


    if (spendingTotal) {

        spendingTotal.textContent =
            `RM ${total.toFixed(2)}`;

    }


    if (kitchenSpending) {

        kitchenSpending.textContent =
            `RM ${grocery.toFixed(2)}`;

    }


    if (dailySpending) {

        dailySpending.textContent =
            `RM ${others.toFixed(2)}`;

    }
}


// ==========================================
// RENDER HOME
// ==========================================

async function renderHome() {

    console.log(
        "RENDERING HOME..."
    );


    await updateWorkCount();


    updatePersonalCount();


    updatePlansCount();


    await renderTodayFocus();


    renderUpcomingPlans();


    updateSpending();


    console.log(
        "HOME RENDER COMPLETE"
    );
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDateAndGreeting();

        renderHome();

    }
);