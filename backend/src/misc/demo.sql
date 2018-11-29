SELECT 
    book.book_id AS id,
    isbn_table.title,
    CONCAT(author.first_name, ' ', author.last_name) AS author,
    isbn_table.format,
    isbn_table.pages,
    book.isbn,
    isbn_table.dewey,
    book.con
FROM
    book
        INNER JOIN
    isbn_table ON book.isbn = isbn_table.isbn
        INNER JOIN
    writes ON book.isbn = writes.isbn
        INNER JOIN
    author ON writes.author_id = author.author_id
ORDER BY id DESC
LIMIT 0 , 10;









select * FROM checked_out








SELECT 
    isbn_table.isbn,
    isbn_table.title,
    isbn_table.dewey,
    isbn_table.format,
    isbn_table.pages
FROM
    isbn_table
WHERE
    isbn_table.isbn NOT IN (SELECT 
            book.isbn
        FROM
            book
                INNER JOIN
            isbn_table ON book.isbn = isbn_table.isbn);