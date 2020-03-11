/**
 * Model for a person.
 * This must match the server side model exactly.
 */
export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    middleInitial: string;
    age: number;

    email: string;

    // This will be a # code (though it is not validated on the server)
    hairColor: string;
}