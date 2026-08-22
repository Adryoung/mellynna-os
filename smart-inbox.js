// ======================================================
// MELLYNNA OS - SMART INBOX
// ======================================================

let selectedDestination = null;


// ======================================================
// ELEMENTS
// ======================================================

const smartInput =
    document.getElementById("smart-input");

const characterCount =
    document.getElementById("character-count");

const analyseButton =
    document.getElementById("analyse-button");

const routingCard =
    document.getElementById("routing-card");

const destinationCards =
    document.querySelectorAll(".destination-card");

const selectedArea =
    document.getElementById("selected-area");

const selectedDestinationText =
    document.getElementById("selected-destination");

const saveSmartItemButton =
    document.getElementById("save-smart-item");

const recentCaptures =
    document.getElementById("recent-captures");


// ======================================================
// DESTINATION LABELS
// ======================================================

const destinationLabels = {

    work: "Work",
    personal: "Personal",
    planner: "Planner",
    grocery: "Grocery",
    expense: "Expense",
    meal: "Meal"

};


// ======================================================
// CHARACTER COUNTER
// ======================================================

smartInput.addEventListener(
    "input",
    function () {

        characterCount.textContent =
            `${smartInput.value.length} / 500`;

    }
);


// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;
}


// ======================================================
// GET CURRENT USER
// ======================================================

async function getCurrentUser() {

    const {
        data: { user },
        error
    } =
        await supabaseClient
            .auth
            .getUser();


    if (error) {

        console.error(
            "User error:",
            error
        );

        return null;
    }


    return user;
}


// ======================================================
// DATE HELPERS
// ======================================================

