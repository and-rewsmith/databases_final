import React from 'react';
import {
    Responsive,
    SimpleList,
    List,
    Datagrid,
    EmailField,
    TextField, Filter, ReferenceInput, SelectInput, TextInput, UrlField, EditButton, Create, SimpleForm, LongTextInput,
    Edit, DisabledInput, FormDataConsumer, BooleanInput
} from 'react-admin';

export const Missing_isbnList = props => (
    <List title="Isbns not in Library" {...props}>
        <Datagrid rowClick="edit">
            <TextField label="Isbn" source="id" />
            <TextField source="title" />
            <TextField source="dewey" />
            <TextField source="format" />
            <TextField source="pages" />
            <TextField source="publisher" />
            <TextField source="vendor" />
        </Datagrid>
    </List>
);