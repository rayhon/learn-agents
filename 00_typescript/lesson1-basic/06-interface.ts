interface Person {
  readonly ssn: string;
  firstName: string;
  lastName: string;
}

let person: Person;
person = {
  ssn: "171-28-0926",
  firstName: "John",
  lastName: "Doe",
};


interface StringFormat {
    (str: string, isUpper: boolean): string
}

let format: StringFormat;

format = function (str: string, isUpper: boolean) {
    return isUpper ? str.toLocaleUpperCase() : str.toLocaleLowerCase();
};

console.log(format('hi', true));

let lowerCase: StringFormat;
lowerCase = function (str: string) {
    return str.toLowerCase();
}

console.log(lowerCase('Hi', false));
