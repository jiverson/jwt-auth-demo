CREATE TABLE users (
	id serial PRIMARY KEY,
	email text UNIQUE NOT NULL,
	password text NOT NULL,
  token_version integer DEFAULT 1 NOT NULL,
  created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	deleted_at TIMESTAMP
);
