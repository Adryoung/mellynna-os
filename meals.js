// =====================================
// DATA
// =====================================

let meals =
    JSON.parse(
        localStorage.getItem(
            'mellynnaMealsV2'
        )
    ) || [];


let recipes =
    JSON.parse(
        localStorage.getItem(
            'mellynnaRecipesV2'
        )
    ) || [];


// =====================================
// EDIT MODE
// =====================================

let editingMealIndex = null;

let editingRecipeIndex = null;


// =====================================
// MEAL ELEMENTS
// =====================================

const showMealForm =
    document.getElementById(
        'show-meal-form'
    );

const mealForm =
    document.getElementById(
        'meal-form'
    );

const mealFormTitle =
    document.getElementById(
        'meal-form-title'
    );

const mealDay =
    document.getElementById(
        'meal-day'
    );

const mealName =
    document.getElementById(
        'meal-name'
    );

const mealNotes =
    document.getElementById(
        'meal-notes'
    );

const cancelMeal =
    document.getElementById(
        'cancel-meal'
    );

const saveMealButton =
    document.getElementById(
        'save-meal'
    );

const mealList =
    document.getElementById(
        'meal-list'
    );

const mealCount =
    document.getElementById(
        'meal-count'
    );


// =====================================
// RECIPE ELEMENTS
// =====================================

const showRecipeForm =
    document.getElementById(
        'show-recipe-form'
    );

const recipeForm =
    document.getElementById(
        'recipe-form'
    );

const recipeFormTitle =
    document.getElementById(
        'recipe-form-title'
    );

const recipeName =
    document.getElementById(
        'recipe-name'
    );

const recipeIngredients =
    document.getElementById(
        'recipe-ingredients'
    );

const recipeSteps =
    document.getElementById(
        'recipe-steps'
    );

const cancelRecipe =
    document.getElementById(
        'cancel-recipe'
    );

const saveRecipeButton =
    document.getElementById(
        'save-recipe'
    );

const recipeList =
    document.getElementById(
        'recipe-list'
    );

const recipeCount =
    document.getElementById(
        'recipe-count'
    );


// =====================================
// SAVE DATA
// =====================================

function saveMeals() {

    localStorage.setItem(
        'mellynnaMealsV2',
        JSON.stringify(meals)
    );

}


function saveRecipes() {

    localStorage.setItem(
        'mellynnaRecipesV2',
        JSON.stringify(recipes)
    );

}


// =====================================
// RESET MEAL FORM
// =====================================

function resetMealForm() {

    mealDay.value = '';

    mealName.value = '';

    mealNotes.value = '';

    editingMealIndex = null;

    mealFormTitle.textContent =
        'Add Meal';

    saveMealButton.textContent =
        'Save Meal';

}


// =====================================
// RESET RECIPE FORM
// =====================================

function resetRecipeForm() {

    recipeName.value = '';

    recipeIngredients.value = '';

    recipeSteps.value = '';

    editingRecipeIndex = null;

    recipeFormTitle.textContent =
        'Add Recipe';

    saveRecipeButton.textContent =
        'Save Recipe';

}


// =====================================
// UPDATE COUNTERS
// =====================================

function updateMealCounters() {

    mealCount.textContent =
        meals.length;

    recipeCount.textContent =
        recipes.length;

}


// =====================================
// RENDER MEALS
// =====================================

