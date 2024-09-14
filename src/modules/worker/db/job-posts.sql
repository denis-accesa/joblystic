DROP TABLE IF EXISTS JobPosts;
CREATE TABLE IF NOT EXISTS JobPosts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  link TEXT NOT NULL UNIQUE,
  status VARCHAR(16) CHECK (status IN ('new', 'crawled', 'disabled')),
  firstSeenOn DATE NOT NULL,
  detailsId INTEGER REFERENCES JobDetails(id)
);

CREATE TABLE IF NOT EXISTS JobDetails (
  id SERIAL PRIMARY KEY,
  category VARCHAR(16) CHECK (category IN ('frontend', 'backend', 'fullstack', 'data', 'platform')),
  salary VARCHAR(255),
  location VARCHAR(255) NOT NULL,
  workMode VARCHAR(255) NOT NULL
);
