export interface IStore {
    people: Array<IPerson>;
}

export interface IPerson {
    id: string;
    firstName: string;
    lastName: string;
    middleInitial: string;
    age: number;

    // TODO:
    emailAddress: string;

    // This will be a # code (though it is not validated on the server)
    hairColor: string;
}

/**
 * Creates a store with the default values
 */
export const createStore = ():IStore => ({
    people: [
        ({ id: "adsf", firstName: "jon", lastName: "arbuckle", middleInitial: "p", age: 22, emailAddress: "asdf@asdf.com", hairColor: "#000"} as IPerson),
        ({ id: "ads2f", firstName: "jon", lastName: "arbuckle", middleInitial: "p", age: 22, emailAddress: "asdf@asdf.com", hairColor: "#000"} as IPerson),
    ],
});