import React from 'react';
import {
    Responsive,
    SimpleList,
    List,
    Datagrid,
    EmailField,
    TextField, Filter, ReferenceInput, SelectInput, TextInput, UrlField
} from 'react-admin';

/*
{ id: 24,
    Title: 'Al Mahmud in English',
    Author: 'Al Mahmud',
    Format: 'paper',
    Pages: 159,
    ISBN: '9844125774',
    Dewey: 379,
    Condition: 'good' },
*/

const BookFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" alwaysOn />
        <ReferenceInput label="test" allowEmpty>
            <SelectInput optionText="test" />
        </ReferenceInput>
    </Filter>
);


export const BookList = props => (
    <List title="All books" {...props} filters={<BookFilter />}>
	    <Datagrid>
	        <TextField source="id" />
	        <TextField source="Title" />
	        <TextField source="Author" />
            <TextField source="Format" />
            <TextField source="Pages" />
            <TextField source="ISBN" />
            <TextField source="Dewey" />
            <TextField label="Condition" source="Cond"/>
	    </Datagrid>
    </List>
);