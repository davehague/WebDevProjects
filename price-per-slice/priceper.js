function calculatePizza1() {
    let pizzaPrice = document.getElementById("PizzaPrice1").value;
    let pizzaInches = document.getElementById("PizzaInches1").value;
    let ppsi = calculatePPSI(pizzaInches, pizzaPrice);
    document.getElementById("PPSI1").innerHTML = ppsi;
    showWinner();
}

function calculatePizza2() {
    let pizzaPrice = document.getElementById("PizzaPrice2").value;
    let pizzaInches = document.getElementById("PizzaInches2").value;
    let ppsi = calculatePPSI(pizzaInches, pizzaPrice);
    document.getElementById("PPSI2").innerHTML = ppsi;
    showWinner();
}

function calculatePPSI(diameter, price) {
    let squareInches = Math.PI *  Math.pow((diameter/2), 2);
    return (price / squareInches).toFixed(3);
}

function showWinner() {
    let ppsi1 = document.getElementById("PPSI1").innerHTML;
    let ppsi2 = document.getElementById("PPSI2").innerHTML;

    let winner1 = document.getElementById("winner1");
    let winner2 = document.getElementById("winner2");

    winner1.style.visibility = "hidden";
    winner2.style.visibility = "hidden";

    ppsi1 < ppsi2 
        ? winner1.style.visibility = "visible" 
        : winner2.style.visibility = "visible";
}