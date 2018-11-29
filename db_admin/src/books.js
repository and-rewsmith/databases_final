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


const BookFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Search" source="q" alwaysOn />
        <SelectInput label="Attribute" source="attribute" choices={[
               { id: 'isbn_table|title', name: 'Title' },
               { id: 'isbn_table|isbn', name: 'ISBN' },
               { id: 'author|last_name', name: 'Author Last Name' }
        ]} />
    </Filter>
);


export const BookList = props => (
    <List title="Library Administration Portal" {...props} filters={<BookFilter />}>
	    <Datagrid>
	        <TextField source="id" />
	        <TextField source="title" />
	        <TextField source="author" />
            <TextField source="format" />
            <TextField source="pages" />
            <TextField source="isbn" />
            <TextField source="dewey" />
            <TextField label="Condition" source="con"/>
            <EditButton />
	    </Datagrid>
    </List>
);

const BookTitle = ({ record }) => {

    if (record) {
        return <span>Book #{record ? `${record.id}: ${record.title}` : '000'}</span>;
    }

    else {
        return <span>Book #00</span>
    }

};

function makeRequest (method, url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}


export const validateISBN = (values) => {
     let edit_validation_endpoint = "http://localhost:3001/isbn/" + JSON.stringify(values.isbn);

    return makeRequest('GET', edit_validation_endpoint)
        .then(function (response) {
            response = JSON.parse(response)
            if (!values.isIsbn && response.status) {
                throw {isbn: ["ISBN not found. If the ISBN is valid, please add it first."]};
            }
        })
        .catch(function (err) {
          throw {isbn: [err.isbn]};
        });
};

export const BookEdit = props => (

    <Edit title={<BookTitle />} {...props}>
        <SimpleForm submitOnEnter={false} asyncValidate={validateISBN} asyncBlurFields={[ 'isbn' ]}>
            <DisabledInput source="id" />
            <DisabledInput source="title" />
            <DisabledInput source="author" />
            <DisabledInput source="format" />
            <DisabledInput source="pages" />
            <TextInput label="ISBN" source="isbn" />
            <DisabledInput source="dewey" />
            <SelectInput label="Condition" source="con" choices={[
               { id: 'excellent', name: 'Excellent' },
               { id: 'good', name: 'Good' },
               { id: 'poor', name: 'Poor' },
               { id: 'bad', name: 'Bad' },
            ]} />
        </SimpleForm>
    </Edit>
);


// in src/posts.js
// reference an ISBN to make a book
export const BookCreate = props => (
    <Create {...props}>
        <SimpleForm submitOnEnter={false} redirect="list" asyncValidate={validateISBN}>
            <BooleanInput label="Create an Isbn" source="isIsbn" />
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="newIsbn" {...rest} />
                    }
                    else {
                        return <TextInput source="isbn"  {...rest} />
                    }
                }
                }
            </FormDataConsumer>
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="title" {...rest} />
                    }
                    else {
                        return <SelectInput label="Condition" source="con" choices={[
               { id: 'excellent', name: 'Excellent' },
               { id: 'good', name: 'Good' },
               { id: 'poor', name: 'Poor' },
               { id: 'bad', name: 'Bad' },
            ]} {...rest} />
                    }
                }
                }
            </FormDataConsumer>
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="dewey" {...rest} />
                    }
                }
                }
             </FormDataConsumer>
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <SelectInput source="format" choices={[
                           { id: 'hard', name: 'Hard' },
                           { id: 'paper', name: 'Paper' },
                        ]} {...rest} />
                    }
                }
                }
            </FormDataConsumer>
            <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="pages" {...rest} />
                    }
                }
                }
             </FormDataConsumer>
             <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="authorFirstName" {...rest} />
                    }
                }
                }
             </FormDataConsumer>
             <FormDataConsumer>
                {({ formData, ...rest }) => {
                    if (formData.isIsbn) {
                        return <TextInput source="authorLastName" {...rest} />
                    }
                }
                }
             </FormDataConsumer>
         </SimpleForm>
    </Create>
);