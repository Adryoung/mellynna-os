// ========================================
// MELLYNNA OS
// SUPABASE AUTHENTICATION
// ========================================


// ----------------------------------------
// ELEMENTS
// ----------------------------------------

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const loginButton =
    document.getElementById("login-button");

const loginMessage =
    document.getElementById("login-message");


// ----------------------------------------
// SHOW MESSAGE
// ----------------------------------------

function showMessage(message, type = "error") {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent = message;

    loginMessage.className =
        type === "success"
            ? "login-message success"
            : "login-message error";
}


// ----------------------------------------
// LOGIN
// ----------------------------------------

async function loginUser() {

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;


    // VALIDATION

    if (!email || !password) {

        showMessage(
            "Please enter your email and password."
        );

        return;
    }


    // BUTTON LOADING STATE

    loginButton.disabled = true;

    loginButton.textContent =
        "Signing in...";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        // LOGIN ERROR

        if (error) {

            showMessage(
                error.message
            );

            return;
        }


        // LOGIN SUCCESS

        if (data.session) {

            showMessage(
                "Login successful.",
                "success"
            );


            window.location.href =
                "home.html";
        }


    } catch (error) {

        console.error(
            "Login error:",
            error
        );


        showMessage(
            "Unable to connect to Mellynna OS."
        );

    } finally {

        loginButton.disabled = false;

        loginButton.textContent =
            "Sign In";

    }

}


// ----------------------------------------
// LOGIN BUTTON
// ----------------------------------------

loginButton.addEventListener(
    "click",
    loginUser
);


// ----------------------------------------
// PRESS ENTER TO LOGIN
// ----------------------------------------

passwordInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            loginUser();

        }

    }
);


// ----------------------------------------
// CHECK EXISTING SESSION
// ----------------------------------------

async function checkSession() {

    try {

        const {
            data
        } =
            await supabaseClient
                .auth
                .getSession();


        if (data.session) {

            window.location.href =
                "home.html";

        }

    } catch (error) {

        console.error(
            "Session check error:",
            error
        );

    }

}


// ----------------------------------------
// START
// ----------------------------------------

checkSession();