// =====================================
// PLANNER DATA
// =====================================

let plans =
    JSON.parse(
        localStorage.getItem(
            'mellynnaPlansV2'
        )
    ) || [];


// =====================================
// EDIT MODE
// =====================================

let editingPlanIndex = null;


// =====================================
// CALENDAR STATE
// =====================================

const now = new Date();

let currentMonth =
    now.getMonth();

let currentYear =
    now.getFullYear();

let selectedDate =
    getTodayDate();


// =====================================
// ELEMENTS
// =====================================

const calendarMonthTitle =
    document.getElementById(
        'calendar-month-title'
    );

const calendarGrid =
    document.getElementById(
        'calendar-grid'
    );

const previousMonthButton =
    document.getElementById(
        'previous-month'
    );

const nextMonthButton =
    document.getElementById(
        'next-month'
    );

const showPlanForm =
    document.getElementById(
        'show-plan-form'
    );

const planForm =
    document.getElementById(
        'plan-form'
    );

const planFormTitle =
    document.getElementById(
        'plan-form-title'
    );

const planName =
    document.getElementById(
        'plan-name'
    );

const planDate =
    document.getElementById(
        'plan-date'
    );

const planType =
    document.getElementById(
        'plan-type'
    );

const planNotes =
    document.getElementById(
        'plan-notes'
    );

const cancelPlan =
    document.getElementById(
        'cancel-plan'
    );

const savePlanButton =
    document.getElementById(
        'save-plan'
    );

const planList =
    document.getElementById(
        'plan-list'
    );

const planListCount =
    document.getElementById(
        'plan-list-count'
    );

const selectedDateTitle =
    document.getElementById(
        'selected-date-title'
    );

const selectedDateCount =
    document.getElementById(
        'selected-date-count'
    );

const selectedDateList =
    document.getElementById(
        'selected-date-list'
    );

const plannerUpcomingCount =
    document.getElementById(
        'planner-upcoming-count'
    );

const plannerMonthCount =
    document.getElementById(
        'planner-month-count'
    );

const plannerTodayCount =
    document.getElementById(
        'planner-today-count'
    );


// =====================================
// GET TODAY DATE
// =====================================

function getTodayDate() {

    const today =
        new Date();

    return formatDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

}


// =====================================
// DATE KEY
// =====================================

function formatDateKey(
    year,
    month,
    day
) {

    const monthText =
        String(
            month + 1
        ).padStart(
            2,
            '0'
        );

    const dayText =
        String(
            day
        ).padStart(
            2,
            '0'
        );

    return (
        year +
        '-' +
        monthText +
        '-' +
        dayText
    );

}


// =====================================
// FORMAT DISPLAY DATE
// =====================================

function formatDisplayDate(
    dateString
) {

    if (!dateString) {
        return '';
    }

    const date =
        new Date(
            dateString +
            'T00:00:00'
        );

    return date.toLocaleDateString(
        'en-GB',
        {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }
    );

}


// =====================================
// FORMAT SHORT DATE
// =====================================

function formatShortDate(
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
// LOAD WORK TASKS
// =====================================

function getWorkTasks() {

    const saved =
        localStorage.getItem(
            'mellynnaWorkTasksV2'
        );

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);

}


// =====================================
// LOAD PERSONAL TASKS
// =====================================

function getPersonalTasks() {

    const saved =
        localStorage.getItem(
            'mellynnaPersonalTasksV2'
        );

    if (!saved) {
        return [];
    }

    return JSON.parse(saved);

}


// =====================================
// SAVE PLANS
// =====================================

function savePlans() {

    localStorage.setItem(
        'mellynnaPlansV2',
        JSON.stringify(plans)
    );

}


// =====================================
// RESET FORM
// =====================================

function resetPlanForm() {

    planName.value = '';

    planDate.value = '';

    planType.value =
        'Personal';

    planNotes.value = '';

    editingPlanIndex = null;

    planFormTitle.textContent =
        'New Plan';

    savePlanButton.textContent =
        'Save Plan';

}


// =====================================
// GET ITEMS FOR DATE
// =====================================

