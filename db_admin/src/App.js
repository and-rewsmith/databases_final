// in src/App.js
import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import { UserList } from './users';
import dataProvider from './dataProvider';


const App = () => (
    <Admin dataProvider={dataProvider}>
        <Resource name="books" list={UserList} />
    </Admin>
);

export default App;