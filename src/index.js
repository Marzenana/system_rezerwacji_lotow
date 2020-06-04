import {sum} from "./sum";
import "./css/index.scss";
import airplane from "./img/airplane.jpg";
console.log("Hello World");
console.log(sum(2,3));

let heading = document.querySelector("#demo"),
    sumValue = sum(10,5);

heading.innerHTML = `10 + 5 = ${sumValue}`;

console.log("halo");

class Punkt {
    constructor(x,y) {
        this.x = x;
        this.y = y; 
    }
}

let punkt = new Punkt(5,7);

console.log(punkt);

// let myAirplane = new Image();
// myAirplane.src = airplane;
// document.querySelector("div").appendChild(myAirplane);
