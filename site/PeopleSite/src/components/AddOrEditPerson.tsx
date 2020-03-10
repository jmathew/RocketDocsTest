import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
    onDone: () => void;
}

export const AddOrEditPerson = ({ onDone}: IProps) => {
    const [person, setPerson] = useState({
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

    const [makingCall, setMakingCall] = useState(false);
    const [fetch, setFetch] = useState({ done: true } as IFetch)

    useEffect(() => {
        if(!makingCall) return;

        const callIt = async () => {
            try {

                // If it has id it is an edit and not an add TODO
                const updated = await addOrEditPersonAsync(person);
                setPerson(updated);
                setFetch({done: true })
                setMakingCall(false);
            }
            catch (e) {
                setFetch({done: true, error: e})
                setMakingCall(false); // TODO: remove this
            }
        };

        callIt();
    },
    [makingCall]);

    if(!fetch.done) {
        return (
            <Container>Making call...</Container>
        )
    }

    return (
        <Container>
            <Field>
                <div>First Name:</div>
                <input disabled={makingCall} value={person.firstName} onChange={onValueChange('firstName')} /> 
            </Field>
            <Field>
                <div>MiddleInitial:</div>
                <input disabled={makingCall} value={person.middleInitial} onChange={onValueChange('middleInitial')} /> 
            </Field>
            <Field>
                <div>Last Name:</div>
                <input disabled={makingCall} value={person.lastName} onChange={onValueChange('lastName')} /> 
            </Field>
            <Field>
                <div>Age:</div>
                <input disabled={makingCall} value={person.age} onChange={onValueChange('age')} /> 
            </Field>
            <Field>
                <div>Hair Color: </div>
                <input disabled={makingCall} value={person.hairColor} onChange={onValueChange('hairColor')} /> 
            </Field>
            <button disabled={makingCall} onClick={e => setMakingCall(true)}>{person.id ? `Update` : `Add`}</button>
            <button disabled={makingCall} onClick={e => onDone()}>Return to list</button>
        </Container>
    )
};

interface IFetch {
    done: boolean;
    error?: Error;
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const Field = styled.div`
    display: flex;
    flex-direction: column;
`;

const addOrEditPersonAsync = async (person: IPerson) => {
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
            // TODO: Email
            Age: person.age,
            HairColor: person.hairColor,
        }),
    });

    const json = await response.json();

    return json as IPerson;
}
