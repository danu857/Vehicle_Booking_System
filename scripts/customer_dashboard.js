

// ===========================================
// GLOBAL VARIABLES
// ===========================================

const API_URL = "http://localhost:3000/bookings";

const currentUser = JSON.parse(localStorage.getItem("currentUser"));

let bookings = [];

let currentView = "active";

let currentSearch = "";

let currentSort = "latest";


// ===========================================
// LOGIN CHECK
// ===========================================

if (!currentUser) {
    window.location.href = "/pages/login.html";
}


// ===========================================
// ELEMENTS
// ===========================================

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

const sortBooking = document.getElementById("sortBooking");

const bookingForm = document.getElementById("bookingForm");

const bookingModalElement = document.getElementById("bookingModal");

const detailsModalElement = document.getElementById("detailsModal");


// ===========================================
// BOOTSTRAP MODALS
// ===========================================

const bookingModal = new bootstrap.Modal(bookingModalElement);

const detailsModal = new bootstrap.Modal(detailsModalElement);


// ===========================================
// WELCOME MESSAGE
// ===========================================

welcomeUser.textContent = `Welcome, ${currentUser.name}`;



// ===========================================
// SET MINIMUM DATE
// ===========================================

const today = new Date();

today.setMinutes(today.getMinutes() - today.getTimezoneOffset());

document.getElementById("bookingDate").min =
today.toISOString().slice(0,16);


// ===========================================
// THEME
// ===========================================

themeBtn.addEventListener("click", () => {

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



// ===========================================
// LOGOUT
// ===========================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("currentUser");

    localStorage.removeItem("role");

    window.location.href = "/pages/login.html";

});



// ===========================================
// AUTO PRICE
// ==========================================

document.getElementById("service").addEventListener("change", function(){

    const selectedOption =
    this.options[this.selectedIndex];

    document.getElementById("amount").value =
    selectedOption.dataset.price || "";

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

    }

    catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Unable to load bookings"
        });

    }

}


function updateStatistics() {

    totalBookings.textContent =
        bookings.length;

    pendingBookings.textContent =
        bookings.filter(
            booking => booking.status === "Pending"
        ).length;

    acceptedBookings.textContent =
        bookings.filter(
            booking => booking.status === "Accepted"
        ).length;

    completedBookings.textContent =
        bookings.filter(
            booking => booking.status === "Completed"
        ).length;

}


