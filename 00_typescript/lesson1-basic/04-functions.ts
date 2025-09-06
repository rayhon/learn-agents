function add(a: number, b: number): number {
    return a + b;
}

//infer return type
function add2(a: number, b: number) {
    return a + b;
}

// function type - A function type has two parts: parameters and return type.
let add3: (x: number, y: number) => number

add3 = function (x: number, y: number) {
    return x + y;
}


function applyDiscount(price: number, discount = 0.05) {
    return price * (1 - discount);
}
console.log(applyDiscount(100)); // 95


// function type inference
let multiply = function (a: number, b: number, c?: number) {
    if (typeof c !== 'undefined') {
        return a * b * c;
    }
    return a * b;
}
let result = multiply(3,5); //c is optional 

// -- rest parameters
function getTotal(...numbers: number[]): number {
    let total = 0;
    numbers.forEach((num) => total += num);
    return total;
}

console.log(getTotal()); // 0
console.log(getTotal(10, 20)); // 30
console.log(getTotal(10, 20, 30)); // 60


