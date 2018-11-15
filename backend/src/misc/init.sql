drop schema if exists Library;

create schema if not exists Library;

use Library;
-- set search_path to Library;

create table if not exists patron(
	patron_id	int	NOT NULL AUTO_INCREMENT,
    last_name	varchar(256)	NOT NULL,
    first_name	varchar(256)	NOT NULL,
    email		varchar(256)	NOT NULL,
    pwd	varchar(256)	NOT NULL,
    PRIMARY KEY (patron_id)
);

create table if not exists isbn_table(
    isbn        varchar(15) NOT NULL,
    title       varchar(3000) NOT NULL,
    dewey       INT NOT NULL,
    format      ENUM('hard', 'paper'),
    pages       INT NOT NULL,
    PRIMARY KEY (isbn)
);

create table if not exists book(
	book_id		INT NOT NULL AUTO_INCREMENT,
    isbn        varchar(15) NOT NULL,
    con   ENUM('excellent', 'good', 'poor', 'bad') NOT NULL,
    foreign key (isbn) references isbn_table(isbn),
    PRIMARY KEY (book_id)
);

create table if not exists author(
	author_id	int	NOT NULL AUTO_INCREMENT,
    last_name   varchar(256)    NOT NULL,
    first_name	varchar(256)	NOT NULL,
    PRIMARY KEY (author_id)
);

create table if not exists vendor(
	vendor_id	    int	NOT NULL AUTO_INCREMENT,
    company_name	varchar(256)	NOT NULL,
    address	        varchar(256)	NOT NULL,
    PRIMARY KEY (vendor_id)
);

create table if not exists publisher(
	publisher_id	int	NOT NULL AUTO_INCREMENT,
    company_name	varchar(256)	NOT NULL,
    address	        varchar(256)	NOT NULL,
    PRIMARY KEY (publisher_id)
);

create table if not exists writes(
	write_id	int NOT NULL AUTO_INCREMENT,
    isbn        varchar(15) NOT NULL,
    author_id	int NOT NULL,
    foreign key (author_id) references author(author_id),
    foreign key (isbn) references isbn_table(isbn),
    PRIMARY KEY (write_id)
);

create table if not exists sells(
	sell_id	int NOT NULL AUTO_INCREMENT,
    isbn        varchar(15) NOT NULL,
    vendor_id	int NOT NULL,
    foreign key (vendor_id) references vendor(vendor_id),
    foreign key (isbn) references isbn_table(isbn),
    PRIMARY KEY (sell_id)
);

create table if not exists publishes(
    publish_id int NOT NULL AUTO_INCREMENT,
    isbn        varchar(15) NOT NULL,
    publisher_id   int NOT NULL,
    foreign key (publisher_id) references publisher(publisher_id),
    foreign key (isbn) references isbn_table(isbn),
    PRIMARY KEY (publish_id)
);

create table if not exists checked_out(
    checked_out_id int NOT NULL AUTO_INCREMENT,
    book_id        int NOT NULL,
    patron_id   int NOT NULL,
    start_date  date NOT NULL,
    foreign key (book_id) references book(book_id),
    foreign key (patron_id) references patron(patron_id),
    PRIMARY KEY (checked_out_id)
);

create table if not exists reserves(
    reserves_id int NOT NULL AUTO_INCREMENT,
    book_id        int NOT NULL,
    patron_id   int NOT NULL,
    foreign key (book_id) references book(book_id),
    foreign key (patron_id) references patron(patron_id),
    PRIMARY KEY (reserves_id)
);