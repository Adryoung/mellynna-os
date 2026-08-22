async function protectPage() {

    const {
        data: { session },
        error
    } = await supabaseClient.auth.getSession();

    if (error) {
        console.error("Session error:", error);
        return;
    }

    if (!session) {
        window.location.replace("login.html");
    }
}


async function logoutUser() {

    const { error } =
        await supabaseClient.auth.signOut();

    if (error) {
        console.error("Logout error:", error);
        return;
    }

    window.location.replace("login.html");
}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        const logoutButton =
            document.getElementById("logoutBtn");

        if (logoutButton) {
            logoutButton.addEventListener(
                "click",
                logoutUser
            );
        }

        protectPage();
    }
);