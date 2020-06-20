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

const FROM_CITIES = flights.map(flight => flight.fromCity).filter((value, index, array) => array.indexOf(value) === index);

const TO_CITITES = flights.map(flight => flight.toCity).filter((value, index, array) => array.indexOf(value) === index);

const TRAVEL_STANDARDS = ["Classic", "Comfort"]

const BAGS = [
    {
        bagId: "minibag",
        name: "bagaż podręczny",
        price: 0,
        image: minibag,
    },
    {
        bagId: "smallbag",
        name: "bagaż mały",
        price: 100,
        image: smallbag,
    },
    {
        bagId: "mediumbag",
        name: "bagaż średni",
        price: 200,
        image: mediumbag,
    },
    {
        bagId: "bigbag",
        name: "bagaż duży",
        price: 300,
        image: bigbag,
    },
]

// Global state

let loggedUser = null;
let chosenSeats = [];
let chosenFlight = null;
let chosenBag = null;
let chosenTravelStandard = null;
let chosenFlightDate = null;

// Preparation

prepareLogo();

// Login

showLoginWrapper();

function onLogin(event) {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if(login === user.login && password === user.password) {
            loggedUser = user;
            showUserInfo();
            setTimeout(onLogout, 180000);
            hideLoginWrapper();
            showFlightCriteria();
            return;
        }
    }
    alert("Nieprawidłowy login lub hasło");
}

function onLogout() {
    loggedUser = null;
    hideAll();
    showLoginWrapper();
}

function hideAll() {
    hideUserInfo();
    hideLoginWrapper();
    hideFlightCriteria();
    hideSelectedCriteriasInfo();
    hideSeatsPicker();
    hideBagPicker();
    hideSeatsDetails();
    hideBagDetails();
    hideBagPicker();
    hideSummary();
}

function prepareLogo() {
    const logoElement = document.querySelector("#logo");
    logoElement.onclick = handleLogoClick;
}

function handleLogoClick() {
    if (loggedUser) {
        hideAll();
        showUserInfo();
        showFlightCriteria();
    }
}

function showUserInfo() {
    const userInfo = document.querySelector("#user-info")
    userInfo.style.display = "block";
    userInfo.querySelector("span").innerText = loggedUser.firstName;
    const logoutButton = document.querySelector("#logout-button")
    logoutButton.onclick = onLogout;
}

function hideUserInfo() {
    document.querySelector("#user-info").style.display = "none";
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

    renderFromCityOptions(FROM_CITIES);
    renderToCityOptions(TO_CITITES);
    renderTravelStandardOptions();
    renderFlightDate();
}

function renderFromCityOptions(cities, selectedCity = "") {
    const fromCitySelect = document.querySelector("#from-city");
    fromCitySelect.innerHTML = ""; 
    fromCitySelect.appendChild(createSelectOption(""));
    cities.forEach(function(fromCity){
        const option = createSelectOption(fromCity);
        fromCitySelect.appendChild(option);
    })
    fromCitySelect.value = selectedCity;
    fromCitySelect.onclick = handleCriteriaChange;
}

function renderToCityOptions(cities, selectedCity = "") {
    const toCitySelect = document.querySelector("#to-city");
    toCitySelect.innerHTML = "";
    toCitySelect.appendChild(createSelectOption(""));
    cities.forEach(function(toCity) {
        const option = createSelectOption(toCity);
        toCitySelect.appendChild(option);
    })
    toCitySelect.value = selectedCity;
    toCitySelect.onclick = handleCriteriaChange;
}

function renderTravelStandardOptions() {
    const travelOptionSelect = document.querySelector("#travel-standard");
    travelOptionSelect.innerHTML = "";
    travelOptionSelect.appendChild(createSelectOption(""));
    TRAVEL_STANDARDS.forEach(function(travelStandard) {
        const option = createSelectOption(travelStandard);
        travelOptionSelect.appendChild(option);
    })
    travelOptionSelect.onclick = handleCriteriaChange;
}

function renderFlightDate() {
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
      flightDateSelect.onclick = handleCriteriaChange;
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

    chosenSeats = [];
 
    if (fromCity === "" || toCity === "" || travelStandard === "") {
        showSelectCriteriasWarning();
    } else {
        chosenFlight = null;
        for(let i=0; i < flights.length; i++){
            const flight = flights[i]
            if(flight.fromCity === fromCity && flight.toCity === toCity){
                chosenFlight = flight
            }
        }
        showSelectedCriteriasInfo();
        hideSelectCriteriasWarning();
    }
    renderFromCityOptions(FROM_CITIES.filter(city => city != toCity), fromCity);
    renderToCityOptions(TO_CITITES.filter(city => city != fromCity), toCity);
}

