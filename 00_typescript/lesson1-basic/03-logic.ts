
// --- if/else
let discount: number;
let itemCount = 11;

if (itemCount > 0 && itemCount <= 5) {
  discount = 5; // 5% discount
} else if (itemCount > 5 && itemCount <= 10) {
  discount = 10; // 10% discount
} else if (itemCount > 10) {
  discount = 15; // 15%
} else {
  throw new Error('The number of items cannot be negative!');
}

console.log(`You got ${discount}% discount. `);


// ---  switch case

let targetId = 'btnDelete';

switch (targetId) {
    case 'btnUpdate':
        console.log('Update');
        break;
    case 'btnDelete':
        console.log('Delete');
        break;
    case 'btnNew':
        console.log('New');
        break;
}


// ---- loop
for (let i = 0; i < 10; i++) {
    console.log(i);
}

let counter = 0;
while (counter < 5) {
    console.log(counter);
    counter++;
}


let i = 0;
do {
    console.log(i);
    i++
} while (i < 10);


// break and continue
let products = [
    { name: 'phone', price: 700 },
    { name: 'tablet', price: 900 },
    { name: 'laptop', price: 1200 }
];

for (var j = 0; j < products.length; j++) {
    if (products[j].price == 900)
        break;
}



for (let index = 0; index < 9; index++) {
    
    // if index is odd, skip it
    if (index % 2)
        continue;

    // the following code will be skipped for odd numbers
    console.log(index);
}