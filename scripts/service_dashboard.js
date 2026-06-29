const API_URL = "http://localhost:3000/bookings";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

// GLOBAL VARIABLES
let bookings = [];
let currentView = "active";
let currentSearch = "";
let currentDate = "";
let currentPage = 1;
const cardsPerPage = 6;
let currentStatus = "all";

// LOGIN CHECK
if (!currentUser || currentUser.role !== "support") {
    window.location.href = "/pages/login.html";
}

// GET HTML ELEMENTS
const welcomeSupport = document.getElementById("welcomeSupport");
const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");
const bookingContainer = document.getElementById("bookingContainer");
const totalBookings = document.getElementById("totalBookings");
const pendingBookings = document.getElementById("pendingBookings");
const acceptedBookings = document.getElementById("acceptedBookings");
const completedBookings = document.getElementById("completedBookings");
const searchBooking = document.getElementById("searchBooking");
const sortBookings = document.getElementById("sortBookings");
const statusFilter = document.getElementById("statusFilter");
const menuItems = document.querySelectorAll(".menu-item");
const bookingModal = new bootstrap.Modal(document.getElementById("bookingModal"));
const rejectModal = new bootstrap.Modal(document.getElementById("rejectModal"));

welcomeSupport.textContent =`Welcome, ${currentUser.email}`;

// THEME TOGGLE
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

// LOGOUT FUNCTION
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

        window.location.href = "../pages/login.html";
    }
});

// DASHBOARD MENU
menuItems.forEach(item => {
    item.addEventListener("click", () => {
        menuItems.forEach(menu =>
            menu.classList.remove("active")
        );

        item.classList.add("active");
        currentView = item.dataset.view;
        renderBookings();
    });
});

loadBookings();

// LOAD BOOKINGS
async function loadBookings(){
    try{
        const response = await fetch(API_URL);
        bookings = await response.json();
        updateStatistics();
        renderBookings();
    }

    catch(error){
        console.error(error);
        Swal.fire({
            icon:"error",
            title:"Unable to load bookings"
        });
    }
}

