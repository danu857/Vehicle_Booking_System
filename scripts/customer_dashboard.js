const API_URL = "http://localhost:3000/bookings";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
let bookings = [];
let currentView = "active";
let currentSearch = "";

if(!currentUser) 
{
    window.location.href = "/pages/login.html";
}

const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const bookingContainer = document.getElementById("bookingContainer");
const totalBookings = document.getElementById("totalBookings");
const pendingBookings = document.getElementById("pendingBookings");
const acceptedBookings = document.getElementById("acceptedBookings");
const completedBookings = document.getElementById("completedBookings");
const activeTab = document.getElementById("activeTab");
const historyTab = document.getElementById("historyTab");
const searchBooking = document.getElementById("searchBooking");
const bookingForm = document.getElementById("bookingForm");
const bookingModalElement = document.getElementById("bookingModal");
const detailsModalElement = document.getElementById("detailsModal");
const bookingModal = new bootstrap.Modal(bookingModalElement);
const detailsModal = new bootstrap.Modal(detailsModalElement);

// CHECK USER LOGIN
welcomeUser.textContent=`Welcome, ${currentUser.name}`;

// LOGIN GREETING
function showLoginGreeting() {

    // Unique key for each customer
    const loginKey = `loginCount_${currentUser.id}`;
    let loginCount = Number(localStorage.getItem(loginKey)) || 0;
    loginCount++;

    localStorage.setItem(loginKey, loginCount);
    if (loginCount === 1) {
        Swal.fire({
            icon: "success",
            title: `Welcome, ${currentUser.name}!`,
            html: `
                <h5>Your account is ready.</h5>
                <p>Thank you for choosing our Vehicle Service Booking System.</p>
                <p>We hope you have a great experience!</p>
            `,
            confirmButtonText: "Let's Go"
        });
    }
    else if (loginCount === 5) {
        Swal.fire({
            icon: "info",
            title: "Great to See You Again!",
            html: `
                <h5>Hi ${currentUser.name},</h5>
                <p>You've visited us <b>5 times</b>.</p>
                <p>Thank you for trusting our service.</p>
                <p>We appreciate your continued support!</p>
            `,
            confirmButtonText: "Continue"
        });

    }
    else if (loginCount === 10) 
    {
        Swal.fire({
            icon: "success",
            title: "You're One of Our Valued Customers",
            html: `
                <h5>Welcome back, ${currentUser.name}!</h5>
                <p>This is your <b>10th login</b>.</p>
                <p>Your continued trust means a lot to us.</p>
                <p>We look forward to serving you for many more journeys.</p>
            `,
            confirmButtonText: "Thank You!"
        });
    }
}

const today = new Date();
// SET MINIMUM BOOKING DATE

today.setMinutes(today.getMinutes()-today.getTimezoneOffset());

document.getElementById("bookingDate").min=today.toISOString().slice(0,16);

// LOAD SAVED THEME
const savedTheme = localStorage.getItem("theme") || "light";

document.body.classList.remove("light-mode", "dark-mode");
document.body.classList.add(savedTheme);

if (savedTheme === "dark-mode") {
    themeIcon.classList.remove("bi-moon-stars-fill");
    themeIcon.classList.add("bi-sun-fill");
}
else {
    themeIcon.classList.remove("bi-sun-fill");
    themeIcon.classList.add("bi-moon-stars-fill");
}
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        themeIcon.classList.remove("bi-moon-stars-fill");
        themeIcon.classList.add("bi-sun-fill");
        localStorage.setItem("theme", "dark-mode");
    }
    else {

        themeIcon.classList.remove("bi-sun-fill");
        themeIcon.classList.add("bi-moon-stars-fill");
        localStorage.setItem("theme", "light-mode");
    }

})

//LOGOUT BUTTON
logoutBtn.addEventListener("click", async () => {

    const result = await Swal.fire({
        title: "Logout?",
        text: "Are you sure you want to logout?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Logout",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#dc3545",
        cancelButtonColor: "#6c757d",
        reverseButtons: true
    });

    if (result.isConfirmed) {

        localStorage.removeItem("currentUser");
        localStorage.removeItem("role");

        await Swal.fire({
            icon: "success",
            title: "Logged Out",
            text: "You have been logged out successfully.",
            timer: 1500,
            showConfirmButton: false
        });

        window.location.href = "/pages/login.html";
    }
});

//LOAD BOOKINGS FUNCTION
document.getElementById("service").addEventListener("change", function(){
    const selectedOption=this.options[this.selectedIndex];
    document.getElementById("amount").value=selectedOption.dataset.price || "";
});
loadBookings();

async function loadBookings() {
    try {
        const response = await fetch(
            `${API_URL}?userId=${currentUser.id}`
        );

        bookings = await response.json();
        updateStatistics();
        renderBookings();
        loadProfile();
        showLoginGreeting();
    }

    catch (error) {
        console.error(error);
        Swal.fire({
            icon: "error",
            title: "Unable to load bookings"
        });
    }
}

