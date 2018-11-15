import React from 'react';
import {
    Responsive,
    SimpleList,
    List,
    Datagrid,
    EmailField,
    TextField, Filter, ReferenceInput, SelectInput, TextInput, UrlField
} from 'react-admin';


const UserFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" alwaysOn />
        <ReferenceInput label="test" allowEmpty>
            <SelectInput optionText="test" />
        </ReferenceInput>
    </Filter>
);


export const UserList = props => (
    <List title="All users" {...props} filters={<UserFilter />}>
        <Responsive
            small={
                <SimpleList
                    primaryText={record => record.name}
                    secondaryText={record => record.username}
                    tertiaryText={record => record.email}
                />
            }
            medium={
                <Datagrid>
                    <TextField source="id" />
                    <TextField source="name" />
                    <TextField source="username" />
                    <EmailField source="email" />
                </Datagrid>
            }
        />
    </List>
);