function renderBookings() {

    bookingContainer.innerHTML = "";

    let filteredBookings = [...bookings];


// -------------------------------------------
// Active / History Filter
// -------------------------------------------

if (currentView === "active") {

    filteredBookings = filteredBookings.filter(
        booking =>
            booking.status === "Pending" ||
            booking.status === "Accepted"
    );

}
else {

    filteredBookings = filteredBookings.filter(
        booking =>
            booking.status === "Completed" ||
            booking.status === "Rejected"
    );

}



// -------------------------------------------
// Search
// -------------------------------------------

if (currentSearch !== "") {

    filteredBookings = filteredBookings.filter(booking =>

        booking.vehicleNumber
        .toLowerCase()
        .includes(currentSearch)

        ||

        booking.service
        .toLowerCase()
        .includes(currentSearch)

    );

}



// -------------------------------------------
// Sort
// -------------------------------------------

switch(currentSort){

    case "latest":

        filteredBookings.sort(

            (a,b)=>

            new Date(b.bookingDate) -

            new Date(a.bookingDate)

        );

        break;


    case "oldest":

        filteredBookings.sort(

            (a,b)=>

            new Date(a.bookingDate) -

            new Date(b.bookingDate)

        );

        break;


    case "service":

        filteredBookings.sort(

            (a,b)=>

            a.service.localeCompare(b.service)

        );

        break;


    case "status":

        filteredBookings.sort(

            (a,b)=>

            a.status.localeCompare(b.status)

        );

        break;

}



    // No bookings

    if (filteredBookings.length === 0) {

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



    // Cards

    filteredBookings.forEach(booking => {

        let badgeClass = "";

        switch (booking.status) {

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

            <div
                class="card booking-card"
                data-id="${booking.id}"
            >

                <div class="card-body">

                    <h5>

                        ${booking.service}

                    </h5>

                    <p>

                        <strong>

                            Vehicle :

                        </strong>

                        ${booking.vehicleNumber}

                    </p>

                    <p>

                        <strong>

                            Date :

                        </strong>

                        ${new Date(
                            booking.bookingDate
                        ).toLocaleString()}

                    </p>

                    <span class="badge ${badgeClass}">

                        ${booking.status}

                    </span>

                </div>

            </div>

        </div>

        `;

    });

}

// ===========================================
// ACTIVE / HISTORY TABS
// ===========================================

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

// Search

searchBooking.addEventListener("input", function(){

    currentSearch =
    this.value.toLowerCase().trim();

    renderBookings();

});




// Sort

sortBooking.addEventListener("change", function(){

    currentSort =
    this.value;

    renderBookings();

});

// ===========================================
// MODULE 4
// CRUD
// ===========================================


bookingForm.addEventListener("submit", async function(e){

    e.preventDefault();


    document
    .querySelectorAll(".text-danger")
    .forEach(error=>error.textContent="");


    let valid=true;


    const id=document.getElementById("bookingId").value;

    const service=document.getElementById("service").value;

    const vehicleNumber=document
    .getElementById("vehicleNumber")
    .value
    .trim();

    const vehicleType=document
    .getElementById("vehicleType")
    .value;

    const bookingDate=document
    .getElementById("bookingDate")
    .value;

    const amount=document
    .getElementById("amount")
    .value;


    if(service===""){

        document
        .getElementById("serviceError")
        .textContent="Select a service";

        valid=false;

    }


    if(vehicleNumber===""){

        document
        .getElementById("vehicleNumberError")
        .textContent="Enter vehicle number";

        valid=false;

    }


    if(vehicleType===""){

        document
        .getElementById("vehicleTypeError")
        .textContent="Select vehicle type";

        valid=false;

    }


    if(bookingDate===""){

        document
        .getElementById("bookingDateError")
        .textContent="Select booking date";

        valid=false;

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

        status:"Pending"

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

            Swal.fire(
                "Success",
                "Booking Added",
                "success"
            );

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

            Swal.fire(
                "Success",
                "Booking Updated",
                "success"
            );

        }

        bookingModal.hide();

        bookingForm.reset();

        document
        .getElementById("bookingId")
        .value="";

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

    const response=
    await fetch(`${API_URL}/${id}`);

    const booking=
    await response.json();


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

        const detailsBody =
        document.getElementById("detailsBody");

        const detailsFooter =
        document.getElementById("detailsFooter");



        let badgeClass = "";

        switch(booking.status){

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

            <p>

                <strong>Vehicle Number :</strong>

                ${booking.vehicleNumber}

            </p>

            <p>

                <strong>Vehicle Type :</strong>

                ${booking.vehicleType}

            </p>

            <p>

                <strong>Booking Date :</strong>

                ${new Date(
                    booking.bookingDate
                ).toLocaleString()}

            </p>

            <p>

                <strong>Amount :</strong>

                ₹${booking.amount}

            </p>

            <p>

                <strong>Status :</strong>

                <span class="badge ${badgeClass}">

                    ${booking.status}

                </span>

            </p>

        `;



        // Footer Buttons

        if(booking.status === "Pending"){

            detailsFooter.innerHTML = `

                <button
                    class="btn btn-warning"
                    id="editBookingBtn">

                    <i class="bi bi-pencil-square"></i>

                    Edit

                </button>

                <button
                    class="btn btn-danger"
                    id="deleteBookingBtn">

                    <i class="bi bi-trash"></i>

                    Delete

                </button>

            `;



            document
            .getElementById("editBookingBtn")
            .addEventListener("click",()=>{

                detailsModal.hide();

                editBooking(id);

            });



            document
            .getElementById("deleteBookingBtn")
            .addEventListener("click",async ()=>{

                detailsModal.hide();

                await deleteBooking(id);

            });

        }

        else{

            detailsFooter.innerHTML = `

                <button
                    class="btn btn-secondary"
                    data-bs-dismiss="modal">

                    Close

                </button>

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