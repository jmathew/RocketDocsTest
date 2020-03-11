import { IPerson } from '../models/Models';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { deletePersonAsync } from '../api/Api';
import _ from 'lodash';

interface IProps {
    /**
     * Array of people objects to display in the table.
     */
    people: Array<IPerson>;

    /**
     * Called whenever the user clicks a row of the table.
     */
    onSelect: (person: IPerson) => void;

    /**
     * Called whenever the user deletes a person.
     */
    onDeleted: (deleted: IPerson) => void;
}

/**
 * Displays a list of people in a sortable table.
 */
export const PersonList = ({ people, onSelect,onDeleted }: IProps) => {
    const [sortBy, setSortBy] = useState<keyof IPerson>('lastName');
    const [sortedPeople, setSortedPeople] = useState(_.sortBy(people, sortBy));

    useEffect(
        () => {
            const sorted = _.sortBy(people, sortBy);
            setSortedPeople(sorted);
        },
        [sortBy, people]
    );

    return (
        <Container>
            <thead>
                <tr>
                    <td onClick={() => setSortBy('firstName')}>First Name</td>
                    <td onClick={() => setSortBy('lastName')}>Last Name</td>
                    <td onClick={() => setSortBy('middleInitial')}>Middle Initial</td>
                    <td onClick={() => setSortBy('age')}>Age</td>
                    <td onClick={() => setSortBy('email')}>Email</td>
                    <td onClick={() => setSortBy('hairColor')}>Hair color</td>
                </tr>
            </thead>
            <tbody>
                {sortedPeople.map(p => <PersonRow key={p.id} person={p} onSelect={onSelect} onDeleted={onDeleted} />)}
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

    // Display a simple UI while we're making the API call.
    if(deleteOp.deleting) {
        return(
            <RowContainer>
                <td>Deleting...</td>
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
            <td>{person.email || '-'}</td>
            <td style={{ backgroundColor: person.hairColor || 'none' }}>{person.hairColor || '-'}</td>
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