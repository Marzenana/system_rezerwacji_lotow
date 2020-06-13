import "./css/index.scss";
import users from "./data/users.json";
import flights from "./data/flights.json";
import boeing737 from "./airplane/boeing737.svg";
import bombardier from "./airplane/bombardier.svg";
import boeing787Dreamliner from "./airplane/boeing787Dreamliner.svg";
import minibag from "./bag/minibag.svg";
import smallbag from "./bag/smallbag.svg";
import mediumbag from "./bag/mediumbag.svg";
import bigbag from "./bag/bigbag.svg";

// Constants

const TRAVEL_STANDARDS = ["Standard", "Premium"]

const BAG_ID_TO_NAME = {
    minibag: "bagaż podręczny",
    smallbag: "bagaż mały",
    mediumbag: "bagaż średni",
    bigbag: "bagaż duży",
}

const BAG_ID_TO_PRICE = {
    minibag: 0,
    smallbag: 100,
    mediumbag: 200,
    bigbag: 300,
}

// Global state

let selectedSeats = [];
let chosenFlight = null;
let selectedBags = [];

let chosenTravelStandard = null;
let chosenFlightDate = null;

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
            setTimeout(onLogout, 180000);
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
    removeSeatsPicker();
    removeBagPicker();
    removeSeatsDetails();
    removeBagDetails();
    removeBagPicker();
    removeSummary();
}

function renderUserInfo(user) {
    document.querySelector("#user-info").innerHTML = 
    `<i class="fas fa-user"></i>
    <span>${user.firstName}</span>
    <button id="logout-button" class="transparent-btn">
        <i class="fa fa-sign-out"></i>
    </button>`;
    document.querySelector("#logout-button").addEventListener("click", onLogout);
}

function removeUserInfo() {
    document.querySelector("#user-info").innerHTML = "";
}

function renderLoginWrapper() {
    const loginWrapper = document.querySelector("#login-wrapper");
    loginWrapper.innerHTML = 
    `<div id="login-box"> 
        <h1>Logowanie</h1>
        <form id="login-form">
            <input id="login" class="input-element" type="text" placeholder="login">
            <i class="fas fa-user icon"></i>
            <input id="password" class="input-element" type="password" placeholder="hasło">
            <i class="fas fa-lock icon"></i>
            <button id="btn" class="btn" type="submit">
                <i class="fas fa-sign-in-alt"></i>
                Zaloguj się
            </button>
        </form>
    </div>`;
    loginWrapper.style.display = "flex";
    document.querySelector("#login-form").addEventListener("submit", onLogin);
}

function removeLoginWrapper() {
    const loginWrapper = document.querySelector("#login-wrapper");
    loginWrapper.style.display = "none";
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

    const toCities = flights.map(function(flight){
        return flight.toCity;
    })

    const toCitiesOptions = toCities.filter(function(value,index,array){
        return array.indexOf(value) === index
    }).map(function(toCity){
        return `<option value="${toCity}">${toCity}</option>`
    }).join("\n")

    const travelStandardOptions = TRAVEL_STANDARDS.map(function(travelStandard) {
        return `<option value="${travelStandard}">${travelStandard}</option>`
    }).join("\n")

    document.querySelector("#flight-criteria").innerHTML =
    `<div class="criteria-form">
        <div class="criteria">
            <label for="from-city">Z</label>
            <select id="from-city" name="subject">
                <option value=""></option>
                ${fromCitiesOptions}
            </select>
        </div>
    
        <div class="criteria">
            <label for="to-city">Do</label>
            <select id="to-city" name="subject">
                <option value=""></option>
                ${toCitiesOptions}
            </select>
        </div>

        <div class="criteria">
            <label for="travel-standard">Taryfa</label>
            <select id="travel-standard" name="subject">
                <option value=""></option>
                ${travelStandardOptions}
            </select>
        </div>

        <div class="criteria">
            <label for="flight-date">Data</label>
            <input id="flight-date" class="subject" type="text" name="flight-date" />
        </div>
    </div>`;

    const today = new Date();
    const year = today.getFullYear(), month = today.getMonth(), day = today.getDate();
    const maxDate = new Date(year + 1, month, day - 1);
    
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
      });

      document.querySelector("#from-city").addEventListener("change",  handleCriteriaChange);
      document.querySelector("#to-city").addEventListener("change", handleCriteriaChange);
      document.querySelector("#flight-date").addEventListener("change", handleCriteriaChange);
      document.querySelector("#travel-standard").addEventListener("change", handleCriteriaChange);
}

