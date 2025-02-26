create database travel_agency;
use travel_agency;

-- -----------------------------------------------------
-- Table countries
-- -----------------------------------------------------
create table countries(
	id_country int auto_increment primary key not null,
    name varchar(255) not null,
    continent varchar(255) not null
);

-- -----------------------------------------------------
-- Table cities
-- -----------------------------------------------------
create table cities(
	id_city int auto_increment primary key not null,
    name varchar(255) not null,
    language varchar(100) not null,
    fk_country INT NOT NULL,
	constraint fk_country_city foreign key (fk_country) references countries (id_country)
);


-- -----------------------------------------------------
-- Table travel
-- -----------------------------------------------------
create table travel(
	id_travel int auto_increment primary key not null,
    title  varchar(255) not null,
    descript text,
    fk_city int not null,
    constraint fk_city_travel foreign key (fk_city) references cities (id_city),
    fk_country int not null,
    constraint fk_country_travel foreign key (fk_country) references countries (id_country)
);


INSERT INTO countries (name, continent)
VALUES ('Francia', 'Europa'),
       ('Italia', 'Europa'),
       ('España', 'Europa'),
       ('Japón', 'Asia');

INSERT INTO cities (name, language, fk_country)
VALUES ('París', 'Francés', 1),
       ('Roma', 'Italiano', 2),
       ('Valencia', 'Español', 3),
       ('Tokio', 'Japonés', 4);
       
INSERT INTO travel (title, descript, fk_city, fk_country)
VALUES ('Aventura en París', 'Descubre los secretos de París en esta guía.', 1, 1),
       ('Descubre Roma', 'Una guía completa para recorrer Roma.', 2, 2),
       ('Explorando Valencia', 'Conoce los puntos turísticos más famosos de VLC', 3, 3),
       ('Viaje a Tokio', 'Explora Tokio, la mezcla de lo tradicional y lo moderno.', 4, 4),
       ('La historia de Roma', 'Un recorrido por los monumentos más históricos de Roma.', 2, 2),
       ('París, la ciudad del amor', 'Vive la experiencia romántica de París', 1, 1);