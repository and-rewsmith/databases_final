// in src/App.js
import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { BookList, BookCreate, BookEdit } from './books';
import {PatronList, PatronEdit} from './patrons';
import {Missing_isbnList} from './missing_isbn';
import dataProvider from './dataProvider';
import Dashboard from './Dashboard';


const App = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource name="books" list={BookList} edit={BookEdit} create={BookCreate}/>
        <Resource name="patrons" list={PatronList} edit={PatronEdit}/>
        <Resource name="missing_isbn" list={Missing_isbnList}/>
    </Admin>
);

export default App;