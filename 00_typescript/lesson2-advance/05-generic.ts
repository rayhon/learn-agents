 // With generics, you write ONE function that works for everything.
 // `T` is a placeholder for whatever type the user provides.
function wrapValueInObject<T>(value: T): { data: T } {
    return { data: value };
}
 
// Now we can use it with different types:
const stringWrapper = wrapValueInObject("hello");
console.log(stringWrapper);
 
const numberWrapper = wrapValueInObject(123);
console.log(numberWrapper);


// --- generic class
class Stack<T> {
    private elements: T[] = [];

    constructor(private size: number) {
    }
    isEmpty(): boolean {
        return this.elements.length === 0;
    }
    isFull(): boolean {
        return this.elements.length === this.size;
    }
    push(element: T): void {
        if (this.elements.length === this.size) {
            throw new Error('The stack is overflow!');
        }
        this.elements.push(element);

    }
    pop(): T {
        if (this.elements.length == 0) {
            throw new Error('The stack is empty!');
        }
        return this.elements.pop()!;
    }
}

let numbers = new Stack<number>(5);
function randBetween(low: number, high: number): number {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

while (!numbers.isFull()) {
    let n = randBetween(1, 10);
    console.log(`Push ${n} into the stack.`)
    numbers.push(n);
}

while (!numbers.isEmpty()) {
    let n = numbers.pop();
    console.log(`Pop ${n} from the stack.`);
}


let words = 'The quick brown fox jumps over the lazy dog'.split(' ');

let wordStack = new Stack<string>(words.length);

// push words into the stack
words.forEach(word => wordStack.push(word));

// pop words from the stack
while (!wordStack.isEmpty()) {
    console.log(wordStack.pop());
}


// --- generic interface
