async function updateWorkCount() {

    const {
        data: { user },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        console.error("User error:", userError);
        return;
    }

    const {
        data,
        error
    } = await supabaseClient
        .from("work_tasks")
        .select("id, completed")
        .eq("user_id", user.id)
        .eq("completed", false);

    if (error) {
        console.error(
            "Work count error:",
            error
        );
        return;
    }

    document.getElementById(
        "work-count"
    ).textContent =
        data.length;
}