function getItemsForDate(
    dateString
) {

    const items = [];


    getWorkTasks()
        .filter(
            function (task) {

                return (
                    task.date ===
                    dateString
                );

            }
        )
        .forEach(
            function (task) {

                items.push({

                    source: 'Work',

                    name: task.name,

                    notes:
                        task.notes || '',

                    completed:
                        task.completed

                });

            }
        );


    getPersonalTasks()
        .filter(
            function (task) {

                return (
                    task.date ===
                    dateString
                );

            }
        )
        .forEach(
            function (task) {

                items.push({

                    source: 'Personal',

                    name: task.name,

                    notes:
                        task.notes || '',

                    completed:
                        task.completed,

                    category:
                        task.category || ''

                });

            }
        );


    plans
        .filter(
            function (plan) {

                return (
                    plan.date ===
                    dateString
                );

            }
        )
        .forEach(
            function (plan) {

                items.push({

                    source: 'Plan',

                    name: plan.name,

                    notes:
                        plan.notes || '',

                    type:
                        plan.type,

                    completed:
                        false

                });

            }
        );


    return items;

}


// =====================================
// CALENDAR TITLE
// =====================================

function updateCalendarTitle() {

    const date =
        new Date(
            currentYear,
            currentMonth,
            1
        );

    calendarMonthTitle.textContent =
        date.toLocaleDateString(
            'en-GB',
            {
                month: 'long',
                year: 'numeric'
            }
        );

}


// =====================================
// RENDER CALENDAR
// =====================================

function renderCalendar() {

    calendarGrid.innerHTML = '';

    updateCalendarTitle();


    const firstDay =
        new Date(
            currentYear,
            currentMonth,
            1
        );

    const lastDay =
        new Date(
            currentYear,
            currentMonth + 1,
            0
        );

    const numberOfDays =
        lastDay.getDate();


    let startDay =
        firstDay.getDay();


    if (startDay === 0) {

        startDay = 7;

    }


    for (
        let i = 1;
        i < startDay;
        i++
    ) {

        const empty =
            document.createElement(
                'div'
            );

        empty.className =
            'calendar-day empty';

        calendarGrid.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= numberOfDays;
        day++
    ) {

        const dateKey =
            formatDateKey(
                currentYear,
                currentMonth,
                day
            );


        const dayCell =
            document.createElement(
                'div'
            );

        dayCell.className =
            'calendar-day';


        if (
            dateKey ===
            getTodayDate()
        ) {

            dayCell.classList.add(
                'today'
            );

        }


        if (
            dateKey ===
            selectedDate
        ) {

            dayCell.classList.add(
                'selected'
            );

        }


        const items =
            getItemsForDate(
                dateKey
            );


        dayCell.innerHTML = `

            <div class="day-number">
                ${day}
            </div>

            <div class="calendar-items">
            </div>

        `;


        const itemsContainer =
            dayCell.querySelector(
                '.calendar-items'
            );


        items
            .slice(0, 3)
            .forEach(
                function (item) {

                    const itemElement =
                        document.createElement(
                            'div'
                        );

                    itemElement.className =
                        'calendar-item';


                    if (
                        item.source ===
                        'Work'
                    ) {

                        itemElement.classList.add(
                            'work'
                        );

                    } else if (
                        item.source ===
                        'Personal'
                    ) {

                        itemElement.classList.add(
                            'personal'
                        );

                    } else {

                        itemElement.classList.add(
                            'plan'
                        );

                    }


                    itemElement.textContent =
                        item.name;


                    itemsContainer.appendChild(
                        itemElement
                    );

                }
            );


        if (
            items.length > 3
        ) {

            const more =
                document.createElement(
                    'div'
                );

            more.className =
                'calendar-item';

            more.textContent =
                '+' +
                (
                    items.length -
                    3
                ) +
                ' more';

            itemsContainer.appendChild(
                more
            );

        }


        dayCell.addEventListener(
            'click',
            function () {

                selectedDate =
                    dateKey;

                renderCalendar();

                renderSelectedDate();

            }
        );


        calendarGrid.appendChild(
            dayCell
        );

    }

}


// =====================================
// SELECTED DATE VIEW
// =====================================

