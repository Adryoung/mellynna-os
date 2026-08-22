// =====================================
// HOME ELEMENTS
// =====================================

const currentDate =
    document.getElementById('current-date');

const greetingText =
    document.getElementById('greeting-text');

const todayCount =
    document.getElementById('today-count');

const workCount =
    document.getElementById('work-count');

const personalCount =
    document.getElementById('personal-count');

const plansCount =
    document.getElementById('plans-count');

const spendingTotal =
    document.getElementById('spending-total');

const taskCountLabel =
    document.querySelector('.task-count');

const taskList =
    document.querySelector('.task-list');

const upcomingList =
    document.querySelector('.upcoming-list');

const kitchenSpending =
    document.getElementById('kitchen-spending');

const dailySpending =
    document.getElementById('daily-spending');


// =====================================
// DATE HELPERS
// =====================================

function getTodayDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1)
            .padStart(2, '0');

    const day =
        String(now.getDate())
            .padStart(2, '0');

    return `${year}-${month}-${day}`;
}


function formatDisplayDate(dateString) {

    if (!dateString) {
        return '';
    }

    const date =
        new Date(
            dateString + 'T00:00:00'
        );

    return date.toLocaleDateString(
        'en-GB',
        {
            day: 'numeric',
            month: 'short'
        }
    );
}


// =====================================
// DATE & GREETING
// =====================================

function updateDateAndGreeting() {

    const now =
        new Date();

    const hour =
        now.getHours();


    currentDate.textContent =
        now.toLocaleDateString(
            'en-GB',
            {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }
        );


    if (hour < 12) {

        greetingText.textContent =
            'Good Morning, Mellynna! ☀️';

    } else if (hour < 18) {

        greetingText.textContent =
            'Good Afternoon, Mellynna! 🌤️';

    } else {

        greetingText.textContent =
            'Good Evening, Mellynna! 🌙';

    }
}


// =====================================
// STORAGE HELPERS
// =====================================

function getStorageArray(key) {

    const saved =
        localStorage.getItem(key);

    if (!saved) {
        return [];
    }

    try {
        return JSON.parse(saved);
    } catch (error) {
        return [];
    }
}


function getWorkTasks() {

    return getStorageArray(
        'mellynnaWorkTasksV2'
    );
}


function getPersonalTasks() {

    return getStorageArray(
        'mellynnaPersonalTasksV2'
    );
}


function getPlans() {

    return getStorageArray(
        'mellynnaPlansV2'
    );
}


function getExpenses() {

    return getStorageArray(
        'mellynnaExpensesV2'
    );
}


// =====================================
// SUMMARY COUNTERS
// =====================================

function updateSummaryCards() {

    const workTasks =
        getWorkTasks();

    const personalTasks =
        getPersonalTasks();

    const plans =
        getPlans();


    const openWork =
        workTasks.filter(
            task => !task.completed
        );


    const openPersonal =
        personalTasks.filter(
            task => !task.completed
        );


    const today =
        getTodayDate();


    const upcomingPlans =
        plans.filter(
            plan =>
                plan.date &&
                plan.date >= today
        );


    workCount.textContent =
        openWork.length;


    personalCount.textContent =
        openPersonal.length;


    plansCount.textContent =
        upcomingPlans.length;
}


// =====================================
// TODAY'S FOCUS
// =====================================

function renderTodayFocus() {

    const today =
        getTodayDate();


    const workToday =
        getWorkTasks()
            .filter(
                task =>
                    !task.completed &&
                    task.date === today
            )
            .map(
                task => ({
                    ...task,
                    source: 'Work'
                })
            );


    const personalToday =
        getPersonalTasks()
            .filter(
                task =>
                    !task.completed &&
                    task.date === today
            )
            .map(
                task => ({
                    ...task,
                    source: 'Personal'
                })
            );


    const todayTasks = [
        ...workToday,
        ...personalToday
    ];


    taskList.innerHTML = '';


    todayCount.textContent =
        todayTasks.length;


    taskCountLabel.textContent =
        todayTasks.length === 1
            ? '1 Task'
            : `${todayTasks.length} Tasks`;


    if (todayTasks.length === 0) {

        const empty =
            document.createElement('div');

        empty.className =
            'home-empty-state';

        empty.innerHTML = `
            <h3>Nothing urgent today 🎉</h3>
            <p>
                Work and Personal tasks due today
                will appear here.
            </p>
        `;

        taskList.appendChild(empty);

        return;
    }


    todayTasks.forEach(
        function (task) {

            const item =
                document.createElement('div');

            item.className =
                'task-item';


            item.innerHTML = `

                <input type="checkbox">

                <div class="task-info">

                    <h3>
                        ${task.name}
                    </h3>

                    <p>
                        ${task.source} · Due Today
                    </p>

                    ${
                        task.category
                            ? `
                                <small class="home-task-category">
                                    ${task.category}
                                </small>
                            `
                            : ''
                    }

                    ${
                        task.notes
                            ? `
                                <small class="home-task-notes">
                                    ${task.notes}
                                </small>
                            `
                            : ''
                    }

                </div>
            `;


            const checkbox =
                item.querySelector(
                    'input'
                );


            checkbox.addEventListener(
                'change',
                function () {

                    completeTaskFromHome(
                        task.source,
                        task.id
                    );

                }
            );


            taskList.appendChild(
                item
            );
        }
    );
}


