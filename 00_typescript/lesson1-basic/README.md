## Scope
By default, if a TypeScript file doesn't have any top-level import or export statements, it's treated as a
script, not a module. When files are treated as scripts, all the variables and functions declared inside them
live in a single global scope that is shared across all other script files in the same project.

You can think of it like the compiler takes the content of all your script files and puts them together into
one big file. If you have let arr = ... in index.ts and let arr = ... in test-arrays.ts, it's like you're
declaring the same variable twice in the same file, which isn't allowed.

To fix this, you need to tell TypeScript to treat each file as a separate module. A module has its own scope,
so variables declared inside it are not global. A file becomes a module as soon as you add any import or
export statement to it.

## tsconfig.json

```bash
# generate tsconfig.json
tsc --init

# compile with tsconfig.json honored (run it without single file specified)
tsc 
```

## Primitive types
In JavaScript, a primitive value is data that is not an object and has no methods. There are 7 primitive data types:

```typescript
string
number
bigint
boolean
undefined
null
symbol
```

## Type Annotation
* Better not explicitly specified type as it can be inferred (type inference)
* To allow variable assigned to different type, you can specify "any" type

```typescript
let id: number = 5;
let firstname: string = 'danny';
let hasDog: boolean = true;

let unit: number; // Declare variable without assigning a value
unit = 5;
```