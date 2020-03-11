import { IPerson } from '../models/Models';

export const fetchUsersAsync = async () => {
    const response = await fetch(`http://localhost:5000/api/people`);
    if(!response.ok) {
        throw new Error(`Server responded with not OK: '${response.status}' '${response.statusText}'`);
    }

    const json = await response.json();

    return json;
}

export const addOrEditPersonAsync = async (person: IPerson) => {
    const endpoint = person.id ? `people/${person.id}` : `people`;
    const method = person.id ? 'PUT' : 'POST';

    const response = await fetch(`http://localhost:5000/api/${endpoint}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            FirstName: person.firstName,
            LastName: person.lastName,
            MiddleInitial: person.middleInitial,
            Email: person.email,
            Age: person.age,
            HairColor: person.hairColor,
        }),
    });

    if(!response.ok) {
        throw new Error(`Server responded with not OK: '${response.status}' '${response.statusText}'`);
    }

    const json = await response.json();

    return json as IPerson;
}

export const deletePersonAsync = async (person: IPerson) => {
    const response = await fetch(`http://localhost:5000/api/people/${person.id}`, {
        method: 'DELETE',
    });

    if(!response.ok) {
        throw new Error(`Server responded with not OK: '${response.status}' '${response.statusText}'`);
    }

    // Delete has no body so if it succeeded none of the above will throw.
}
