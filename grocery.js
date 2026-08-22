// =====================================
// GROCERY DATA
// =====================================

let groceryItems =
    JSON.parse(
        localStorage.getItem(
            'mellynnaGroceryV2'
        )
    ) || [];


// =====================================
// EDIT MODE
// =====================================

let editingGroceryIndex = null;


// =====================================
// ELEMENTS
// =====================================

const showGroceryForm =
    document.getElementById(
        'show-grocery-form'
    );

const groceryForm =
    document.getElementById(
        'grocery-form'
    );

const groceryFormTitle =
    document.getElementById(
        'grocery-form-title'
    );

const groceryItemName =
    document.getElementById(
        'grocery-item-name'
    );

const groceryItemQuantity =
    document.getElementById(
        'grocery-item-quantity'
    );

const groceryItemCategory =
    document.getElementById(
        'grocery-item-category'
    );

const groceryItemPrice =
    document.getElementById(
        'grocery-item-price'
    );

const groceryItemNotes =
    document.getElementById(
        'grocery-item-notes'
    );

const cancelGroceryItem =
    document.getElementById(
        'cancel-grocery-item'
    );

const saveGroceryItemButton =
    document.getElementById(
        'save-grocery-item'
    );

const groceryList =
    document.getElementById(
        'grocery-list'
    );

const groceryItemCount =
    document.getElementById(
        'grocery-item-count'
    );

const groceryOpenCount =
    document.getElementById(
        'grocery-open-count'
    );

const groceryBoughtCount =
    document.getElementById(
        'grocery-bought-count'
    );

const groceryTotal =
    document.getElementById(
        'grocery-total'
    );


// =====================================
// SAVE GROCERY
// =====================================

function saveGroceryItems() {

    localStorage.setItem(
        'mellynnaGroceryV2',
        JSON.stringify(
            groceryItems
        )
    );

}


// =====================================
// RESET FORM
// =====================================

function resetGroceryForm() {

    groceryItemName.value = '';

    groceryItemQuantity.value = '';

    groceryItemCategory.value =
        'Vegetables';

    groceryItemPrice.value = '';

    groceryItemNotes.value = '';

    editingGroceryIndex = null;

    groceryFormTitle.textContent =
        'Add Grocery Item';

    saveGroceryItemButton.textContent =
        'Add Item';

}


// =====================================
// CATEGORY CLASS
// =====================================

function getGroceryCategoryClass(
    category
) {

    if (category === 'Vegetables') {
        return 'category-vegetables';
    }

    if (category === 'Meat') {
        return 'category-meat';
    }

    if (category === 'Dairy') {
        return 'category-dairy';
    }

    if (category === 'Pantry') {
        return 'category-pantry';
    }

    if (category === 'Household') {
        return 'category-household';
    }

    return 'category-other';

}


// =====================================
// UPDATE SUMMARY
// =====================================

function updateGrocerySummary() {

    const openItems =
        groceryItems.filter(
            function (item) {

                return !item.bought;

            }
        );


    const boughtItems =
        groceryItems.filter(
            function (item) {

                return item.bought;

            }
        );


    let total = 0;


    groceryItems.forEach(
        function (item) {

            total +=
                Number(
                    item.price || 0
                );

        }
    );


    groceryOpenCount.textContent =
        openItems.length;


    groceryBoughtCount.textContent =
        boughtItems.length;


    groceryTotal.textContent =
        'RM ' +
        total.toFixed(2);


    groceryItemCount.textContent =
        openItems.length +
        (
            openItems.length === 1
                ? ' Item'
                : ' Items'
        );

}


// =====================================
// SORT ITEMS
// =====================================

function sortGroceryItems() {

    groceryItems.sort(
        function (a, b) {

            // Not bought first
            if (
                a.bought !==
                b.bought
            ) {

                return (
                    a.bought
                        ? 1
                        : -1
                );

            }


            // Category
            const categoryCompare =
                (
                    a.category || ''
                ).localeCompare(
                    b.category || ''
                );


            if (
                categoryCompare !== 0
            ) {

                return categoryCompare;

            }


            // Name
            return (
                a.name || ''
            ).localeCompare(
                b.name || ''
            );

        }
    );

}


// =====================================
// RENDER GROCERY
// =====================================

