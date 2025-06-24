CREATE ROLE adminrole;
CREATE USER adminuno WITH ENCRYPTED PASSWORD 'pwod.2025' IN ROLE "adminrole";

ALTER ROLE adminrole CREATEDB;
GRANT adminrole TO postgres;

CREATE DATABASE simulacion
  WITH OWNER = adminrole
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_MX.utf8'
  LC_CTYPE = 'es_MX.utf8'
  CONNECTION LIMIT = -1
  TEMPLATE = template0;

GRANT ALL PRIVILEGES ON DATABASE simulacion TO adminrole;

\c simulacion

CREATE EXTENSION IF NOT EXISTS dblink;
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE SCHEMA IF NOT EXISTS seguridad AUTHORIZATION adminrole;

CREATE TABLE IF NOT EXISTS seguridad.roles (
    id integer NOT NULL PRIMARY KEY,
    role character varying(100),
    perfil json[],
    descripcion text,
    fecha_registro timestamp NOT NULL DEFAULT current_timestamp
);

ALTER TABLE seguridad.roles OWNER TO adminrole;
GRANT ALL ON TABLE seguridad.roles TO adminrole;

INSERT INTO seguridad.roles (id, role, perfil, descripcion)
VALUES (1, 'usuario', ARRAY[]::json[], 'Rol por defecto para nuevos usuarios')
ON CONFLICT DO NOTHING;

CREATE TABLE IF NOT EXISTS seguridad.usuarios (
    id serial PRIMARY KEY,
    email character varying(100) NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    roles integer[],
    registro_fecha timestamp NOT NULL DEFAULT current_timestamp,
    registro_usuario integer NOT NULL DEFAULT 0,
    CONSTRAINT uk_email UNIQUE (email),
    CONSTRAINT uk_username UNIQUE (username)
);

ALTER TABLE seguridad.usuarios OWNER TO adminrole;
GRANT ALL ON TABLE seguridad.usuarios TO adminrole;

CREATE SCHEMA IF NOT EXISTS sistemas AUTHORIZATION adminrole;


CREATE TABLE IF NOT EXISTS sistemas.dispositivos (
    id serial PRIMARY KEY,
    nombre character varying(100) NOT NULL,
    ubicacion character varying(100) NOT NULL,
    coordenadas character varying(100) NOT NULL,
    potencia json,
    voltaje json,
    corriente json,
    caudal json,
    estado integer NOT NULL DEFAULT 1,
    registro_fecha timestamp NOT NULL DEFAULT current_timestamp,
    registro_usuario integer NOT NULL DEFAULT 0,
    CONSTRAINT uk_nombre UNIQUE (nombre)
);

ALTER TABLE sistemas.dispositivos OWNER TO adminrole;
GRANT ALL ON TABLE sistemas.dispositivos TO adminrole;
