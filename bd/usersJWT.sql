use travel_agency;
create table usuarios(
	id int auto_increment primary key not null,
    email varchar(255) unique,
    nombre varchar(100),
    password TEXT
);