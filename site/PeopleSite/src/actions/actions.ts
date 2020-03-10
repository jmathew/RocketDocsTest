import { IPerson } from '../models/Store';

export interface IAddPersonAction {
    type: 'addPerson';
    payload: IPerson;
}

export interface IUpdatePersonAction {
    type: 'updatePerson';
    payload: IPerson;
}

export interface IDeletePersonAction {
    type: 'deletePerson';
    payload: IPerson;
}

export interface IFetchPeoplAction {
    type: 'fetchPeople';
}