function removeFlightCriteria() {
    document.querySelector("#flight-criteria").innerHTML = "";
}

function handleCriteriaChange() {
    const fromCity = document.querySelector("#from-city").value;
    const toCity = document.querySelector("#to-city").value;
    const travelStandard = document.querySelector("#travel-standard").value;
    const flightDate = document.querySelector("#flight-date").value;

    const flightDetails = document.querySelector("#flight-details");

    selectedSeats = [];
    selectedBags = [];
 
    if(fromCity === "" || toCity === "" || travelStandard === ""){
        flightDetails.innerHTML="Wybierz wszystkie kryteria wyszukiwania.";
    } else{
        chosenFlight = null;
        for(let i=0; i < flights.length; i++){
            const flight = flights[i]
            if(flight.fromCity === fromCity && flight.toCity === toCity){
                chosenFlight = flight
            }
        }
        renderFlightDetails();
    }
}

function renderFlightDetails() {
    const flightDetails = document.querySelector("#flight-details");
    flightDetails.style.display = "block";
    if(chosenFlight != null){
        flightDetails.innerHTML = 
        `<div>
            <p>Lot odbywają się codziennie o ${chosenFlight.time}. Czas trwania lotu: ${chosenFlight.duration} h.</p>
            <button id="confirm-criteria-btn" class="confirm-btn">
                <i class="fa fa-plane" aria-hidden="true"></i>
                Przejdź do wyboru miejsc
            </button>
        </div>`;
        document.querySelector("#confirm-criteria-btn").addEventListener("click", handleConfirmCriteria);
    } else {
        flightDetails.innerHTML="Wybrana opcja nie jest dostępna. Zmień kryteria wyszukiwania.";
    }
} 

function removeFlightDetails() {
    document.querySelector("#flight-details").style.display = "none";
}

function handleConfirmCriteria() {
    chosenTravelStandard = document.querySelector("#travel-standard").value;
    chosenFlightDate = document.querySelector("#flight-date").value;

    removeFlightCriteria();
    removeFlightDetails();
    renderSeatsDetails();
    renderSeatsPicker();
}

function renderSeatsPicker() {
    const seatsPicker = document.querySelector("#seats-picker")
    seatsPicker.style.display = "block";
    let airplane = null;
    if(chosenFlight.airplane === "Bombardier") {
        airplane = bombardier;
    } else if(chosenFlight.airplane === "Boeing 737"){
        airplane = boeing737;
    } else if(chosenFlight.airplane === "Boeing 787 Dreamliner"){
        airplane = boeing787Dreamliner;
    }
    seatsPicker.innerHTML = 
    `<div>
        <object id="airplane" data="${airplane}" type="image/svg+xml"></object>
    </div>`;
    const airplaneElement = document.querySelector("#airplane");
    airplaneElement.addEventListener("load", function(){
        const seatsDocument = airplaneElement.contentDocument;
        const seatsElements = seatsDocument.querySelector("#seats");
        const seats = seatsElements.querySelectorAll("path");
        seats.forEach(seat => {
            seat.addEventListener("click", handleSelectSeat);
            seat.addEventListener("mouseover", handleMouseOverSeat);
            seat.addEventListener("mouseout", handleMouseOutSeat);
        });
    })
}

