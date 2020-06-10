import "./css/index.scss";
import users from "./data/users.json";
import flights from "./data/flights.json";
import boeing737 from "./airplane/boeing737.svg";
import bombardier from "./airplane/bombardier.svg";
import boeing787Dreamliner from "./airplane/boeing787Dreamliner.svg";

// Login

renderLoginWrapper();



function onLogin(event) {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    for(let i = 0; i < users.length; i++){
        const user = users[i];
        if(login === user.login && password === user.password) {
            renderUserInfo(user);
            setTimeout(onLogout, 50000);
            removeLoginWrapper();
            renderFlightCriteria();
            return;
        }
    }
    alert("Nieprawidłowy login lub hasło");
}

function onLogout() {
    removeUserInfo();
    renderLoginWrapper();
    removeFlightCriteria();
    removeFlightDetails();
}

// Rendereres

function renderUserInfo(user) {
    document.querySelector("#user-info").innerHTML = 
    `<i class="fas fa-user"></i>
    <span>${user.firstName}</span>`;
}

function removeUserInfo() {
    document.querySelector("#user-info").innerHTML = "";
}

function renderLoginWrapper() {
    document.querySelector("#login-wrapper").innerHTML = 
    `<div class="login-box"> 
        <h1>Logowanie</h1>
        <form id="login-form">
            <input id="login" class="input-element" type="text" placeholder="login">
            <i class="fas fa-user"></i>
            <input id="password" class="input-element" type="password" placeholder="hasło">
            <i class="fas fa-lock"></i>
            <button id="btn" class="btn" type="submit">
                <i class="fas fa-sign-in-alt"></i>
                Zaloguj się
            </button>
        </form>
    </div>`;
    document.querySelector("#login-form").addEventListener("submit", onLogin);
}

function removeLoginWrapper() {
    document.querySelector("#login-wrapper").innerHTML = "";
}

function renderFlightCriteria() {

    const fromCities = flights.map(function(flight){
        return flight.fromCity;
    })
    const fromCitiesOptions = fromCities.filter(function(value,index,array){
        return array.indexOf(value) === index
    }).map(function(fromCity){
        return `<option value="${fromCity}">${fromCity}</option>`
    }).join("\n")

    console.log(fromCities);

    const toCities = flights.map(function(flight){
        return flight.toCity;
    })
    console.log(toCities);

    const toCitiesOptions = toCities.filter(function(value,index,array){
        return array.indexOf(value) === index
    }).map(function(toCity){
        return `<option value="${toCity}">${toCity}</option>`
    }).join("\n")
    

    document.querySelector("#flight-criteria").innerHTML =
    `<div class="city">
        <div>
            Z
            <select id="from-city"class="subject" name="subject">
                <option value=""></option>
                ${fromCitiesOptions}
            </select>
        
            Do
            <select id="to-city" class="subject" name="subject">
                <option value=""></option>
                ${toCitiesOptions}
            </select>
            <br>
            Data
            <input id="flight-date" class="subject" type="text" name="flight-date" value="06/06/2020"/>
            <br>
            <button id="next" class="btn" type="submit">
            <i class="fas fa-angle-double-right"></i>
            </button>
        </div>
    </div>`;

    const today = new Date();
    const year = today.getFullYear(), month = today.getDate(), day = today.getDate();
    const maxDate = new Date(year + 1, month -3, day -1);
    
    $('input[name="flight-date"]').daterangepicker({
        "locale": {
            "format": "DD/MM/YYYY",
            "separator": " - ",
            "applyLabel": "Potwierdź",
            "cancelLabel": "Anuluj",
            "fromLabel": "Od",
            "toLabel": "Do",
            "customRangeLabel": "Custom",
            "daysOfWeek": [
                "Pn",
                "Wt",
                "Śr",
                "Cz",
                "Pt",
                "Sb",
                "Nd"
            ],
            "monthNames": [
                "Styczeń",
                "Luty",
                "Marzec",
                "Kwiecień",
                "Maj",
                "Czerwiec",
                "Lipiec",
                "Sierpień",
                "Wrzesień",
                "Październik",
                "Listopad",
                "Grudzień"
            ],
            "firstDay": 1
        },
        singleDatePicker: true,
        showDropdowns: true,
        minDate: today,
        maxDate,
      }, function(date){
          console.log(date);
      });
 

      document.querySelector("#from-city").addEventListener("change",  handleCriteriaChange);
      document.querySelector("#to-city").addEventListener("change", handleCriteriaChange);
      document.querySelector("#flight-date").addEventListener("change", handleCriteriaChange);


}


