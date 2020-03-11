import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { addOrEditPersonAsync } from '../api/Api';

interface IProps {
    onPersonAdded: (added: IPerson) => void;
    onPersonUpdated: (updated: IPerson) => void;
    onDone: () => void;
    initialPerson?: IPerson;
}

export const AddOrEditPerson = ({ initialPerson, onPersonAdded, onPersonUpdated, onDone}: IProps) => {
    const [person, setPerson] = useState(initialPerson || {
        firstName: '',
        lastName: '',
        middleInitial: '',
        age: 0,
        emailAddress: '',
        hairColor: '',
    } as IPerson);

    const onValueChange = (field: string) => (e) => {
        const updated = Object.assign({} as IPerson, person, {
            [field]: e.target.value
        } as IPerson);
        setPerson(updated);
    }

    const onNumericValueChange = (field: string) => (e) => {
        const newValue = e.target.value;
        let parsed;
        try {
            parsed = parseInt(newValue);
        }
        catch(e){
            console.log('Invalid input', newValue, e);
        }
        if(isNaN(parsed)) parsed = 0;
        const updated = Object.assign({} as IPerson, person, {
            [field]: parsed,
        } as IPerson);
        setPerson(updated);
    }


    const [fetch, makeCall] = useAddOrEditPersonApi(person, setPerson, onPersonAdded, onPersonUpdated);

    if(!fetch.done) {
        return (
            <Container>Making call...</Container>
        )
    }

    return (
        <Container>
            <Field>
                <div>First Name:</div>
                <input disabled={!fetch.done} value={person.firstName} onChange={onValueChange('firstName')} /> 
            </Field>
            <Field>
                <div>MiddleInitial:</div>
                <input disabled={!fetch.done} value={person.middleInitial} onChange={onValueChange('middleInitial')} /> 
            </Field>
            <Field>
                <div>Last Name:</div>
                <input disabled={!fetch.done} value={person.lastName} onChange={onValueChange('lastName')} /> 
            </Field>
            <Field>
                <div>Age:</div>
                <input disabled={!fetch.done} value={person.age} onChange={onNumericValueChange('age')} /> 
            </Field>
            <Field>
                <div>Hair Color: </div>
                <input disabled={!fetch.done} value={person.hairColor} onChange={onValueChange('hairColor')} /> 
            </Field>
            <button disabled={!fetch.done} onClick={e => makeCall()}>{person.id ? `Update` : `Add`}</button>
            <button disabled={!fetch.done} onClick={e => onDone()}>Return to list</button>
        </Container>
    )
};



const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
`;

interface IAddOrUpdateOperation {
    done: boolean;
    error?: Error;
}

/**
 * Convenience method to store all the steps involved in running the delete operation.
 * @param person Person to add or update
 * @param onPersonAdded Callback to call when the person is added.
 * @param onPersonUpdated Callback to call when the person is updated.
 */
const useAddOrEditPersonApi = (person, setPerson, onPersonAdded, onPersonUpdated): [IAddOrUpdateOperation, () => void] => {
    const [operation, setOperation] = useState({ done: true } as IAddOrUpdateOperation)

    useEffect(() => {
        if(operation.done) return;

        const callIt = async () => {
            try {
                // If it has id it is an edit and not an add TODO
                const updated = await addOrEditPersonAsync(person);

                // Call the appropriate callback
                if(!person.id) onPersonAdded(updated);
                if(person.id) onPersonUpdated(updated);


                setPerson(updated);
                setOperation({done: true })
            }
            catch (e) {
                setOperation({done: true, error: e})
            }
        };

        callIt();
    },
    [operation.done]);

    // Make a more convenient function for the caller.
    const makeCall = () => setOperation({ done: false })

    return [operation, makeCall]
}