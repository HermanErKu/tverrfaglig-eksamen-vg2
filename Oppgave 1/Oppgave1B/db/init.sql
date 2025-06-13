CREATE TABLE Konkurranse (
    id SERIAL PRIMARY KEY,
    navn VARCHAR(255),
    tidspunkt TIMESTAMP
);

CREATE TABLE Deltager (
    id SERIAL PRIMARY KEY,
    navn VARCHAR(255)
);

CREATE TABLE Gruppe (
    id SERIAL PRIMARY KEY,
    navn VARCHAR(255)
);

CREATE TABLE KonkurranseDeltagelse (
    id SERIAL PRIMARY KEY,
    konkurranse_id INTEGER REFERENCES Konkurranse(id),
    deltager_id  INTEGER REFERENCES Deltager(id)
);

CREATE TABLE GruppeMedlemskap (
    id           SERIAL PRIMARY KEY,
    deltager_id  INTEGER REFERENCES Deltager(id),
    gruppe_id    INTEGER REFERENCES Gruppe(id)
);

-- eksempel-grupper:
INSERT INTO Gruppe (navn) VALUES
  ('Action'),('Strategi'),('RPG'),('Sport');