function removeFlightCriteria() {
    document.querySelector("#flight-criteria").innerHTML = "";
}

let chosenAirplane = null;
function handleCriteriaChange() {
    const fromCity = document.querySelector("#from-city").value;
    const toCity = document.querySelector("#to-city").value;
    const flightDate = document.querySelector("#flight-date").value;
    const flightDetails = document.querySelector("#flight-details");
   
 
    if(fromCity === "" || toCity === ""){
        flightDetails.innerHTML="Wybierz wszystkie kryteria wyszukiwania.";
    } else{
        let chosenFlight = null;
        for(let i=0; i < flights.length; i++){
            const flight = flights[i]
            if(flight.fromCity === fromCity && flight.toCity === toCity){
                chosenFlight = flight
            }
        }
        chosenAirplane = chosenFlight.airplane;
    
        renderSeatsPicker();
        renderFlightDetails(chosenFlight);
    }
        
}

function renderFlightDetails(flight) {
    const flightDetails = document.querySelector("#flight-details");
    if(flight != null){
        flightDetails.innerHTML=`<p>Lot odbywają się codziennie o ${flight.time} <br> Czas trwania: ${flight.duration} h<p>`
    } else {
        flightDetails.innerHTML="Wybrana opcja nie jest dostępna. Zmień kryteria wyszukiwania.";
    }

} 

function removeFlightDetails() {
    document.querySelector("#flight-details").innerHTML = "";
}





function renderSeatsPicker() {
    let airplane = null;
    if(chosenAirplane === "Bombardier") {
        airplane = bombardier;
    } else if(chosenAirplane === "Boeing 737"){
        airplane = boeing737;
    } else if(chosenAirplane === "Boeing 787 Dreamliner"){
        airplane = boeing787Dreamliner;
    }
    document.querySelector("#seats-picker").innerHTML = 
    `<object id="airplane" data="${airplane}" type="image/svg+xml"></object>`;
    const airplaneElement = document.querySelector("#airplane");
    airplaneElement.addEventListener("load",function(){

        const seatsDocument = airplaneElement.contentDocument;
        const seatsElements = seatsDocument.querySelector("#seats");
        // console.log(seatsElements);
        // console.log(airplaneElement);
        const seats = seatsElements.querySelectorAll("path");
        seats.forEach(seat => {
            seat.addEventListener("click", handleSelectSeat);
            seat.addEventListener("mouseover", handleMouseOverSeat);
            seat.addEventListener("mouseout", handleMouseOutSeat);

        });
    })
}

const selectedSeats = [];
const hoveredSeats = [];
function handleSelectSeat(event){
    console.log("klikniete siedzenie");
    // console.log(event);
    const seatNumber = event.target.id;
    const seatNumberIndex = selectedSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);
    if(seatNumberIndex === -1){
        seat.style["fill"] = "green";
        selectedSeats.push(seatNumber)

    }else{
        selectedSeats.splice(seatNumberIndex, 1);
        seat.style["fill"] = "#f2f2f2";
    }
    console.log(seat);
} 

function handleMouseOverSeat(event){
    console.log("najechano na siedzenie");
    console.log(event.target.id);
    const seatNumber = event.target.id;
    const seatNumberIndex = selectedSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);

    seat.style["fill"] = "blue";

}
function handleMouseOutSeat(event){
    console.log("wyjechano z siedzenia");
    console.log(event);
    const seatNumber = event.target.id;
    const seatNumberIndex = selectedSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);

    seat.style["fill"] = "#f2f2f2";
}

function removeSeatsPicker() {
    document.querySelector("#seats-picker").innerHTML = "";
}