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
            <tbody>
                {people.map(p => <PersonRow key={p.id} person={p} onSelect={onSelect} onDeleted={onDeleted} />)}
            </tbody>
        </Container>
    )
};
const Container = styled.table`
    width: 100%;
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
            <td>{person.firstName || '-'}</td>
            <td>{person.middleInitial || '-'}</td>
            <td>{person.lastName || '-'}</td>
            <td>{person.age !== undefined ? person.age : '-'}</td>
            <td>{person.emailAddress || '-'}</td>
            <td>{person.hairColor || '-'}</td>
            <td>
                <button 
                    style={{
                        width: '100%'
                    }}
                    onClick={(e) => { 
                        deletePerson();

                        // Prevent the event from bubbling into the overall parent click handler
                        e.stopPropagation(); 
                    }}
                >
                    Delete
                </button>
            </td>
        </RowContainer>
    );
}

const RowContainer = styled.tr`
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