// =====================================
// COMPLETE TASK FROM HOME
// =====================================

function completeTaskFromHome(
    source,
    taskId
) {

    const key =
        source === 'Work'
            ? 'mellynnaWorkTasksV2'
            : 'mellynnaPersonalTasksV2';


    const tasks =
        getStorageArray(key);


    const index =
        tasks.findIndex(
            task =>
                task.id === taskId
        );


    if (index === -1) {
        return;
    }


    tasks[index].completed = true;


    localStorage.setItem(
        key,
        JSON.stringify(tasks)
    );


    renderHome();
}


// =====================================
// UPCOMING PLANS
// =====================================

function renderUpcomingPlans() {

    if (!upcomingList) {
        return;
    }


    const today =
        getTodayDate();


    const plans =
        getPlans()
            .filter(
                plan =>
                    plan.date &&
                    plan.date >= today
            )
            .sort(
                (a, b) =>
                    a.date.localeCompare(
                        b.date
                    )
            )
            .slice(0, 4);


    upcomingList.innerHTML = '';


    if (plans.length === 0) {

        const empty =
            document.createElement('div');

        empty.className =
            'home-empty-state';

        empty.innerHTML = `
            <h3>No upcoming plans</h3>
            <p>
                Plans added in Planner
                will appear here.
            </p>
        `;

        upcomingList.appendChild(empty);

        return;
    }


    plans.forEach(
        function (plan) {

            const date =
                new Date(
                    plan.date +
                    'T00:00:00'
                );


            const day =
                date.getDate();


            const month =
                date.toLocaleDateString(
                    'en-GB',
                    {
                        month: 'short'
                    }
                );


            const item =
                document.createElement('div');

            item.className =
                'upcoming-item';


            item.innerHTML = `

                <div class="date-box">

                    <span>
                        ${day}
                    </span>

                    <small>
                        ${month}
                    </small>

                </div>


                <div>

                    <h3>
                        ${plan.name}
                    </h3>

                    <p>
                        ${plan.type || 'Plan'}
                    </p>

                </div>
            `;


            upcomingList.appendChild(
                item
            );
        }
    );
}


// =====================================
// SPENDING
// =====================================

function updateSpending() {

    const expenses =
        getExpenses();


    const now =
        new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    let total = 0;

    let kitchen = 0;

    let daily = 0;


    expenses.forEach(
        function (expense) {

            if (!expense.date) {
                return;
            }


            const date =
                new Date(
                    expense.date +
                    'T00:00:00'
                );


            const isThisMonth =
                (
                    date.getMonth() ===
                        currentMonth &&
                    date.getFullYear() ===
                        currentYear
                );


            if (!isThisMonth) {
                return;
            }


            const amount =
                Number(
                    expense.amount || 0
                );


            total += amount;


            if (
                expense.category ===
                'Grocery'
            ) {

                kitchen += amount;

            } else {

                daily += amount;

            }

        }
    );


    spendingTotal.textContent =
        `RM ${total.toFixed(2)}`;


    if (kitchenSpending) {

        kitchenSpending.textContent =
            `RM ${kitchen.toFixed(2)}`;

    }


    if (dailySpending) {

        dailySpending.textContent =
            `RM ${daily.toFixed(2)}`;

    }
}


// =====================================
// RENDER HOME
// =====================================

function renderHome() {

    updateSummaryCards();

    renderTodayFocus();

    renderUpcomingPlans();

    updateSpending();
}


// =====================================
// START HOME
// =====================================

updateDateAndGreeting();

renderHome();