// UPDATE DASHBOARD STATISTICS
function updateStatistics(){
    totalBookings.textContent = bookings.length;
    pendingBookings.textContent =bookings.filter(booking => booking.status==="Pending").length;
    acceptedBookings.textContent =bookings.filter(booking => booking.status==="Accepted").length;
    completedBookings.textContent=bookings.filter(booking => booking.status==="Completed").length;
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

    // SEARCH FILTER
    if (currentSearch !== "") 
    {
        filteredBookings = filteredBookings.filter(booking =>booking.customerName.toLowerCase().includes(currentSearch)||
        booking.vehicleNumber.toLowerCase().includes(currentSearch)||
        booking.service.toLowerCase().includes(currentSearch));
    }

    // DATE FILTER
    if(currentDate !== "")
    {
        filteredBookings = filteredBookings.filter(booking =>booking.bookingDate.startsWith(currentDate));
    }

    // STATUS FILTER
    if (currentStatus !== "all") 
    {
        filteredBookings = filteredBookings.filter(booking => booking.status === currentStatus);
    }


    if (filteredBookings.length === 0) 
    {
        bookingContainer.innerHTML =
        `
            <div class="col-12">
                <div class="alert alert-warning text-center">
                    No Bookings Found
                </div>
            </div>
        `;
        return;
    }

    const totalPages = Math.ceil(filteredBookings.length / cardsPerPage);
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const pageBookings = filteredBookings.slice(start, end);

    pageBookings.forEach(booking => {
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
                    <div class="d-flex justify-content-between">
                        <h5>${booking.service}</h5>
                        <span class="badge ${badgeClass}">
                            ${booking.status}
                        </span>
                    </div>
                    <hr>
                    <p><strong>Customer :</strong>${booking.customerName}</p>
                    <p><strong>Vehicle :</strong>${booking.vehicleNumber}</p>
                    <p><strong>Type :</strong>${booking.vehicleType}</p>
                    <p><strong>Date :</strong>${new Date(booking.bookingDate).toLocaleString()}</p>
                    <p><strong>Amount :</strong>₹${booking.amount}</p>
                </div>
            </div>
        </div>
        `;
    });
    renderPagination(totalPages);
}

searchBooking.addEventListener("input", function () {
    currentSearch = this.value.toLowerCase().trim();
    renderBookings();
});

document.getElementById("dateFilter").addEventListener("change", function () {
    currentDate = this.value;
    currentPage = 1;
    renderBookings();
});

statusFilter.addEventListener("change", function () {
    currentStatus = this.value;
    renderBookings();
});

bookingContainer.addEventListener("click", function (e) {
    const card = e.target.closest(".booking-card");
    if (!card) return;

    showBookingDetails(card.dataset.id);
});

// SHOW BOOKING DETAILS
async function showBookingDetails(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const booking = await response.json();
        const details = document.getElementById("bookingDetails");
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

        let buttons = "";
        if(booking.status === "Pending")
        {
            buttons = `
                <button class="btn btn-success" onclick="acceptBooking('${booking.id}')">
                    Accept
                </button>

                <button class="btn btn-danger" onclick="openRejectModal('${booking.id}')">
                    Reject
                </button>
            `;
        }

        if (booking.status === "Accepted") 
        {
            buttons = `
                <button class="btn btn-primary"onclick="completeBooking('${booking.id}')">
                    Mark Completed
                </button>
            `;
        }

        details.innerHTML = `
            <h4 class="mb-3">${booking.service}</h4>

            <p><strong>Customer :</strong> ${booking.customerName}</p>
            <p><strong>Vehicle :</strong> ${booking.vehicleNumber}</p>
            <p><strong>Vehicle Type :</strong> ${booking.vehicleType}</p>
            <p><strong>Booking :</strong>
                ${new Date(booking.bookingDate).toLocaleString()}
            </p>
            <p><strong>Amount :</strong> ₹${booking.amount}</p>
            <p>
                <strong>Status :</strong>
                <span class="badge ${badgeClass}">${booking.status}</span>
            </p>
            ${
                booking.status === "Rejected"
                ?
                `<div class="alert alert-danger mt-3">
                        <strong>Reason</strong>
                        <br>
                        ${booking.rejectReason}
                        <hr>
                        <strong>Suggested Date</strong>
                        <br>

                        ${booking.suggestedDate}
                        <br><br>

                        <strong>Suggested Time</strong>
                        <br>

                        ${booking.suggestedTime}
                    </div>`
                :
                ""
            }

            <div class="mt-4">${buttons}</div>`;
        bookingModal.show();
    }

    catch {
        Swal.fire({
            icon: "error",
            title: "Unable to load booking"
        });
    }
}

// ACCEPT BOOKING
async function acceptBooking(id) {
    const booking = bookings.find(booking => booking.id === id);
    booking.status = "Accepted";
    booking.rejectReason = "";
    booking.suggestedDate = "";
    booking.suggestedTime = "";

    await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(booking)
    });

    bookingModal.hide();

    await Swal.fire({
        icon: "success",
        title: "Booking Accepted",
        text: "The booking has been accepted successfully.",
        confirmButtonText: "OK",
        allowOutsideClick: false
    });
    loadBookings();
}

// OPEN REJECT MODAL
function openRejectModal(id){
    bookingModal.hide();
    document.getElementById("rejectBookingId").value=id;
    document.getElementById("rejectReason").value="";
    document.getElementById("suggestedDate").value="";
    document.getElementById("suggestedTime").value="";
    rejectModal.show();
}

document.getElementById("confirmReject").addEventListener("click", rejectBooking);

// REJECT BOOKING
async function rejectBooking(){
    const id=document.getElementById("rejectBookingId").value;
    const reason=document.getElementById("rejectReason").value.trim();
    const date=document.getElementById("suggestedDate").value;

    const time=document.getElementById("suggestedTime").value;

    if(reason==="" || date==="" || time==="")
    {
        Swal.fire({
            icon:"warning",
            title:"Fill all fields"
        });
        return;
    }

    const booking=bookings.find(booking=>booking.id===id);

    booking.status="Rejected";
    booking.rejectReason=reason;
    booking.suggestedDate=date;
    booking.suggestedTime=time;

    await fetch(`${API_URL}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(booking)
    });

    rejectModal.hide();
        await Swal.fire({
        icon: "success",
        title: "Booking Rejected",
        text: "The booking has been rejected.",
        confirmButtonText: "OK",
        allowOutsideClick: false
    });
    loadBookings();
}

// COMPLETE BOOKING
async function completeBooking(id){
    const booking=bookings.find(booking=>booking.id===id);
    booking.status="Completed";

    await fetch(`${API_URL}/${id}`,{
        method:"PUT",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(booking)
    });

    bookingModal.hide();
    await Swal.fire({
        icon: "success",
        title: "Service Completed",
        text: "The service has been completed successfully.",
        confirmButtonText: "OK",
        allowOutsideClick: false
    });
    loadBookings();
}

// CHANGE PAGE
function changePage(page){
    currentPage = page;
    renderBookings();
}

// RENDER PAGINATION
function renderPagination(totalPages){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    if(totalPages <= 1) return;

    for(let i = 1; i <= totalPages; i++){
        pagination.innerHTML += `
        <li class="page-item ${currentPage===i ? "active":""}">
            <button
                class="page-link"
                onclick="changePage(${i})">
                ${i}
            </button>
        </li>
        `;
    }
}