//STAT CARDS FUNCTION
function updateStatistics() {
    totalBookings.textContent=bookings.length;
    document.getElementById("totalServices").textContent =bookings.length;
    const totalAmount = bookings.reduce((sum, booking) => {return sum + Number(booking.amount);}, 0);
    document.getElementById("totalAmount").textContent ="₹" + totalAmount.toLocaleString("en-IN");
    pendingBookings.textContent=bookings.filter(booking => booking.status === "Pending").length;
    acceptedBookings.textContent =bookings.filter(booking => booking.status === "Accepted").length;
    completedBookings.textContent =bookings.filter(booking => booking.status === "Completed").length;
}

// RENDER BOOKINGS
function renderBookings() {
    bookingContainer.innerHTML = "";
    let filteredBookings = [...bookings];

if (currentView === "active") 
{
    filteredBookings = filteredBookings.filter(booking =>booking.status === "Pending" ||booking.status === "Accepted");
}
else 
{
    filteredBookings = filteredBookings.filter(booking =>booking.status === "Completed" ||booking.status === "Rejected");
}

if (currentSearch !== "") 
{
    filteredBookings = filteredBookings.filter(booking =>
        booking.vehicleNumber.toLowerCase().includes(currentSearch)||
        booking.service.toLowerCase().includes(currentSearch)
    );
}

    if (filteredBookings.length === 0) 
    {
        bookingContainer.innerHTML =
        `
        <div class="col-12">
            <div class="empty-card">
                No Bookings Found
            </div>
        </div>
        `;
        return;
    }

    filteredBookings.forEach(booking => {
        let badgeClass = "";
        switch (booking.status) 
        {
            case "Pending":
                badgeClass = "badge-pending";
                break;

            case "Accepted":
                badgeClass = "badge-accepted";
                break;

            case "Completed":
                badgeClass = "badge-completed";
                break;

            case "Rejected":
                badgeClass = "badge-rejected";
                break;
        }

        bookingContainer.innerHTML += `
        <div class="col-lg-4 col-md-6">
            <div class="card booking-card" data-id="${booking.id}">
                <div class="card-body">
                    <h5>${booking.service}</h5>
                    <p><strong>Vehicle :</strong>${booking.vehicleNumber}</p>
                    <p><strong>Date :</strong>${new Date(booking.bookingDate).toLocaleString()}</p>

                    <span class="badge ${badgeClass}">${booking.status}</span>

                    ${
                        booking.status === "Rejected"
                        ? `
                            <div class="alert alert-danger mt-3 mb-0">
                                <strong>Reason:</strong><br>
                                ${booking.rejectReason || "Not Provided"}
                                <hr>

                                <strong>Suggested Date:</strong><br>
                                ${
                                    booking.suggestedDate
                                    ? new Date(booking.suggestedDate).toLocaleDateString()
                                    : "-"
                                }

                                <br><br>

                                <strong>Suggested Time:</strong><br>
                                ${booking.suggestedTime || "-"}

                            </div>
                        `
                        : ""
                    }
                </div>
            </div>
        </div>
        `;
    });
}

// TAB SWITCHING
activeTab.addEventListener("click", () => {
    currentView = "active";
    activeTab.classList.add("active");
    historyTab.classList.remove("active");
    renderBookings();
});


historyTab.addEventListener("click", () => {
    currentView = "history";
    historyTab.classList.add("active");
    activeTab.classList.remove("active");
    renderBookings();
});

// SEARCH BOOKINGS
searchBooking.addEventListener("input", function(){
    currentSearch =this.value.toLowerCase().trim();
    renderBookings();
});

// BOOKING FORM SUBMISSION

bookingForm.addEventListener("submit", async function(e){
    e.preventDefault();

    document.querySelectorAll(".text-danger").forEach(error=>error.textContent="");

    let valid=true;

    const id=document.getElementById("bookingId").value;
    const service=document.getElementById("service").value;
    const vehicleNumber=document.getElementById("vehicleNumber").value.trim();
    const vehicleType=document.getElementById("vehicleType").value;
    const bookingDate=document.getElementById("bookingDate").value;
    const amount=document.getElementById("amount").value;

    if(service==="")
    {
        document.getElementById("serviceError").textContent="Select a service";
        valid=false;
    }


    if(vehicleNumber==="")
    {
        document.getElementById("vehicleNumberError").textContent="Enter vehicle number";
        valid=false;
    }


    if(vehicleType==="")
    {
        document.getElementById("vehicleTypeError").textContent="Select vehicle type";
        valid=false;
    }

    if(bookingDate==="")
    {
        document.getElementById("bookingDateError").textContent="Select booking date";
        valid=false;
    }
    if (bookingDate !== "") 
    {
        const selectedDate = new Date(bookingDate);
        const currentDate = new Date();
        currentDate.setSeconds(0, 0);

        if (selectedDate < currentDate) 
        {
            document.getElementById("bookingDateError").textContent ="Past dates and time are not allowed";
            valid = false;
        }

    }

    if(!valid) return;

    const booking={
        userId:currentUser.id,
        customerName:currentUser.name,
        service,
        vehicleNumber,
        vehicleType,
        bookingDate,
        amount,
        status:"Pending",
        rejectReason: "",
        suggestedDate: "",
        suggestedTime: "",
        supportRemarks: "",
    };

    try{
        if(id===""){
            await fetch(API_URL,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(booking)
            });

            await Swal.fire({
                icon: "success",
                title: "Booking Added",
                text: "The booking has been added successfully.",
                confirmButtonText: "OK",
                allowOutsideClick: false
            });
        }

        else{
            booking.id=id;
            await fetch(`${API_URL}/${id}`,{
                method:"PUT",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(booking)
            });

            await Swal.fire({
                icon: "success",
                title: "Booking Updated",
                text: "The booking has been updated successfully.",
                confirmButtonText: "OK",
                allowOutsideClick: false
            });
        }

        bookingModal.hide();
        bookingForm.reset();
        document.getElementById("bookingId").value="";

        loadBookings();
    }

    catch{
        Swal.fire(
            "Error",
            "Server Error",
            "error"
        );
    }
});