function showSelectCriteriasWarning() {
    document.querySelector("#select-criterias-warning").style.display = "block";
}

function hideSelectCriteriasWarning() {
    document.querySelector("#select-criterias-warning").style.display = "none";
}

function showSelectedCriteriasInfo() {
    const selectedCriteriasInfo = document.querySelector("#selected-criterias-info");
    selectedCriteriasInfo.style.display = "block";
    if (chosenFlight != null) {
        selectedCriteriasInfo.querySelector("p").innerText = `Lot odbywają się codziennie o ${chosenFlight.time}. Czas trwania lotu: ${chosenFlight.duration} h.`;
        document.querySelector("#confirm-criteria-btn").onclick = handleConfirmCriteria;
    } 
} 

function hideSelectedCriteriasInfo() {
    document.querySelector("#selected-criterias-info").style.display = "none";
}

function handleConfirmCriteria() {
    chosenTravelStandard = document.querySelector("#travel-standard").value;
    chosenFlightDate = document.querySelector("#flight-date").value;

    hideFlightCriteria();
    hideSelectedCriteriasInfo();
    showSeatsDetails();
    showSeatsPicker();
}

function showSeatsPicker() {
    const seatsPicker = document.querySelector("#seats-picker")
    seatsPicker.style.display = "block";
    let airplane = null;
    if(chosenFlight.airplane === "Bombardier") {
        airplane = bombardier;
    } else if(chosenFlight.airplane === "Boeing 737") {
        airplane = boeing737;
    } else if(chosenFlight.airplane === "Boeing 787 Dreamliner") {
        airplane = boeing787Dreamliner;
    }
    const airplaneElement = document.querySelector("#airplane");
    airplaneElement.data = airplane;
    airplaneElement.onload = function() {
        const seatsDocument = airplaneElement.contentDocument;
        const seatsElements = seatsDocument.querySelector("#seats");
        const seats = seatsElements.querySelectorAll("path");
        seats.forEach(seat => {
            seat.onclick = handleSelectSeat;
            seat.onmouseover = handleMouseOverSeat;
            seat.onmouseout = handleMouseOutSeat;
        });
    }
}

function hideSeatsPicker() {
    document.querySelector("#seats-picker").style.display = "none";
}

function handleSelectSeat(event){
    const seatNumber = event.target.id;
    const seatNumberIndex = chosenSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);
    if(seatNumberIndex === -1){
        seat.style["fill"] = "green";
        if (chosenSeats.length < 9) {
            chosenSeats.push(seatNumber)
        } else {
            alert("Nie można wybrać więcej niż 9 miejsc")
        }
    } else {
        chosenSeats.splice(seatNumberIndex, 1);
        seat.style["fill"] = "#f2f2f2";
    }
    showSeatsDetails();
} 

function showSeatsDetails() {
    document.querySelector("#seats-details").style.display = "block";
    let numberOfPremiumSeats = 0;
    let numberOfStandardSeats = 0;
    chosenSeats.forEach(seat => {
       if (/^[A-Z]\d$/.test(seat)) {
            numberOfPremiumSeats++;
       } else {
           numberOfStandardSeats++;
       }
    });
    const totalCost = numberOfStandardSeats * chosenFlight.price + numberOfPremiumSeats * (chosenFlight.pricePremium || 0);

    const seatsDetails = document.querySelector("#seats-details");
    seatsDetails.querySelector("span").innerText = `Wybrano ${chosenSeats.length} miejsc (${numberOfStandardSeats} standard, ${numberOfPremiumSeats} premium) za łączną kwotę: ${totalCost} zł.`;
    const confirmSeatsButton = seatsDetails.querySelector("button");
    confirmSeatsButton.onclick = handleConfirmSeats;
    if (chosenSeats.length) {
        confirmSeatsButton.style.display = "inline";
    } else {
        confirmSeatsButton.style.display = "none";
    }
}

function hideSeatsDetails() {
    document.querySelector("#seats-details").style.display = "none";
}

function handleConfirmSeats() {
    hideSeatsDetails();
    hideSeatsPicker();
    showBagDetails();
    showBagPicker();
    hideSummary();
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
    const seatNumberIndex = chosenSeats.indexOf(seatNumber);
    const airplaneElement = document.querySelector("#airplane");
    const seatsDocument = airplaneElement.contentDocument;
    const seatsElements = seatsDocument.querySelector("#seats");
    let seat = seatsElements.querySelector(`#${seatNumber}`);

    seat.style["fill"] = seatNumberIndex === -1 ? "#f2f2f2" : "green";
}

