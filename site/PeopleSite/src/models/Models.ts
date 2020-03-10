

export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    middleInitial: string;
    age: number;

    emailAddress: string;

    // This will be a # code (though it is not validated on the server)
    hairColor: string;
}