async function editBooking(id){
    const response=await fetch(`${API_URL}/${id}`);

    const booking=await response.json();

    document.getElementById("bookingId").value=booking.id;
    document.getElementById("service").value=booking.service;
    document.getElementById("vehicleNumber").value=booking.vehicleNumber;
    document.getElementById("vehicleType").value=booking.vehicleType;
    document.getElementById("bookingDate").value=booking.bookingDate;
    document.getElementById("amount").value=booking.amount;
    bookingModal.show();
}

async function deleteBooking(id){
    const result=await Swal.fire({
        title:"Delete Booking?",
        icon:"warning",
        showCancelButton:true
    });

    if(!result.isConfirmed) return;

    await fetch(`${API_URL}/${id}`,{
        method:"DELETE"
    });


    Swal.fire(
        "Deleted",
        "",
        "success"
    );

    loadBookings();
}

// BOOKING CARD CLICK EVENT
bookingContainer.addEventListener("click", async function(e){
    const card = e.target.closest(".booking-card");
    if(!card) return;
    const id = card.dataset.id;
    showBookingDetails(id);
});


async function showBookingDetails(id){
    try{
        const response = await fetch(`${API_URL}/${id}`);
        const booking = await response.json();
        const detailsBody=document.getElementById("detailsBody");
        const detailsFooter=document.getElementById("detailsFooter");

        let badgeClass = "";

        switch(booking.status)
        {
            case "Pending":
                badgeClass = "badge-pending";
                break;

            case "Accepted":
                badgeClass = "badge-accepted";
                break;

            case "Completed":
                badgeClass = "badge-completed";
                break;

            case "Rejected":
                badgeClass = "badge-rejected";
                break;
        }

        detailsBody.innerHTML = `
            <div class="mb-3">
                <h4>${booking.service}</h4>
            </div>
            <hr>

            <p><strong>Vehicle Number :</strong>${booking.vehicleNumber}</p>
            <p><strong>Vehicle Type :</strong>${booking.vehicleType}</p>
            <p><strong>Booking Date :</strong>
                ${new Date(booking.bookingDate).toLocaleString()}
            </p>

            <p><strong>Amount :</strong>₹${booking.amount}</p>
            <p><strong>Status :</strong>
                <span class="badge ${badgeClass}">
                    ${booking.status}
                </span>
            </p>

            ${
                booking.status === "Rejected"
                ? `
                    <hr>
                    <div class="alert alert-danger">
                        <h6>Service Rejected</h6>
                        <p><strong>Reason:</strong>
                            ${booking.rejectReason || "Not Provided"}
                        </p>

                        <p><strong>Suggested Date:</strong>
                            ${
                                booking.suggestedDate
                                ? new Date(booking.suggestedDate).toLocaleDateString()
                                : "-"
                            }
                        </p>

                        <p><strong>Suggested Time:</strong>
                            ${booking.suggestedTime || "-"}
                        </p>
                    </div>
                `
                : ""
            }
        `;

        if(booking.status === "Pending")
        {
            detailsFooter.innerHTML = `
                <button class="btn btn-warning" id="editBookingBtn">
                    <i class="bi bi-pencil-square"></i>
                    Edit
                </button>

                <button class="btn btn-danger" id="deleteBookingBtn">
                    <i class="bi bi-trash"></i>
                    Delete
                </button>
            `;

            document.getElementById("editBookingBtn").addEventListener("click",()=>{
                detailsModal.hide();
                editBooking(id);
            });

            document.getElementById("deleteBookingBtn").addEventListener("click",async ()=>{
                detailsModal.hide();
                await deleteBooking(id);
            });
        }

        else
        {
            detailsFooter.innerHTML = `
                <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            `;
        }

        detailsModal.show();
    }

    catch{
        Swal.fire({
            icon:"error",
            title:"Unable to load booking"
        });
    }
}

function loadProfile() {
    document.getElementById("profileName").textContent =currentUser.name;
    document.getElementById("profileFullName").textContent =currentUser.name;
    document.getElementById("profileEmail").textContent =currentUser.email;
    document.getElementById("profilePhone").textContent =currentUser.phone;
    document.getElementById("profileId").textContent =currentUser.id;
    document.getElementById("profileBookings").textContent =bookings.length;
}