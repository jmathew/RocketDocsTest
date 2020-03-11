import React, { useState, useReducer, useEffect } from 'react';
import { PersonList } from './PersonList';
import styled from 'styled-components';
import { AddOrEditPerson } from './AddOrEditPerson';
import { IPerson } from '../models/Models';

interface IInitialFetch {
    done: boolean;
    error?: Error;
}

export const App = () => {
    const [people, setPeople ] = useState([]);
    const initialFetch = useInitialFetch(setPeople);
    const [addPerson, setAddPerson] = useState(false);
    const [editPerson, setEditPerson] = useState();

    // Handle UIs for initial fetch.
    if(!initialFetch.done) {
        return (<div>Loading list of users...</div>);
    }
    if(initialFetch.error) {
        return (<div>There was an error fetching the list of users: {initialFetch.error.message}</div>)
    }

    // These are callbacks for when a person is edited / added in one of our child components
    const onPersonAdded = (person: IPerson) => {
        setPeople(people.concat(person));
    };
    const onPersonUpdated = (person: IPerson) => {
        setPeople(people.map(p => p.id === person.id ? person : p));
    };


    return (
        <div style={{display: 'relative'}}>
            <FullPage>
                <button onClick={e => setAddPerson(true)}>Add new person</button>
                <PersonList people={people} onSelect={(p) => {
                    setEditPerson(p);
                }}
                />
            </FullPage>

            {editPerson && (
                <FullPage>
                    <AddOrEditPerson 
                        initialPerson={editPerson}
                        onPersonAdded={onPersonAdded}
                        onPersonUpdated={onPersonUpdated}
                        onDone={() => {
                            setEditPerson(undefined);
                        }}
                    />
                </FullPage>
            )}
            {addPerson && (
                <FullPage>
                    <AddOrEditPerson 
                        onPersonAdded={onPersonAdded}
                        onPersonUpdated={onPersonUpdated}
                        onDone={() => {
                            setAddPerson(false);
                        }}
                    />
                </FullPage>
            )}
        </div>
    )
}

/**
 * All logic required to handle initial fetching of user list.
 * @param setPeople Callback that will provide the caller with new list of people
 */
const useInitialFetch = (setPeople) => {
    const state = useState({done: false } as IInitialFetch);
    const [initialFetch, setInitialFetch] = state;

    // Load initial list of users
    useEffect(() => {
        const fetchIt = async () => {
            try {
                const people = await fetchUsersAsync();
                setPeople(people);
                setInitialFetch({done: true });
            }
            catch(e) {
                setInitialFetch({done: true, error: e});
            }
        }

        fetchIt();
    }, 
    // This empty dependency list means this effect will only ever run once.
    []
    );

    return initialFetch;
}

const FullPage = styled.div`
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: #fff;
    padding: 1em 3em;
`;

const fetchUsersAsync = async () => {
    const response = await fetch(`http://localhost:5000/api/people`);
    if(!response.ok) {
        throw new Error(`Server responded with not OK: '${response.status}' '${response.statusText}'`);
    }

    const json = await response.json();

    return json;
}