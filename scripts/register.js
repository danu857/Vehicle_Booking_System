// THEME TOGGLE
const themeToggle = document.getElementById("themeBtn");

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode"))
    {
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
    }
    else
    {
        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
    }
});

$(document).ready(function () {
    $("#name,#email,#phone,#address,#password,#confirmPassword")
        .on("input", function () {
            const fieldId = $(this).attr("id");
            $("#" + fieldId + "Error").text("");
        });

    // PASSWORD VISIBILITY TOGGLE
    $("#togglePassword").click(function () {

        const passwordField = $("#password");
        const icon = $(this).find("i");

        if (passwordField.attr("type") === "password") 
        {
            passwordField.attr("type", "text");
            icon.removeClass("bi-eye-fill");
            icon.addClass("bi-eye-slash-fill");

        } 
        else 
        {
            passwordField.attr("type", "password");
            icon.removeClass("bi-eye-slash-fill");
            icon.addClass("bi-eye-fill");
        }
    });

    $("#toggleConfirmPassword").click(function () {
        const passwordField = $("#confirmPassword");
        const icon = $(this).find("i");
        if (passwordField.attr("type") === "password") 
        {
            passwordField.attr("type", "text");

            icon.removeClass("bi-eye-fill");
            icon.addClass("bi-eye-slash-fill");

        } 
        else
        {
            passwordField.attr("type", "password");
            icon.removeClass("bi-eye-slash-fill");
            icon.addClass("bi-eye-fill");
        }
    });

    // REGISTRATION FORM VALIDATION
    $("#registerBtn").click(function (e) {
        e.preventDefault();

        let isValid = true;

        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const phone = $("#phone").val().trim();
        const address = $("#address").val().trim();
        const password = $("#password").val().trim();
        const confirmPassword = $("#confirmPassword").val().trim();

        $(".text-danger").text("");

        // Name Validation
        if (name === "") {
            $("#nameError").text("Name is required");
            isValid = false;
        }
        else if (!/^[A-Za-z ]+$/.test(name)) {
            $("#nameError").text("Only alphabets allowed");
            isValid = false;
        }

        // Email Validation
        if (email === "") {
            $("#emailError").text("Email is required");
            isValid = false;
        }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            $("#emailError").text("Enter valid email");
            isValid = false;
        }

        // Phone Validation
        if (phone === "") {
            $("#phoneError").text("Phone number is required");
            isValid = false;
        }
        else if (!/^[6-9][0-9]{9}$/.test(phone)) {
            $("#phoneError").text("Enter valid 10 digit mobile number");
            isValid = false;
        }

        // Address Validation
        if (address === "") {
            $("#addressError").text("Address is required");
            isValid = false;
        }

        // Password Validation
        const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (password === "") {
            $("#passwordError").text("Password is required");
            isValid = false;
        }
        else if (!passwordRegex.test(password)) {
            $("#passwordError").text(
                "Min 8 chars, 1 uppercase, 1 number & 1 special character"
            );
            isValid = false;
        }

        // Confirm Password Validation
        if (confirmPassword === "") {
            $("#confirmPasswordError").text("Confirm Password is required");
            isValid = false;
        }
        else if (password !== confirmPassword) {
            $("#confirmPasswordError").text("Passwords do not match");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        saveUser();

    });

});

async function saveUser() {

    const user = {

        name: $("#name").val().trim(),

        email: $("#email").val().trim(),

        phone: $("#phone").val().trim(),

        address: $("#address").val().trim(),

        password: $("#password").val().trim(),

        role: "customer"
    };

    try {

        // Check if server is running

        const checkResponse = await fetch(
            `http://localhost:3000/users?email=${user.email}`
        );

        if (!checkResponse.ok) {
            throw new Error("Server Error");
        }

        const existingUsers = await checkResponse.json();

        if (existingUsers.length > 0) {

            $("#emailError").text("Email already exists");

            return;
        }

        // Save user

        const response = await fetch(
            "http://localhost:3000/users",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(user)
            }
        );

        if (!response.ok) {
            throw new Error("Unable to register");
        }

        const savedUser = await response.json();

        // Local Storage Backup

        let users =
            JSON.parse(localStorage.getItem("users")) || [];

        users.push(savedUser);

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );

        await Swal.fire({
            icon: "success",
            title: "Registration Successful",
            text: "Your account has been created successfully.",
            timer:1500,
            confirmButtonText: "Go to Login"
        });
        setTimeout(()=>{
            window.location.href = "../pages/index.html";

        },2000);

    }
    catch (error) 
    {
        await Swal.fire({
            icon: "error",
            title: "Server Error",
            text: "JSON Server is not running."
        });

        console.error(error);
    }

}