function formatDateKey(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );

    const day =
        String(
            date.getDate()
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


function getTodayDate() {

    return formatDateKey(
        new Date()
    );
}


function getTomorrowDate() {

    const date =
        new Date();

    date.setDate(
        date.getDate() + 1
    );

    return formatDateKey(
        date
    );
}


// ======================================================
// SIMPLE DATE DETECTION
// ======================================================

function detectDate(text) {

    const lowerText =
        text.toLowerCase();


    // TOMORROW / ESOK

    if (
        lowerText.includes("tomorrow") ||
        lowerText.includes("esok")
    ) {

        return getTomorrowDate();

    }


    // TODAY / HARI INI

    if (
        lowerText.includes("today") ||
        lowerText.includes("hari ini")
    ) {

        return getTodayDate();

    }


    // YYYY-MM-DD

    const isoMatch =
        text.match(
            /\b(\d{4})-(\d{2})-(\d{2})\b/
        );


    if (isoMatch) {

        return isoMatch[0];

    }


    // DD/MM/YYYY

    const localMatch =
        text.match(
            /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/
        );


    if (localMatch) {

        const day =
            String(
                localMatch[1]
            ).padStart(
                2,
                "0"
            );

        const month =
            String(
                localMatch[2]
            ).padStart(
                2,
                "0"
            );

        const year =
            localMatch[3];


        return (
            year +
            "-" +
            month +
            "-" +
            day
        );

    }


    return null;
}


// ======================================================
// AMOUNT DETECTION
// ======================================================

function detectAmount(text) {

    const match =
        text.match(
            /(?:RM\s*)?(\d+(?:\.\d{1,2})?)/i
        );


    if (!match) {

        return 0;

    }


    return Number(
        match[1]
    );
}


// ======================================================
// SIMPLE CATEGORY DETECTION
// ======================================================

function detectPersonalCategory(text) {

    const value =
        text.toLowerCase();


    if (
        value.includes("buy") ||
        value.includes("beli") ||
        value.includes("shopping")
    ) {

        return "Shopping";

    }


    if (
        value.includes("family") ||
        value.includes("keluarga")
    ) {

        return "Family";

    }


    if (
        value.includes("friend") ||
        value.includes("kawan")
    ) {

        return "Friends";

    }


    return "Other";
}


function detectExpenseCategory(text) {

    const value =
        text.toLowerCase();


    if (
        value.includes("grocery") ||
        value.includes("groceries") ||
        value.includes("barang dapur")
    ) {

        return "Grocery";

    }


    if (
        value.includes("food") ||
        value.includes("lunch") ||
        value.includes("dinner") ||
        value.includes("makan")
    ) {

        return "Food";

    }


    if (
        value.includes("petrol") ||
        value.includes("grab") ||
        value.includes("transport") ||
        value.includes("parking")
    ) {

        return "Transport";

    }


    if (
        value.includes("bill") ||
        value.includes("internet") ||
        value.includes("electric") ||
        value.includes("water")
    ) {

        return "Bills";

    }


    return "Other";
}


// ======================================================
// CONTINUE BUTTON
// ======================================================

analyseButton.addEventListener(
    "click",
    function () {

        const text =
            smartInput
                .value
                .trim();


        if (!text) {

            alert(
                "Write something first."
            );

            smartInput.focus();

            return;
        }


        routingCard.classList.remove(
            "hidden"
        );


        routingCard.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }
);


// ======================================================
// SELECT DESTINATION
// ======================================================

destinationCards.forEach(
    function (card) {

        card.addEventListener(
            "click",
            function () {

                destinationCards.forEach(
                    function (item) {

                        item.classList.remove(
                            "selected"
                        );

                    }
                );


                card.classList.add(
                    "selected"
                );


                selectedDestination =
                    card.dataset.destination;


                const label =
                    destinationLabels[
                        selectedDestination
                    ];


                selectedDestinationText.textContent =
                    label;


                saveSmartItemButton.textContent =
                    `Send to ${label} →`;


                selectedArea.classList.remove(
                    "hidden"
                );

            }
        );

    }
);


// ======================================================
// ROUTE TO WORK
// ======================================================

async function sendToWork(
    user,
    text
) {

    const dueDate =
        detectDate(text);


    const {
        error
    } =
        await supabaseClient
            .from("work_tasks")
            .insert({

                user_id:
                    user.id,

                name:
                    text,

                due_date:
                    dueDate,

                notes:
                    "Added from Smart Inbox",

                completed:
                    false

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// ROUTE TO PERSONAL
// ======================================================

async function sendToPersonal(
    user,
    text
) {

    const dueDate =
        detectDate(text);


    const {
        error
    } =
        await supabaseClient
            .from("personal_tasks")
            .insert({

                user_id:
                    user.id,

                name:
                    text,

                due_date:
                    dueDate,

                category:
                    detectPersonalCategory(
                        text
                    ),

                notes:
                    "Added from Smart Inbox",

                completed:
                    false

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// ROUTE TO PLANNER
// ======================================================

async function sendToPlanner(
    user,
    text
) {

    const planDate =
        detectDate(text) ||
        getTodayDate();


    const {
        error
    } =
        await supabaseClient
            .from("plans")
            .insert({

                user_id:
                    user.id,

                name:
                    text,

                plan_date:
                    planDate,

                type:
                    "Personal",

                notes:
                    "Added from Smart Inbox"

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// ROUTE TO GROCERY
// ======================================================

async function sendToGrocery(
    user,
    text
) {

    const {
        error
    } =
        await supabaseClient
            .from("grocery_items")
            .insert({

                user_id:
                    user.id,

                name:
                    text,

                category:
                    "Other",

                quantity:
                    null,

                purchased:
                    false

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// ROUTE TO EXPENSE
// ======================================================

async function sendToExpense(
    user,
    text
) {

    const amount =
        detectAmount(text);


    const expenseDate =
        detectDate(text) ||
        getTodayDate();


    const {
        error
    } =
        await supabaseClient
            .from("expenses")
            .insert({

                user_id:
                    user.id,

                name:
                    text,

                amount:
                    amount,

                category:
                    detectExpenseCategory(
                        text
                    ),

                expense_date:
                    expenseDate,

                notes:
                    "Added from Smart Inbox"

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// ROUTE TO MEAL
// ======================================================

async function sendToMeal(
    user,
    text
) {

    const {
        error
    } =
        await supabaseClient
            .from("meals")
            .insert({

                user_id:
                    user.id,

                day:
                    detectDate(text) ||
                    getTodayDate(),

                name:
                    text,

                notes:
                    "Added from Smart Inbox"

            });


    if (error) {

        throw error;

    }
}


// ======================================================
// RECENT CAPTURES
// ======================================================

function getRecentStorageKey(
    userId
) {

    return (
        "mellynnaSmartCaptures_" +
        userId
    );
}


function getRecentCaptures(
    userId
) {

    const saved =
        localStorage.getItem(
            getRecentStorageKey(
                userId
            )
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(
            saved
        );

    } catch {

        return [];

    }
}


function saveRecentCapture(
    userId,
    text,
    destination
) {

    const captures =
        getRecentCaptures(
            userId
        );


    captures.unshift({

        id:
            Date.now(),

        text:
            text,

        destination:
            destinationLabels[
                destination
            ],

        createdAt:
            new Date()
                .toISOString()

    });


    const limited =
        captures.slice(
            0,
            10
        );


    localStorage.setItem(

        getRecentStorageKey(
            userId
        ),

        JSON.stringify(
            limited
        )

    );
}


// ======================================================
// DISPLAY RECENT CAPTURES
// ======================================================

async function renderRecentCaptures() {

    const user =
        await getCurrentUser();


    if (!user) {

        return;

    }


    const captures =
        getRecentCaptures(
            user.id
        );


    recentCaptures.innerHTML =
        "";


    if (
        captures.length === 0
    ) {

        recentCaptures.innerHTML = `

            <div class="empty-state">

                <span>
                    ✨
                </span>

                <h3>
                    Your inbox is clear
                </h3>

                <p>
                    Capture something above
                    to get started.
                </p>

            </div>

        `;


        return;
    }


    captures.forEach(
        function (capture) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "capture-item";


            const date =
                new Date(
                    capture.createdAt
                );


            item.innerHTML = `

                <div class="capture-content">

                    <h3>
                        ${escapeHTML(
                            capture.text
                        )}
                    </h3>

                    <p>
                        Sent to
                        <strong>
                            ${escapeHTML(
                                capture.destination
                            )}
                        </strong>
                    </p>

                </div>

                <small>
                    ${date.toLocaleString(
                        "en-MY"
                    )}
                </small>

            `;


            recentCaptures.appendChild(
                item
            );

        }
    );
}


// ======================================================
// SEND SMART ITEM
// ======================================================

saveSmartItemButton.addEventListener(
    "click",
    async function () {

        const text =
            smartInput
                .value
                .trim();


        if (
            !text ||
            !selectedDestination
        ) {

            return;

        }


        const user =
            await getCurrentUser();


        if (!user) {

            alert(
                "Your session has expired. Please login again."
            );


            window.location.replace(
                "login.html"
            );


            return;
        }


        saveSmartItemButton.disabled =
            true;


        saveSmartItemButton.textContent =
            "Sending...";


        try {

            if (
                selectedDestination ===
                "work"
            ) {

                await sendToWork(
                    user,
                    text
                );

            }


            else if (
                selectedDestination ===
                "personal"
            ) {

                await sendToPersonal(
                    user,
                    text
                );

            }


            else if (
                selectedDestination ===
                "planner"
            ) {

                await sendToPlanner(
                    user,
                    text
                );

            }


            else if (
                selectedDestination ===
                "grocery"
            ) {

                await sendToGrocery(
                    user,
                    text
                );

            }


            else if (
                selectedDestination ===
                "expense"
            ) {

                await sendToExpense(
                    user,
                    text
                );

            }


            else if (
                selectedDestination ===
                "meal"
            ) {

                await sendToMeal(
                    user,
                    text
                );

            }


            saveRecentCapture(
                user.id,
                text,
                selectedDestination
            );


            alert(
                `Sent to ${
                    destinationLabels[
                        selectedDestination
                    ]
                } successfully.`
            );


            smartInput.value =
                "";

            characterCount.textContent =
                "0 / 500";

            selectedDestination =
                null;


            destinationCards.forEach(
                function (card) {

                    card.classList.remove(
                        "selected"
                    );

                }
            );


            selectedArea.classList.add(
                "hidden"
            );


            routingCard.classList.add(
                "hidden"
            );


            await renderRecentCaptures();


        } catch (error) {

            console.error(
                "Smart Inbox error:",
                error
            );


            alert(
                "Unable to send this item. Check the browser Console for details."
            );


        } finally {

            saveSmartItemButton.disabled =
                false;

            saveSmartItemButton.textContent =
                "Send →";

        }

    }
);


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderRecentCaptures();

    }
);