CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url TEXT NOT NULL CHECK (trim(url) <> ''),
    title TEXT NOT NULL CHECK (trim(title) <> ''),
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Tommy Farfalle', 'https://pasta.code', 'Spaghetti coding 101');
insert into blogs (author, url, title) values ('Stacktrace Steve', 'https://code.com', 'The Bug Whisperer');
