let ids: number[] = [1, 2, 3, 4, 5]; // can only contain numbers
let names: string[] = ['Danny', 'Anna', 'Bazza']; // can only contain strings
let options: boolean[] = [true, false, false]; //can only contain true or false


let books: object[] = [
  { name: 'Fooled by randomness', author: 'Nassim Taleb' },
  { name: 'Sapiens', author: 'Yuval Noah Harari' },
]; 

let skills: string[];
skills = ['Problem Sovling','Software Design','Programming'];

// mixed type
let arr: any[] = ['hello', 1, true]; // any basically reverts TypeScript back into JavaScript
let scores = ['Programming', 5, 'Software Design', 4]; 

let record : (string | number)[];
record = ['Programming', 5, 'Software Design', 4]; 




// ---- function and properties
const getSong = () => {
  return "song";
};

let whoSangThis: string = getSong();

const singles = [
  { song: "touch of grey", artist: "grateful dead" },
  { song: "paint it black", artist: "rolling stones" },
];

//find
const single = singles.find((s) => s.song === whoSangThis);

if (single) {
  console.log(single.artist); // rolling stones
}

//length
console.log(singles.length); // 2

//-- list operation
ids.push(6);
arr.pop();

//You can use all the useful array methods such as forEach(), map(), reduce(), and filter(). For example:
let series = [1, 2, 3];
let doubleIt = series.map(e => e* 2);
console.log(doubleIt); // [ 2, 4, 6 ] 


