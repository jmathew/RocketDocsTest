import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
    onEdit: Function;
    onDoneEdit: Function;
    person: IPerson;
}

export const EditPerson = ({ person, onEdit, onDoneEdit }: IProps) => {
    const [editedPerson, setEditedPerson] = useState(person);

    // When the prop changes for whatever reason we reset the edited
    // version to match. This may not be the best idea for all workflows.
    useEffect(() => {
        setEditedPerson(person);
    }, [person])

    // TODO: make into inputs
    return (
        <Container>
            <Field>{person.firstName}</Field>
            <Field>{person.middleInitial}</Field>
            <Field>{person.lastName}</Field>
            <Field>{person.age}</Field>
            <Field>{person.emailAddress}</Field>
            <Field>{person.hairColor}</Field>
            <button onClick={e => onEdit(editedPerson)} >Update</button>
            <button onClick={e => onDoneEdit(editedPerson)} >Done</button>
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

const ss:{ [key:string]: React.CSSProperties} = {
    container: {
        display: 'flex',
        flexDirection: 'column',
    },
    field: {
        display: 'flex',
        flexDirection: 'row',
    },
    label: {
        flex: 1,
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
    }
}