function handleSelectSeat(event){
    const seatNumber = event.target.id;
    const seatNumberIndex = selectedSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);
    if(seatNumberIndex === -1){
        seat.style["fill"] = "green";
        if (selectedSeats.length < 9) {
            selectedSeats.push(seatNumber)
        } else {
            alert("Nie można wybrać więcej niż 9 miejsc")
        }
    } else {
        selectedSeats.splice(seatNumberIndex, 1);
        seat.style["fill"] = "#f2f2f2";
    }
    renderSeatsDetails();
} 

function renderSeatsDetails() {
    document.querySelector("#seats-details").style.display = "block";
    let numberOfPremiumSeats = 0;
    let numberOfStandardSeats = 0;
    selectedSeats.forEach(seat => {
       if (/^[A-Z]\d$/.test(seat)) {
            numberOfPremiumSeats++;
       }  else {
           numberOfStandardSeats++;
       }
    });
    const totalCost = numberOfStandardSeats * chosenFlight.price + numberOfPremiumSeats * (chosenFlight.pricePremium || 0);

    const confirmSeatsButton =
    `<button id="confirm-seats-btn" class="confirm-btn">
        <i class="fa fa-suitcase" aria-hidden="true"></i>
        Przejdź do wyboru bagażów
    </button>`;

    document.querySelector("#seats-details").innerHTML =
    `<div>
        <span>Wybrano ${selectedSeats.length} miejsc (${numberOfStandardSeats} standard, ${numberOfPremiumSeats} premium) za łączną kwotę: ${totalCost} zł.</span>
        <div>${selectedSeats.length ? confirmSeatsButton : ""}</div>
    </div>`;
    if (selectedSeats.length) {
        document.querySelector("#confirm-seats-btn").addEventListener("click", handleConfirmSeats);
    }
}

function removeSeatsDetails() {
    document.querySelector("#seats-details").style.display = "none";
}

function handleConfirmSeats() {
    removeSeatsDetails();
    removeSeatsPicker();
    renderBagDetails();
    renderBagPicker();
    removeSummary();
}

function handleMouseOverSeat(event) {
    const seatNumber = event.target.id;
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);

    seat.style["fill"] = "blue";
}

function handleMouseOutSeat(event) {
    const seatNumber = event.target.id;
    const seatNumberIndex = selectedSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);

    seat.style["fill"] = seatNumberIndex === -1 ? "#f2f2f2" : "green";
}

function removeSeatsPicker() {
    document.querySelector("#seats-picker").style.display = "none";
}

function renderBagDetails() {
    let bagDetails = document.querySelector("#bag-details");
    bagDetails.style.display = "block";
    if (selectedBags.length) {
        const selectedBagsNames = selectedBags.map(bagId => BAG_ID_TO_NAME[bagId])
        let totalPrice = 0;
        selectedBags.forEach(bagId => {
            const bagPrice = BAG_ID_TO_PRICE[bagId];
            totalPrice += bagPrice;
        });
        totalPrice *= selectedSeats.length;
        bagDetails.innerHTML = 
        `<div>
            <span>Wybrano bagaże: ${selectedBagsNames.join(", ")} za łączną cenę: ${totalPrice} zł.</span>
            <div>
                <button id="confirm-bags-btn" class="confirm-btn">
                    <i class="fas fa-clipboard-check"></i>
                    Przejdź do podsumowania rezerwacji
                </button>
            </div>
        </div>`;
        document.querySelector("#confirm-bags-btn").addEventListener("click", handleConfirmBags);
    } else {
        bagDetails.innerHTML = `<span>Wybierz rodzaje bagaży aby kontynuować.</span>`
    }
}

function removeBagDetails() {
    document.querySelector("#bag-details").style.display = "none";
}

