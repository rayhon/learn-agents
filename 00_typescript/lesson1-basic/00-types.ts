// 00-types.ts

// ---- type annotation
let counter: number;
// counter = 'Hello'; // compile error 

let names: string[] = ['John', 'Jane', 'Peter', 'David', 'Mary'];

let student: {
  name: string;
  age: number;
};

student = {
  name: 'John',
  age: 25,
}; // valid

let greeting : (name: string) => string;
greeting = function (name: string) {
  return `Hi ${name}`;
};



// ---- typescript infer type from the value. Once defined, the type cannot be changed.
let name = "Alice";
let age = 20;

// typescript infer return type from the return value
function add(a: number, b: number) {
  return a + b;
}

let tasks = {
  id: 1,
  title: 'Buy groceries',
  description: 'Buy groceries for the week',
  completed: false,
}

// error: Object literal may only specify known properties, and 'b' does not exist before
// tasks = {id: 1, b: 2} 



// ---- primitive types
// number, bigint, string, boolean, null, undefined, symbol

// ---- object vs Object
// - The TypeScript object type represents any value that is not a primitive value.
// - The Object type, however, describes functionality that is available on all objects.
// - The empty type {} refers to an object that has no property on its own.

// ---- empty type
let vacant: {};
// vacant.firstName = 'John';  //error


// ---- any type
let result: any;

result = 1;
console.log(result);

result = 'Hello';
console.log(result);

result = [1, 2, 3];
const total = result.reduce((a: number, b: number) => a + b, 0);
console.log(total);

// ---- type alias
type Name = string;
let firstName: Name;
let lastName: Name;


type Person = {
  name: string;
  age: number;
};

let person: Person = {
  name: 'John',
  age: 25
};

// ---- union type
type alphanumeric = string | number;

let input: alphanumeric;
input = 100; // valid
input = 'Hi'; // valid
// input = false; // Compiler error


// ---- intersection type
type Personal = {
  name: string;
  age: number;
};

type Contact = {
  email: string;
  phone: string;
};

type Candidate = Personal & Contact;

let candidate: Candidate = {
  name: "Joe",
  age: 25,
  email: "joe@example.com",
  phone: "(408)-123-4567"
};

