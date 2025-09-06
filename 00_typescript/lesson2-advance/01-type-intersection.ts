interface Identity {
    id: number;
    name: string;
}

interface Contact {
    email: string;
    phone: string;
    address?: string;
}

type Employee = Identity & Contact;


let e: Employee = {
    id: 100,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(408)-897-5684'
};