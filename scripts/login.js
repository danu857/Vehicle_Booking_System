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


$(document).ready(function(){
    $("#email,#password").on("input",function(){
        const id=$(this).attr("id");
        $("#"+id+"Error").text("");
    });

    $("#togglePassword").click(function(){
        const password=$("#password");
        const icon=$(this).find("i");

        if(password.attr("type")==="password")
        {
            password.attr("type","text");
            icon.removeClass("bi-eye-fill");
            icon.addClass("bi-eye-slash-fill");
        }
        else
        {
            password.attr("type","password");
            icon.removeClass("bi-eye-slash-fill");
            icon.addClass("bi-eye-fill");
        }
    });

    $("#loginBtn").click(async function(e){
        e.preventDefault();

        let isValid=true;
        const email=$("#email").val().trim();
        const password=$("#password").val().trim();

        $(".text-danger").text("");
        if(email==="")
        {
            $("#emailError").text("Email is required");

            isValid=false;
        }

        if(password==="")
        {
            $("#passwordError").text("Password is required");

            isValid=false;
        }

        if(!isValid)
        {
            return;
        }

        if(email==="support@vehicleservice.com" && password==="support123")
        {
            localStorage.setItem(
                "role",
                "support"
            );

            window.location.href="/pages/service_dashboard.html";
            return;
        }

        try{
            const response=await fetch(`http://localhost:3000/users?email=${email}`);

            if(!response.ok)
            {
                throw new Error();
            }

            const users=await response.json();
            if(users.length===0)
            {
                $("#emailError").text("User not found");
        
                return;
            }

            const user=users[0];
            if(user.password!==password)
            {
                $("#passwordError").text("Incorrect password");
                return;
            }

            localStorage.setItem("currentUser",JSON.stringify(user));

            localStorage.setItem("role","customer");

            Swal.fire({
                icon:"success",
                title:"Login successful",
                timer:1500,
                showCongifuration:false
            }).then(()=>{
                window.location.href="/pages/customer_dashboard.html";
            });
        }
        catch(error)
        {
            Swal.fire({
                icon:"error",
                title:"Server Error",
                text:"JSON server is not running"
            });
        }
    });
});