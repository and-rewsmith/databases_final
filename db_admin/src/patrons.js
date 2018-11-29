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
import { validateISBN } from './books';


export const PatronEdit = props => (
    <Edit {...props}>
        <SimpleForm submitOnEnter={false} asyncValidate={validateISBN} asyncBlurFields={[ 'isbn' ]}>
            <DisabledInput source="id" />
            <DisabledInput source="first_name" />
            <DisabledInput source="last_name" />
            <TextInput label="Return book by book ID" source="book_id" />
        </SimpleForm>
    </Edit>
);

export const PatronList = props => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <TextField source="first_name" />
            <TextField source="last_name" />
            <EditButton />
        </Datagrid>
    </List>
);

