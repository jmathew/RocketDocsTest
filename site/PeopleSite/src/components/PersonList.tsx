import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
    people: Array<IPerson>;
    onSelect: (person: IPerson) => void;
}

export const PersonList = ({ people, onSelect }: IProps) => {
    return (
        <Container>
            {people.map(p => <PersonRow key={p.id} person={p} onEdit={onSelect}/>)}
        </Container>
    )
};
const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

const PersonRow = ({person, onEdit}:{person: IPerson, onEdit?: (person:IPerson) => void}) => (
    <RowContainer
        onClick={() => { if(onEdit) onEdit(person); }}
    >
        <div>{person.firstName || '-'}</div>
        <div>{person.middleInitial || '-'}</div>
        <div>{person.lastName || '-'}</div>
        <div>{person.age !== undefined ? person.age : '-'}</div>
        <div>{person.emailAddress || '-'}</div>
        <div>{person.hairColor || '-'}</div>
    </RowContainer>
)

const RowContainer = styled.div`
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    cursor: pointer;

    &:hover {
        background-color: #EEE
    }
`;