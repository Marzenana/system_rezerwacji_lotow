import "./css/index.scss";
import users from "./data/users.json";

// Login

renderLoginWrapper();

let loggedUser = null;

function onLogin(event) {
    event.preventDefault();
    const login = document.querySelector("#login").value;
    const password = document.querySelector("#password").value;
    for(let i = 0; i < users.length; i++){
        if(login === users[i].login && password === users[i].password) {
            loggedUser = users[i];
            console.log(loggedUser);
            renderUserInfo(loggedUser);
            setTimeout(function() {
                removeUserInfo();
                renderLoginWrapper();
            }, 5000);
            removeLoginWrapper();
            return;
        }
    }
    alert("Nieprawidłowy login lub hasło");
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
            <button id="btn" type="submit">
                <i class="fas fa-sign-in-alt"></i>
                Zaloguj się
            </button>
        </form>
    </div>`;
    document.querySelector("#login-form").addEventListener("submit", onLogin);
}

// function removeLoginWrapper() {
//     document.querySelector("#login-wrapper").innerHTML = "";
// }

// function renderFlightCriteria() {
//     document.querySelector("")
// }

//  <div class="city">
// <div>
//     Z
//     <select name="subject">
//         <option value="miasto">Wrocław</option>
//     </select>
// </div>


// <div>
//     Do
//     <select name="subject">
//         <option value="miasto">Warszawa</option>
//         <option value="miasto">Paryż</option>
//         <option value="miasto">Nowy Jork</option>

//     </select>
// </div>

// <div>
//     <input type="submit" value="Potwierdź">
// </div>
// </div> 