function renderMeals() {

    mealList.innerHTML = '';


    if (meals.length === 0) {

        const empty =
            document.createElement(
                'div'
            );

        empty.className =
            'empty-state';

        empty.innerHTML = `
            <h3>No meals planned yet</h3>

            <p>
                Click + Add Meal to start planning.
            </p>
        `;

        mealList.appendChild(
            empty
        );

        return;

    }


    meals.forEach(
        function (meal, index) {

            const item =
                document.createElement(
                    'div'
                );

            item.className =
                'meal-item';


            item.innerHTML = `

                <div class="meal-details">

                    <div class="meal-day">
                        ${meal.day}
                    </div>

                    <h3>
                        ${meal.name}
                    </h3>

                    ${
                        meal.notes
                            ? `
                                <p class="meal-notes">
                                    ${meal.notes}
                                </p>
                            `
                            : ''
                    }

                </div>


                <div class="item-actions">

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

            item
                .querySelector(
                    '.edit-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        editingMealIndex =
                            index;


                        mealDay.value =
                            meal.day;


                        mealName.value =
                            meal.name;


                        mealNotes.value =
                            meal.notes || '';


                        mealFormTitle.textContent =
                            'Edit Meal';


                        saveMealButton.textContent =
                            'Save Changes';


                        mealForm.classList.remove(
                            'hidden'
                        );


                        mealForm.scrollIntoView({
                            behavior: 'smooth'
                        });

                    }
                );


            // DELETE

            item
                .querySelector(
                    '.delete-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        const confirmDelete =
                            confirm(
                                'Delete "' +
                                meal.name +
                                '"?'
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        meals.splice(
                            index,
                            1
                        );


                        saveMeals();

                        renderAllMealsData();

                    }
                );


            mealList.appendChild(
                item
            );

        }
    );

}


// =====================================
// RENDER RECIPES
// =====================================

function renderRecipes() {

    recipeList.innerHTML = '';


    if (
        recipes.length === 0
    ) {

        const empty =
            document.createElement(
                'div'
            );

        empty.className =
            'empty-state';

        empty.innerHTML = `
            <h3>No recipes saved yet</h3>

            <p>
                Save your first recipe for later.
            </p>
        `;

        recipeList.appendChild(
            empty
        );

        return;

    }


    recipes.forEach(
        function (recipe, index) {

            const card =
                document.createElement(
                    'div'
                );

            card.className =
                'recipe-card';


            card.innerHTML = `

                <div class="recipe-content">

                    <h3>
                        ${recipe.name}
                    </h3>


                    <div class="recipe-section">

                        <strong>
                            Ingredients
                        </strong>

                        <p>
                            ${recipe.ingredients}
                        </p>

                    </div>


                    <div class="recipe-section">

                        <strong>
                            Steps
                        </strong>

                        <p>
                            ${recipe.steps}
                        </p>

                    </div>

                </div>


                <div class="item-actions">

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

            card
                .querySelector(
                    '.edit-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        editingRecipeIndex =
                            index;


                        recipeName.value =
                            recipe.name;


                        recipeIngredients.value =
                            recipe.ingredients;


                        recipeSteps.value =
                            recipe.steps;


                        recipeFormTitle.textContent =
                            'Edit Recipe';


                        saveRecipeButton.textContent =
                            'Save Changes';


                        recipeForm.classList.remove(
                            'hidden'
                        );


                        recipeForm.scrollIntoView({
                            behavior: 'smooth'
                        });

                    }
                );


            // DELETE

            card
                .querySelector(
                    '.delete-button'
                )
                .addEventListener(
                    'click',
                    function () {

                        const confirmDelete =
                            confirm(
                                'Delete recipe "' +
                                recipe.name +
                                '"?'
                            );


                        if (
                            !confirmDelete
                        ) {

                            return;

                        }


                        recipes.splice(
                            index,
                            1
                        );


                        saveRecipes();

                        renderAllMealsData();

                    }
                );


            recipeList.appendChild(
                card
            );

        }
    );

}


// =====================================
// SHOW MEAL FORM
// =====================================

showMealForm.addEventListener(
    'click',
    function () {

        resetMealForm();

        mealForm.classList.remove(
            'hidden'
        );

        mealDay.focus();

    }
);


// =====================================
// CANCEL MEAL
// =====================================

cancelMeal.addEventListener(
    'click',
    function () {

        resetMealForm();

        mealForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// SAVE MEAL
// =====================================

saveMealButton.addEventListener(
    'click',
    function () {

        const day =
            mealDay
                .value
                .trim();

        const name =
            mealName
                .value
                .trim();

        const notes =
            mealNotes
                .value
                .trim();


        if (
            day === '' ||
            name === ''
        ) {

            alert(
                'Please enter the day and meal name.'
            );

            return;

        }


        if (
            editingMealIndex ===
            null
        ) {

            meals.push({

                id:
                    Date.now(),

                day:
                    day,

                name:
                    name,

                notes:
                    notes,

                createdAt:
                    new Date()
                        .toISOString()

            });

        } else {

            const currentMeal =
                meals[
                    editingMealIndex
                ];


            meals[
                editingMealIndex
            ] = {

                ...currentMeal,

                day:
                    day,

                name:
                    name,

                notes:
                    notes

            };

        }


        saveMeals();

        resetMealForm();

        mealForm.classList.add(
            'hidden'
        );

        renderAllMealsData();

    }
);


// =====================================
// SHOW RECIPE FORM
// =====================================

showRecipeForm.addEventListener(
    'click',
    function () {

        resetRecipeForm();

        recipeForm.classList.remove(
            'hidden'
        );

        recipeName.focus();

    }
);


// =====================================
// CANCEL RECIPE
// =====================================

cancelRecipe.addEventListener(
    'click',
    function () {

        resetRecipeForm();

        recipeForm.classList.add(
            'hidden'
        );

    }
);


// =====================================
// SAVE RECIPE
// =====================================

saveRecipeButton.addEventListener(
    'click',
    function () {

        const name =
            recipeName
                .value
                .trim();

        const ingredients =
            recipeIngredients
                .value
                .trim();

        const steps =
            recipeSteps
                .value
                .trim();


        if (
            name === ''
        ) {

            alert(
                'Please enter a recipe name.'
            );

            recipeName.focus();

            return;

        }


        if (
            editingRecipeIndex ===
            null
        ) {

            recipes.push({

                id:
                    Date.now(),

                name:
                    name,

                ingredients:
                    ingredients,

                steps:
                    steps,

                createdAt:
                    new Date()
                        .toISOString()

            });

        } else {

            const currentRecipe =
                recipes[
                    editingRecipeIndex
                ];


            recipes[
                editingRecipeIndex
            ] = {

                ...currentRecipe,

                name:
                    name,

                ingredients:
                    ingredients,

                steps:
                    steps

            };

        }


        saveRecipes();

        resetRecipeForm();

        recipeForm.classList.add(
            'hidden'
        );

        renderAllMealsData();

    }
);


// =====================================
// RENDER ALL
// =====================================

function renderAllMealsData() {

    updateMealCounters();

    renderMeals();

    renderRecipes();

}


// =====================================
// START
// =====================================

renderAllMealsData();