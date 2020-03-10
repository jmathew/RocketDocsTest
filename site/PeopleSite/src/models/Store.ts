interface IStore {
    people: Array<IPerson>;
}

interface IPerson {
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
const createStore = ():IStore => ({
    people: [],
});