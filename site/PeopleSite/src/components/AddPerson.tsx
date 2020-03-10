import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
    onAdd: (person: IPerson) => void;
}

export const AddPerson = ({ onAdd }: IProps) => {
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

    return (
        <Container>
            <Field><input value={person.firstName} onChange={onValueChange('firstName')} /> </Field>
            <Field><input value={person.middleInitial} onChange={onValueChange('middleInitial')} /> </Field>
            <Field><input value={person.lastName} onChange={onValueChange('lastName')} /> </Field>
            <Field><input value={person.age} onChange={onValueChange('age')} /> </Field>
            <Field><input value={person.emailAddress} onChange={onValueChange('emailAddress')} /> </Field>
            <Field><input value={person.hairColor} onChange={onValueChange('hairColor')} /> </Field>
            <button onClick={e => onAdd(person)}>Add</button>
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