function renderGroceryItems() {

    groceryList.innerHTML = '';


    sortGroceryItems();

    updateGrocerySummary();


    // EMPTY STATE

    if (
        groceryItems.length === 0
    ) {

        const emptyState =
            document.createElement(
                'div'
            );


        emptyState.className =
            'empty-state';


        emptyState.innerHTML = `
            <h3>
                Your grocery list is empty
            </h3>

            <p>
                Click + Add Item to start your shopping list.
            </p>
        `;


        groceryList.appendChild(
            emptyState
        );


        return;

    }


    groceryItems.forEach(
        function (item, index) {

            const itemElement =
                document.createElement(
                    'div'
                );


            itemElement.className =
                'grocery-item';


            if (item.bought) {

                itemElement.classList.add(
                    'bought'
                );

            }


            const categoryClass =
                getGroceryCategoryClass(
                    item.category
                );


            const price =
                Number(
                    item.price || 0
                );


            itemElement.innerHTML = `

                <input
                    type="checkbox"
                    ${item.bought ? 'checked' : ''}
                >


                <div class="grocery-details">

                    <h3>
                        ${item.name}
                    </h3>


                    <div class="grocery-meta">

                        <span
                            class="badge ${categoryClass}"
                        >
                            ${item.category}
                        </span>


                        ${
                            item.quantity
                                ? `
                                    <span>
                                        ${item.quantity}
                                    </span>
                                `
                                : ''
                        }


                        <span class="item-price">
                            RM ${price.toFixed(2)}
                        </span>

                    </div>


                    ${
                        item.notes
                            ? `
                                <p class="grocery-notes">
                                    ${item.notes}
                                </p>
                            `
                            : ''
                    }

                </div>


                <div class="grocery-actions">

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


            // ==========================
            // BOUGHT CHECKBOX
            // ==========================

            const checkbox =
                itemElement.querySelector(
                    'input[type="checkbox"]'
                );


            checkbox.addEventListener(
                'change',
                function () {

                    groceryItems[
                        index
                    ].bought =
                        checkbox.checked;


                    saveGroceryItems();

                    renderGroceryItems();

                }
            );


            // ==========================
            // EDIT
            // ==========================

            const editButton =
                itemElement.querySelector(
                    '.edit-button'
                );


            editButton.addEventListener(
                'click',
                function () {

                    editingGroceryIndex =
                        index;


                    groceryItemName.value =
                        item.name;


                    groceryItemQuantity.value =
                        item.quantity || '';


                    groceryItemCategory.value =
                        item.category || 'Other';


                    groceryItemPrice.value =
                        item.price || '';


                    groceryItemNotes.value =
                        item.notes || '';


                    groceryFormTitle.textContent =
                        'Edit Grocery Item';


                    saveGroceryItemButton.textContent =
                        'Save Changes';


                    groceryForm.classList.remove(
                        'hidden'
                    );


                    groceryForm.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });


                    groceryItemName.focus();

                }
            );


            // ==========================
            // DELETE
            // ==========================

            const deleteButton =
                itemElement.querySelector(
                    '.delete-button'
                );


            deleteButton.addEventListener(
                'click',
                function () {

                    const confirmDelete =
                        confirm(
                            'Delete "' +
                            item.name +
                            '"?'
                        );


                    if (
                        !confirmDelete
                    ) {

                        return;

                    }


                    groceryItems.splice(
                        index,
                        1
                    );


                    saveGroceryItems();

                    renderGroceryItems();

                }
            );


            groceryList.appendChild(
                itemElement
            );

        }
    );

}


// =====================================
// SHOW FORM
// =====================================

showGroceryForm.addEventListener(
    'click',
    function () {

        resetGroceryForm();


        groceryForm.classList.remove(
            'hidden'
        );


        groceryItemName.focus();

    }
);


// =====================================
// CANCEL FORM
// =====================================

cancelGroceryItem.addEventListener(
    'click',
    function () {

        resetGroceryForm();


        groceryForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// ADD / EDIT GROCERY ITEM
// =====================================

saveGroceryItemButton.addEventListener(
    'click',
    function () {

        const name =
            groceryItemName
                .value
                .trim();


        const quantity =
            groceryItemQuantity
                .value
                .trim();


        const category =
            groceryItemCategory
                .value;


        const price =
            Number(
                groceryItemPrice.value || 0
            );


        const notes =
            groceryItemNotes
                .value
                .trim();


        // Item name required

        if (
            name === ''
        ) {

            alert(
                'Please enter an item name.'
            );


            groceryItemName.focus();


            return;

        }


        // Price validation

        if (
            price < 0
        ) {

            alert(
                'Price cannot be negative.'
            );


            groceryItemPrice.focus();


            return;

        }


        // ==========================
        // ADD
        // ==========================

        if (
            editingGroceryIndex ===
            null
        ) {

            const newItem = {

                id:
                    Date.now(),

                name:
                    name,

                quantity:
                    quantity,

                category:
                    category,

                price:
                    price,

                notes:
                    notes,

                bought:
                    false,

                createdAt:
                    new Date()
                        .toISOString()

            };


            groceryItems.push(
                newItem
            );

        }


        // ==========================
        // EDIT
        // ==========================

        else {

            const currentItem =
                groceryItems[
                    editingGroceryIndex
                ];


            groceryItems[
                editingGroceryIndex
            ] = {

                ...currentItem,

                name:
                    name,

                quantity:
                    quantity,

                category:
                    category,

                price:
                    price,

                notes:
                    notes

            };

        }


        saveGroceryItems();


        renderGroceryItems();


        resetGroceryForm();


        groceryForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// START GROCERY
// =====================================

renderGroceryItems();