function renderSelectedDate() {

    const items =
        getItemsForDate(
            selectedDate
        );


    selectedDateTitle.textContent =
        formatDisplayDate(
            selectedDate
        );


    selectedDateCount.textContent =
        items.length +
        (
            items.length === 1
                ? ' Item'
                : ' Items'
        );


    selectedDateList.innerHTML = '';


    if (
        items.length === 0
    ) {

        const empty =
            document.createElement(
                'div'
            );

        empty.className =
            'empty-state';

        empty.innerHTML = `

            <h3>
                Nothing planned
            </h3>

            <p>
                No tasks or plans for this date.
            </p>

        `;

        selectedDateList.appendChild(
            empty
        );

        return;

    }


    items.forEach(
        function (item) {

            const row =
                document.createElement(
                    'div'
                );

            row.className =
                'selected-item';


            let icon = '📅';


            if (
                item.source ===
                'Work'
            ) {

                icon = '💼';

            } else if (
                item.source ===
                'Personal'
            ) {

                icon = '🌿';

            }


            row.innerHTML = `

                <div class="selected-item-icon">
                    ${icon}
                </div>

                <div class="selected-item-details">

                    <h3>
                        ${item.name}
                    </h3>

                    <p>
                        ${item.source}

                        ${
                            item.type
                                ? ' · ' +
                                  item.type
                                : ''
                        }

                        ${
                            item.category
                                ? ' · ' +
                                  item.category
                                : ''
                        }

                        ${
                            item.completed
                                ? ' · Completed'
                                : ''
                        }
                    </p>

                    ${
                        item.notes
                            ? `
                                <p>
                                    ${item.notes}
                                </p>
                            `
                            : ''
                    }

                </div>

            `;


            selectedDateList.appendChild(
                row
            );

        }
    );

}


// =====================================
// PLAN TYPE CLASS
// =====================================

function getPlanTypeClass(
    type
) {

    if (
        type === 'Work'
    ) {

        return 'plan-work';

    }

    if (
        type === 'Appointment'
    ) {

        return 'plan-appointment';

    }

    if (
        type === 'Other'
    ) {

        return 'plan-other';

    }

    return 'plan-personal';

}


// =====================================
// RENDER PLAN LIST
// =====================================

