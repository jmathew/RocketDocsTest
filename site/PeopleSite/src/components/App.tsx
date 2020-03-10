import React, { useState, useReducer } from 'react';
import { createStore, IPerson, IStore } from '../models/Store';
import { EditPerson } from './EditPerson';
import { PersonList } from './PersonList';
import styled from 'styled-components';
import { IAddPersonAction, IUpdatePersonAction, IDeletePersonAction } from '../actions/actions';
import { AddPerson } from './AddPerson';
import {v4 as uuidv4} from 'uuid';

/**
 * Holds on to application state.
 */
export const App = () => {
    const [people, dispatch] = useReducer(peopleReducer, []);
    const [editingPerson, setEditingPerson] = useState(undefined);
    const [addingPerson, setAddingPerson]  = useState(false);

    return (
        <div style={{display: 'relative'}}>
            <FullPage>
                <button onClick={() => setAddingPerson(true)}>Add new person</button>
                <PersonList people={people}  onSelect={setEditingPerson} />
            </FullPage>
            {editingPerson && (
                <FullPage>
                    <EditPerson person={editingPerson} onEdit={() => {}} onDoneEdit={() => setEditingPerson(undefined)}/>
                </FullPage>
            )}
            {addingPerson && (
                <FullPage>
                    <AddPerson onAdd={p => {
                        dispatch({ type: 'addPerson', payload: p});
                        setAddingPerson(false);
                    }} />
                </FullPage>
            )}
        </div>
    )
}

const FullPage = styled.div`
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    background-color: #fff;
`;


const peopleReducer = (state: Array<IPerson>, action: IAddPersonAction | IUpdatePersonAction | IDeletePersonAction) => {
    switch(action.type) {
        case 'addPerson':
            const addedPerson = Object.assign({}, action.payload, { id: uuidv4() });
            // No validation. Just take the person and add it to the list.
            return state.concat(addedPerson);
        case 'updatePerson':
            // No validation. Replace wholesale the old person with the new.
            const updatedPerson = action.payload;
            state.map(p => p.id === updatedPerson.id ? updatedPerson : p);
            return state;
        case 'deletePerson':
            // No validation. Remove from the list.
            return state.filter(p => p.id !== action.payload.id);
        default:
            throw new Error(`Unknown action: ${action}`)
    }
}


const createPerson = async (dispatch, person: IPerson) => {
    const response = await fetch(`http://localhost:5000/api/people`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(person),
    });

    if(!response.ok) {
        throw new Error(`Network request to add person failed: '${response.status}'`)
    }

    // This is not a guarantee that the value in json is a person. Just convenience.
    // There would normally be a validation step here if performance isn't an issue.
    const json = await response.json() as IPerson;
}


