import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { deletePersonAsync } from '../api/Api';

interface IProps {
    people: Array<IPerson>;
    onSelect: (person: IPerson) => void;
    onDeleted: (deleted: IPerson) => void;
}

/**
 * Displays a list of people in a sortable table
 */
export const PersonList = ({ people, onSelect,onDeleted }: IProps) => {
    return (
        <Container>
            {people.map(p => <PersonRow key={p.id} person={p} onSelect={onSelect} onDeleted={onDeleted} />)}
        </Container>
    )
};
const Container = styled.div`
    display: flex;
    flex-direction: column;
`;

interface IPersonRowProps {
    person: IPerson;
    onSelect?: (person:IPerson) => void;
    onDeleted: (deleted: IPerson) => void;
}

/**
 * Displays a single person's information in a row. Also allows deletion of 
 * the person.
 */
const PersonRow = ({person, onSelect, onDeleted}:IPersonRowProps) => {
    const [deleteOp, deletePerson] = useDeleteApi(person, onDeleted);

    if(deleteOp.deleting) {
        return(
            <RowContainer>
                Deleting...
            </RowContainer>
        )
    }

    return (
        <RowContainer
            onClick={() => { if(onSelect) onSelect(person); }}
        >
            <div>{person.firstName || '-'}</div>
            <div>{person.middleInitial || '-'}</div>
            <div>{person.lastName || '-'}</div>
            <div>{person.age !== undefined ? person.age : '-'}</div>
            <div>{person.emailAddress || '-'}</div>
            <div>{person.hairColor || '-'}</div>
            <div>
                <button onClick={(e) => { 
                    deletePerson();

                    // Prevent the event from bubbling into the overall parent click handler
                    e.stopPropagation(); 
                }}>
                    Delete
                </button>
            </div>
        </RowContainer>
    );
}

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



interface IDeleteOperation {
    deleting: boolean;
    error?: Error;
}

/**
 * Convenience method to store all the steps involved in running the delete operation.
 * @param person Person to delete
 * @param onDeleted Callback to call after the person has been successfully deleted.
 */
const useDeleteApi = (person, onDeleted): [IDeleteOperation, () => void] => {
    const [deleteOp, setDeleteOp] = useState({deleting: false} as IDeleteOperation);

    useEffect(() => {
        if(!deleteOp.deleting) return;

        const deleteIt = async () => {
            try {
                await deletePersonAsync(person);
                setDeleteOp({deleting: false});
                onDeleted(person);
            }
            catch(e) {
                setDeleteOp({deleting: false, error: e});
            }
        }

        deleteIt();

    }, [deleteOp.deleting]);

    // Make a more convenient function for the caller.
    const deletePerson = () => setDeleteOp({ deleting: true })

    return [deleteOp, deletePerson];
}