function renderPlanList() {

    planList.innerHTML = '';


    const sortedPlans =
        [...plans].sort(
            function (a, b) {

                return (
                    a.date || ''
                ).localeCompare(
                    b.date || ''
                );

            }
        );


    planListCount.textContent =
        plans.length +
        (
            plans.length === 1
                ? ' Plan'
                : ' Plans'
        );


    if (
        plans.length === 0
    ) {

        const empty =
            document.createElement(
                'div'
            );

        empty.className =
            'empty-state';

        empty.innerHTML = `

            <h3>
                No plans yet
            </h3>

            <p>
                Click + New Plan to add something.
            </p>

        `;

        planList.appendChild(
            empty
        );

        return;

    }


    sortedPlans.forEach(
        function (plan) {

            const realIndex =
                plans.findIndex(
                    function (item) {

                        return (
                            item.id ===
                            plan.id
                        );

                    }
                );


            const row =
                document.createElement(
                    'div'
                );

            row.className =
                'plan-item';


            const typeClass =
                getPlanTypeClass(
                    plan.type
                );


            row.innerHTML = `

                <div class="plan-details">

                    <h3>
                        ${plan.name}
                    </h3>

                    <div class="plan-meta">

                        <span>
                            ${formatShortDate(
                                plan.date
                            )}
                        </span>

                        <span
                            class="plan-badge ${typeClass}"
                        >
                            ${plan.type}
                        </span>

                    </div>

                    ${
                        plan.notes
                            ? `
                                <p class="plan-notes">
                                    ${plan.notes}
                                </p>
                            `
                            : ''
                    }

                </div>


                <div class="plan-actions">

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


            row
                .querySelector(
                    '.edit-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        editingPlanIndex =
                            realIndex;


                        planName.value =
                            plan.name;


                        planDate.value =
                            plan.date;


                        planType.value =
                            plan.type;


                        planNotes.value =
                            plan.notes || '';


                        planFormTitle.textContent =
                            'Edit Plan';


                        savePlanButton.textContent =
                            'Save Changes';


                        planForm.classList.remove(
                            'hidden'
                        );


                        planForm.scrollIntoView({
                            behavior: 'smooth'
                        });

                    }
                );


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
                                plan.name +
                                '"?'
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        plans.splice(
                            realIndex,
                            1
                        );


                        savePlans();

                        renderPlanner();

                    }
                );


            planList.appendChild(
                row
            );

        }
    );

}


// =====================================
// UPDATE SUMMARY
// =====================================

function updatePlannerSummary() {

    const today =
        getTodayDate();


    const upcomingPlans =
        plans.filter(
            function (plan) {

                return (
                    plan.date >=
                    today
                );

            }
        );


    plannerUpcomingCount.textContent =
        upcomingPlans.length;


    const monthPlans =
        plans.filter(
            function (plan) {

                if (!plan.date) {
                    return false;
                }


                const date =
                    new Date(
                        plan.date +
                        'T00:00:00'
                    );


                return (
                    date.getMonth() ===
                        currentMonth &&
                    date.getFullYear() ===
                        currentYear
                );

            }
        );


    plannerMonthCount.textContent =
        monthPlans.length;


    const todayItems =
        getItemsForDate(
            today
        );


    plannerTodayCount.textContent =
        todayItems.length;

}


// =====================================
// RESET FORM
// =====================================

function resetPlanForm() {

    planName.value = '';

    planDate.value = '';

    planType.value =
        'Personal';

    planNotes.value = '';

    editingPlanIndex = null;

    planFormTitle.textContent =
        'New Plan';

    savePlanButton.textContent =
        'Save Plan';

}


// =====================================
// SHOW PLAN FORM
// =====================================

showPlanForm.addEventListener(
    'click',
    function () {

        resetPlanForm();

        planDate.value =
            selectedDate;

        planForm.classList.remove(
            'hidden'
        );

        planName.focus();

    }
);


// =====================================
// CANCEL PLAN
// =====================================

cancelPlan.addEventListener(
    'click',
    function () {

        resetPlanForm();

        planForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// SAVE PLAN
// =====================================

savePlanButton.addEventListener(
    'click',
    function () {

        const name =
            planName.value.trim();

        const date =
            planDate.value;

        const type =
            planType.value;

        const notes =
            planNotes.value.trim();


        if (
            name === ''
        ) {

            alert(
                'Please enter a plan name.'
            );

            planName.focus();

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
            editingPlanIndex ===
            null
        ) {

            plans.push({

                id:
                    Date.now(),

                name:
                    name,

                date:
                    date,

                type:
                    type,

                notes:
                    notes,

                createdAt:
                    new Date()
                        .toISOString()

            });

        } else {

            const currentPlan =
                plans[
                    editingPlanIndex
                ];


            plans[
                editingPlanIndex
            ] = {

                ...currentPlan,

                name:
                    name,

                date:
                    date,

                type:
                    type,

                notes:
                    notes

            };

        }


        selectedDate =
            date;


        const selected =
            new Date(
                date +
                'T00:00:00'
            );


        currentMonth =
            selected.getMonth();


        currentYear =
            selected.getFullYear();


        savePlans();

        resetPlanForm();

        planForm.classList.add(
            'hidden'
        );


        renderPlanner();

    }
);


// =====================================
// PREVIOUS MONTH
// =====================================

previousMonthButton.addEventListener(
    'click',
    function () {

        currentMonth--;


        if (
            currentMonth < 0
        ) {

            currentMonth = 11;

            currentYear--;

        }


        renderPlanner();

    }
);


// =====================================
// NEXT MONTH
// =====================================

nextMonthButton.addEventListener(
    'click',
    function () {

        currentMonth++;


        if (
            currentMonth > 11
        ) {

            currentMonth = 0;

            currentYear++;

        }


        renderPlanner();

    }
);


// =====================================
// RENDER PLANNER
// =====================================

function renderPlanner() {

    renderCalendar();

    renderSelectedDate();

    renderPlanList();

    updatePlannerSummary();

}


// =====================================
// START PLANNER
// =====================================

renderPlanner();