function renderBagPicker() {
    document.querySelector("#bag-picker").innerHTML =
    `<div class="bags">
        <div class="bag-wrapper">
            <object id="minibag" class="bag" data="${minibag}" type="image/svg+xml"></object>
            <span>Bagaż podręczny </span>
        </div>
        <div class="bag-wrapper">
            <object id="smallbag" class="bag" data="${smallbag}" type="image/svg+xml"></object>
            <span>Bagaż mały </span>
        </div>
        <div class="bag-wrapper">
            <object id="mediumbag" class="bag" data="${mediumbag}" type="image/svg+xml"></object>
            <span>Bagaż średni </span>
        </div>
        <div class="bag-wrapper">
            <object id="bigbag" class="bag" data="${bigbag}" type="image/svg+xml"></object>
            <span>Bagaż duży </span>
        </div>
    </div>`;

    const bags = document.querySelectorAll(".bag");
    bags.forEach(bag => {
        bag.addEventListener("load", function() {
            bag.contentDocument.addEventListener("click", handleSelectBag);
        });
    });
}

function removeBagPicker() {
    document.querySelector("#bag-picker").innerHTML = "";
}

function handleSelectBag(event) {
    const bagId = event.target.id;
    const bagIndex = selectedBags.indexOf(bagId);
    const bag = document.querySelector(`#${bagId}`);
    if (bagIndex === -1) {
        selectedBags.push(bagId);
        bag.style.backgroundColor = " rgb(26, 71, 167)"
    } else {
        selectedBags.splice(bagIndex, 1);
        bag.style.backgroundColor = "#f0f0f0";
    }
    renderBagDetails();
}


function handleConfirmBags() {
    removeBagDetails();
    removeBagPicker();
    renderSummary();
}

function renderSummary() {
    const bagNames = selectedBags.map(bagId => BAG_ID_TO_NAME[bagId]);
    const bagPrices = selectedBags.map(bagId => BAG_ID_TO_PRICE[bagId]);
    let totalBagsPrice = 0;
    bagPrices.forEach(bagPrice => {
        totalBagsPrice += bagPrice;
    });

    let numberOfPremiumSeats = 0;
    let numberOfStandardSeats = 0;
    selectedSeats.forEach(seat => {
       if (/^[A-Z]\d$/.test(seat)) {
            numberOfPremiumSeats++;
       }  else {
           numberOfStandardSeats++;
       }
    });
    
    const totalSeatsCost = numberOfStandardSeats * chosenFlight.price + numberOfPremiumSeats * (chosenFlight.pricePremium || 0);

    let summary = document.querySelector("#summary");
    summary.style.display = "block";
    summary.innerHTML = 
    `<div>
        <h1>Podsumowanie zamówienia:</h1>
        <ul>
            <li>Wylot z ${chosenFlight.fromCity} do ${chosenFlight.toCity} dnia ${chosenFlightDate} o godzinie ${chosenFlight.time}, czas trwania lotu: ${chosenFlight.duration} h.</li>
            <li>Wybrano ${selectedSeats.length} miejsc w tym ${numberOfStandardSeats} w klasie standard oraz ${numberOfPremiumSeats} w klasie premium za łączną cenę ${totalSeatsCost} zł.</li>
            <li>Wybrana taryfa lotu to: ${chosenTravelStandard}. Promocyjny koszt taryfy 9.99 zł.</li>
            <li>Wybrane rodzaje bagaży: ${bagNames.join(", ")} za łączną cenę ${totalBagsPrice} zł.</li>
            <li><b>Łączny koszt lotu: ${totalSeatsCost + totalBagsPrice + 9.99} zł.</b></li>
        </div>
        <button id="confirm-reservation" class="confirm-btn">
            <i class="fas fa-plane-departure"></i>
            Potwierdź rezerwację i wyloguj
        </button>
    </div>`;
    document.querySelector("#confirm-reservation").addEventListener("click", onLogout);
}

function removeSummary() {
    document.querySelector("#summary").style.display = "none";
}
