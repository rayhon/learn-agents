//  ES6 class syntax 
class Person {
    ssn;
    private firstName;
    protected lastName;

    constructor(ssn: string, firstName: string, lastName: string) {
        this.ssn = ssn;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    describe(): string {
        return `This is Person with name: ${this.firstName} ${this.lastName}.`;
    }

}

let person = new Person('171-28-0926','John','Doe');
console.log(person.getFullName());
console.log(person.ssn);          //you can access the class properties as default it is public
//console.log(person.firstName);  //error due to private
//console.log(person.lastName);   //error - only ok within Person class or its subclasses

// simplified by declare properties and initializ them in constructor like below
class Student {
    constructor(
        ssn: string, 
        private firstName: string, 
        protected lastName: string,
        readonly birthDate: Date
    ){}

    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}

let student = new Student('123-122-111', "dan", "hon", new Date(1990, 12, 25));
//student.birthDate = new Date(1991, 12, 25); // Compile error


//get/set accessor for private properties
class SecretAgent {
    private _age: number;
    private _firstName: string;
    private _lastName: string;
  
    constructor(age: number, firstName: string, lastName: string) {
      this._age = age;
      this._firstName = firstName;
      this._lastName = lastName;
    }
  
    public get age() {
      return this._age;
    }
  
    public set age(theAge: number) {
      if (theAge <= 0 || theAge >= 200) {
        throw new Error('The age is invalid');
      }
      this._age = theAge;
    }
  
    public getFullName(): string {
      return `${this._firstName} ${this._lastName}`;
    }
}


//----- inheritance

abstract class Employee extends Person {
    constructor(
        ssn: string,
        firstName: string,
        lastName: string,
        private jobTitle: string) {
        
        // call the constructor of the Person class:
        super(ssn, firstName, lastName);
    }
    // method overriding
    describe(): string {
        return `This is Employee with lastname:  ${this.lastName}.`;
    }

    abstract getSalary(): number;

}

class FullTimeEmployee extends Employee {
    constructor(ssn: string, firstName: string, lastName: string, jobTitle: string, private salary: number) {
        super(ssn, firstName, lastName, jobTitle);
    }
    getSalary(): number {
        return this.salary;
    }
}

let employee = new FullTimeEmployee("122", 'John','Doe','Front-end Developer', 10000);
console.log("Employee: " + employee.describe() + " with salary: " + employee.getSalary());


// ---- class implements interface
interface Json {
    toJson(): string;
}

class Entity implements Json {
    constructor(private firstName: string, private lastName: string) {}
    toJson(): string {
      return JSON.stringify(this);
    }
}

let entity = new Entity('John', 'Doe');
console.log(entity.toJson());




