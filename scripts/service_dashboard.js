const API_URL = "http://localhost:3000/bookings";
const currentUser = JSON.parse(localStorage.getItem("currentUser"));

let bookings = [];
let currentView = "active";
let currentSearch = "";
let currentSort = "latest";
let currentStatus = "all";


if (!currentUser || currentUser.role !== "support") {
    window.location.href = "/pages/login.html";
}

const welcomeSupport = document.getElementById("welcomeSupport");
const logoutBtn = document.getElementById("logoutBtn");
const themeBtn = document.getElementById("themeBtn");
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

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    document.body.classList.toggle("dark-mode");
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("role");
    window.location.href = "/pages/login.html";
});

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

function updateStatistics(){
    totalBookings.textContent = bookings.length;
    pendingBookings.textContent =bookings.filter(booking => booking.status==="Pending").length;
    acceptedBookings.textContent =bookings.filter(booking => booking.status==="Accepted").length;
    completedBookings.textContent=bookings.filter(booking => booking.status==="Completed").length;
}

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
        filteredBookings = filteredBookings.filter(booking =>booking.customerName.toLowerCase().includes(currentSearch)||
        booking.vehicleNumber.toLowerCase().includes(currentSearch)||
        booking.service.toLowerCase().includes(currentSearch));
    }

    if (currentStatus !== "all") 
    {
        filteredBookings = filteredBookings.filter(booking => booking.status === currentStatus);
    }

    switch (currentSort) 
    {
        case "oldest":
            filteredBookings.sort((a, b) =>
                new Date(a.bookingDate)-new Date(b.bookingDate));
            break;

        case "customer":
            filteredBookings.sort((a, b) =>
                a.customerName.localeCompare(b.customerName));
            break;
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
}

searchBooking.addEventListener("input", function () {
    currentSearch = this.value.toLowerCase().trim();
    renderBookings();
});

sortBookings.addEventListener("change", function () {
    currentSort = this.value;
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

function openRejectModal(id){
    bookingModal.hide();
    document.getElementById("rejectBookingId").value=id;
    document.getElementById("rejectReason").value="";
    document.getElementById("suggestedDate").value="";
    document.getElementById("suggestedTime").value="";
    rejectModal.show();
}

document.getElementById("confirmReject").addEventListener("click", rejectBooking);
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