function showBagDetails() {
    let bagDetails = document.querySelector("#bag-details");
    bagDetails.style.display = "block";

    const infoElement = bagDetails.querySelector("span");

    const confirmBagsButton = bagDetails.querySelector("button");
    confirmBagsButton.onclick = handleConfirmBags;

    if (chosenBag) {
        const chosenBagInfo = BAGS.find(bag => bag.bagId === chosenBag);
        const totalPrice = chosenBagInfo.price * chosenSeats.length;
        infoElement.innerText = `Wybrano rodzaj bagaży: ${chosenBagInfo.name} za łączną cenę: ${totalPrice} zł${chosenBagInfo.bagId === "minibag" ? " (w cenie biletu)" : ""}.`;
        confirmBagsButton.style.display = "inline";
    } else {
        infoElement.innerText = `Wybierz rodzaje bagaży aby kontynuować.`;
        confirmBagsButton.style.display = "none";
    }
}

function hideBagDetails() {
    document.querySelector("#bag-details").style.display = "none";
}

function showBagPicker() {
    chosenBag = null;
    const bagPicker = document.querySelector("#bag-picker");
    bagPicker.style.display = "block";
    const bagsElement = bagPicker.querySelector(".bags");
    bagsElement.innerHTML = "";
    BAGS.forEach(bag => {
        const bagWrapper = document.createElement("div");
        bagWrapper.className = "bag-wrapper";
        const imageElement = document.createElement("object");
        imageElement.id = bag.bagId;
        imageElement.className = "bag";
        imageElement.data = bag.image;
        imageElement.type = "image/svg+xml";
        imageElement.onload = function() {
            imageElement.contentDocument.onclick = handleSelectBag;
        }
        bagWrapper.appendChild(imageElement);
        const bagNameElement = document.createElement("span");
        bagNameElement.innerText = bag.name;
        bagWrapper.appendChild(bagNameElement);
        bagsElement.appendChild(bagWrapper);
    });
}

function hideBagPicker() {
    document.querySelector("#bag-picker").style.display = "none";
}

function handleSelectBag(event) {
    const bagId = event.target.id;
    if (chosenBag) {
        document.querySelector(`#${chosenBag}`).style.backgroundColor = "#f0f0f0";
    }
    chosenBag = bagId;
    document.querySelector(`#${bagId}`).style.backgroundColor = "rgb(26, 71, 167)";
    showBagDetails();
}


function handleConfirmBags() {
    hideBagDetails();
    hideBagPicker();
    showSummary();
}

function showSummary() {
    const summary = document.querySelector("#summary");
    summary.style.display = "block";

    const bagInfo = BAGS.find(bag => bag.bagId === chosenBag);
    const totalBagsPrice = bagInfo.price * chosenSeats.length;

    let numberOfPremiumSeats = 0;
    let numberOfStandardSeats = 0;
    chosenSeats.forEach(seat => {
       if (/^[A-Z]\d$/.test(seat)) {
            numberOfPremiumSeats++;
       }  else {
           numberOfStandardSeats++;
       }
    });
    
    const totalSeatsCost = numberOfStandardSeats * chosenFlight.price + numberOfPremiumSeats * (chosenFlight.pricePremium || 0);

    const summaryList = summary.querySelector("ul");
    summaryList.innerHTML = "";

    const summaryPoints = [
        `Wylot z ${chosenFlight.fromCity} do ${chosenFlight.toCity} dnia ${chosenFlightDate} o godzinie ${chosenFlight.time}, czas trwania lotu: ${chosenFlight.duration} h.`,
        `Wybrano ${chosenSeats.length} miejsc w tym ${numberOfStandardSeats} w klasie standard oraz ${numberOfPremiumSeats} w klasie premium za łączną cenę ${totalSeatsCost} zł.`,
        `Wybrana taryfa lotu to: ${chosenTravelStandard}. Promocyjny koszt taryfy 9.99 zł.`,
        `Wybrany rodzaj bagaży: ${bagInfo.name} za łączną cenę ${totalBagsPrice} zł.`,
    ]
    summaryPoints.forEach(pointText => {
        const listItem = document.createElement("li");
        listItem.innerText = pointText;
        summaryList.appendChild(listItem);
    });

    const totalPoint = document.createElement("li");
    const totalPointText = document.createElement("b");
    totalPointText.innerText = `Łączny koszt lotu: ${totalSeatsCost + totalBagsPrice + 9.99} zł.`,
    totalPoint.appendChild(totalPointText);
    summaryList.appendChild(totalPoint);

    const confirmButton = document.querySelector("#confirm-reservation");
    confirmButton.onclick = onLogout;
}

function hideSummary() {
    document.querySelector("#summary").style.display = "none";
}
