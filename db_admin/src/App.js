// in src/App.js
import React from 'react';
import { Admin, Resource, ListGuesser, EditGuesser} from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { BookList, BookCreate, BookEdit } from './books';
import dataProvider from './dataProvider';


const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="books" list={BookList} edit={BookEdit} create={BookCreate}/>
    </Admin>
);

export default App;