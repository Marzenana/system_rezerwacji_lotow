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

const TRAVEL_STANDARDS = ["Classic", "Comfort"]

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

showLoginWrapper();

function onLogin(event) {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    for(let i = 0; i < users.length; i++){
        const user = users[i];
        if(login === user.login && password === user.password) {
            renderUserInfo(user);
            setTimeout(onLogout, 180000);
            hideLoginWrapper();
            showFlightCriteria();
            return;
        }
    }
    alert("Nieprawidłowy login lub hasło");
}

function onLogout() {
    removeUserInfo();
    showLoginWrapper();
    hideFlightCriteria();
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

function showLoginWrapper() {
    const loginWrapper = document.querySelector("#login-wrapper");
    loginWrapper.style.display = "flex";
    document.querySelector("#login-form").onsubmit = onLogin;
}

function hideLoginWrapper() {
    const loginWrapper = document.querySelector("#login-wrapper");
    loginWrapper.style.display = "none";
}

function showFlightCriteria() {
    const flightCriteria = document.querySelector("#flight-criteria");
    flightCriteria.style.display = "block";

    const emptyOption = createSelectOption("");

    const fromCitySelect = document.querySelector("#from-city");
    fromCitySelect.innerHTML = ""; 
    fromCitySelect.appendChild(emptyOption.cloneNode());
    const fromCities = flights.map(function(flight){
        return flight.fromCity;
    }).filter(function(value,index,array){
        return array.indexOf(value) === index;
    })
    fromCities.forEach(function(fromCity){
        const option = createSelectOption(fromCity);
        fromCitySelect.appendChild(option);
    })

    const toCitySelect = document.querySelector("#to-city");
    toCitySelect.innerHTML = "";
    toCitySelect.appendChild(emptyOption.cloneNode());
    const toCities = flights.map(function(flight){
        return flight.toCity;
    }).filter(function(value,index,array){
        return array.indexOf(value) === index
    })
    toCities.forEach(function(toCity){
        const option = createSelectOption(toCity);
        toCitySelect.appendChild(option);
    })

    const travelOptionSelect = document.querySelector("#travel-standard");
    travelOptionSelect.innerHTML = "";
    travelOptionSelect.appendChild(emptyOption.cloneNode());
    TRAVEL_STANDARDS.forEach(function(travelStandard) {
        const option = createSelectOption(travelStandard);
        travelOptionSelect.appendChild(option);
    })

    const flightDateSelect = document.querySelector("#flight-date")
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

      const selects = [fromCitySelect, toCitySelect, travelOptionSelect, flightDateSelect]
      selects.forEach(select => {
          select.onclick = handleCriteriaChange;
      });
}

function createSelectOption(value) {
    const option = document.createElement("option");
    option.value = value;
    option.innerText = value;
    return option; 
}

function hideFlightCriteria() {
    document.querySelector("#flight-criteria").style.display = "none";
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

    hideFlightCriteria();
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
