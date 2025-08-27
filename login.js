document.addEventListener("DOMContentLoaded", () => {
    const adminUser = "Asma";
    const adminPass = "1234";

    const loginModal = document.getElementById("loginModal");
    const closeModal = document.getElementById("closeModal");
    const submitLogin = document.getElementById("submitLogin");
    const usernameInput = document.getElementById("usernameInput");
    const passwordInput = document.getElementById("passwordInput");

    const welcomeModal = document.getElementById("welcomeModal");
    const welcomeMessage = document.getElementById("welcomeMessage");
    const closeWelcome = document.getElementById("closeWelcome");

    const userDisplay = document.getElementById("userDisplay");
    const adminControlMenu = document.getElementById("adminControlMenu");
    const adminDropdown = document.getElementById("adminDropdown");

    const addStaffModal = document.getElementById("addStaffModal");
    const closeAddStaff = document.getElementById("closeAddStaff");
    const addStaffForm = document.getElementById("addStaffForm");
    const viewStaffBtn = document.getElementById("viewStaffBtn");

    const accountBtn = document.getElementById("accountBtn");
    const accountMenu = document.getElementById("accountMenu");
    const loginOption = document.getElementById("loginOption");
    const logoutOption = document.getElementById("logoutOption");

    // فتح وغلق المودالات
    closeModal?.addEventListener("click", () => loginModal.style.display = "none");
    closeWelcome?.addEventListener("click", () => welcomeModal.style.display = "none");
    closeAddStaff?.addEventListener("click", () => addStaffModal.style.display = "none");

    window.addEventListener("click", (e) => {
        if (e.target === addStaffModal) addStaffModal.style.display = "none";
        if (e.target !== accountBtn && e.target.closest("#accountMenu") === null) {
            accountMenu.style.display = "none";
        }
    });

    // Dropdown الحساب
    accountBtn?.addEventListener("click", () => {
        accountMenu.style.display = accountMenu.style.display === "block" ? "none" : "block";
    });

    loginOption?.addEventListener("click", () => {
        loginModal.style.display = "flex";
        accountMenu.style.display = "none";
    });

    logoutOption?.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("isAdmin");
        userDisplay.innerText = "";
        adminControlMenu.style.display = "none";
        adminDropdown.innerHTML = "";
        updateAccountMenu();
        accountMenu.style.display = "none";
    });

    // تسجيل الدخول
    submitLogin?.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (!username || !password) return;

        let isAdmin = (username === adminUser && password === adminPass);
        let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
        let staffUser = staffList.find(staff => 
            (staff.name === username || staff.email === username) && staff.password === password
        );

        if (!isAdmin && !staffUser) return;

        localStorage.setItem("loggedUser", isAdmin ? adminUser : staffUser.name);
        localStorage.setItem("isAdmin", isAdmin ? "true" : "false");

        loginModal.style.display = "none";
        usernameInput.value = "";
        passwordInput.value = "";

        userDisplay.innerText = `(Welcome ${isAdmin ? "Admin " + username : staffUser.name})`;
        userDisplay.style.fontSize = "12px";
        userDisplay.style.marginTop = "0.3rem";

        welcomeMessage.innerText = isAdmin 
            ? `Welcome, Admin ${username}!`
            : `Welcome, ${staffUser.name}!`;
        welcomeModal.style.display = "flex";
        setTimeout(() => welcomeModal.style.display = "none", 3000);

        updateAdminDropdown(isAdmin);
        updateAccountMenu();
    });

    // إضافة الموظفين
    addStaffForm?.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("staffName").value.trim();
        const email = document.getElementById("staffEmail").value.trim();
        const password = document.getElementById("staffPassword").value.trim();
        if (!name || !email || !password) return;

        let staffList = JSON.parse(localStorage.getItem("staffList")) || [];
        if (staffList.some(staff => staff.email === email)) return;

        staffList.push({ name, email, password });
        localStorage.setItem("staffList", JSON.stringify(staffList));
        addStaffModal.style.display = "none";
        addStaffForm.reset();
    });

    viewStaffBtn?.addEventListener("click", () => {
        window.location.href = "Login.html";
    });

    // تحديث واجهة الحساب
    function updateAccountMenu() {
        const currentUser = localStorage.getItem("loggedUser");
        const currentIsAdmin = localStorage.getItem("isAdmin") === "true";

        if (currentUser) {
            userDisplay.innerText = `(Welcome ${currentIsAdmin ? "Admin " + currentUser : currentUser})`;
            userDisplay.style.fontSize = "12px";
            userDisplay.style.marginTop = "0.3rem";
            loginOption.style.display = "none";
            logoutOption.style.display = "block";
            updateAdminDropdown(currentIsAdmin);
        } else {
            userDisplay.innerText = "";
            loginOption.style.display = "block";
            logoutOption.style.display = "none";
            adminControlMenu.style.display = "none";
            adminDropdown.innerHTML = "";
        }
    }

    // تحديث قائمة Admin Dropdown
    function updateAdminDropdown(isAdmin) {
        if (!isAdmin) {
            adminControlMenu.style.display = "none";
            adminDropdown.innerHTML = "";
            return;
        }

        adminControlMenu.style.display = "inline-block";
        adminDropdown.innerHTML = "";

        const adminOptions = [
            { text: "Add Staff", action: () => addStaffModal.style.display = "flex" },
            { text: "Manage Users", action: () => window.location.href = "manage_users.html" },
            { text: "Settings", action:() => window.location.href = "settings.html" }
        ];

        adminOptions.forEach(opt => {
            const li = document.createElement("li");
            li.style.listStyle = "none";


            const link = document.createElement("a");
            link.href = "javascript:void(0)";
            link.innerText = opt.text;
            Object.assign(link.style, {
                display: "block",
                padding: "10px",
                color: "#fff",
                whiteSpace: "nowrap", 
                textDecoration: "none",
                borderRadius: "5px"
            });

            link.addEventListener("mouseenter", () => link.style.backgroundColor = "#4e5a70");
            link.addEventListener("mouseleave", () => link.style.backgroundColor = "transparent");
            link.addEventListener("click", opt.action);

            li.appendChild(link);
            adminDropdown.appendChild(li);
        });
    }

    // إضافة hover مرة واحدة لتجنب التكرار
    if (!adminControlMenu.dataset.eventsAdded) {
        adminControlMenu.addEventListener("mouseenter", () => {
            adminDropdown.style.display = "block";
        });
        adminControlMenu.addEventListener("mouseleave", () => {
            adminDropdown.style.display = "none";
        });
        adminControlMenu.dataset.eventsAdded = "true";
    }

    updateAccountMenu();
});
