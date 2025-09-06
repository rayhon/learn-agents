// Type assertions instruct the TypeScript compiler to treat a value as a specified type. 
// In TypeScript, you can use the as keyword or <> operator for type assertions.


class Employee {
    constructor(
        public ssn: string,
        public firstName: string,
        public lastName: string,
        private jobTitle: string) {}

    describe(): string {
        return `This is Employee with lastname:  ${this.lastName}.`;
    }

}

class FullTimeEmployee extends Employee {
    constructor(ssn: string, firstName: string, lastName: string, jobTitle: string, private salary: number) {
        super(ssn, firstName, lastName, jobTitle);
    }
    getSalary(): number {
        return this.salary;
    }
}


// --- Type Assertion Example ---

function getPerson(): Employee {
    // In a real app, this might come from a legacy library or an API response
    return new FullTimeEmployee('123-45-678', 'Jane', 'Doe', 'Manager', 80000);
}

const person = getPerson();

// We can't do person.getSalary() because TypeScript only knows it's Employee
// If we know from the context that 'person' is a FullTimeEmployee,
// we can use a type assertion to treat it as one.

// 1. Using the 'as' keyword (preferred)
const fte = person as FullTimeEmployee;
console.log('Salary from "as":', fte.getSalary());
console.log(fte.describe());


// 2. Using the angle-bracket <> syntax
// Note: This syntax doesn't work in .tsx files (React) because it conflicts with JSX.
const fte2 = <FullTimeEmployee>person;
console.log('Salary from "<>":', fte2.getSalary());