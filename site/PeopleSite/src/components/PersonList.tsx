import { IPerson } from '../models/Store';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface IProps {
    people: Array<IPerson>;
    onSelect: (person: IPerson) => void;
}

export const PersonList = ({ people, onSelect }: IProps) => {
    console.log(people);
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
    <div>
        <span><button onClick={() => { if(onEdit) onEdit(person); }}>Edit</button></span>
        <span>{person.firstName}</span>
        <span>{person.middleInitial}</span>
        <span>{person.lastName}</span>
        <span>{person.age}</span>
        <span>{person.emailAddress}</span>
        <span>{person.hairColor}</span>
    </div>
)