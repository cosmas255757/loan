CREATE TABLE applicants (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    applicant_id INT REFERENCES applicants(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE repayments (
    id SERIAL PRIMARY KEY,
    loan_id INT REFERENCES loans(id) ON DELETE CASCADE,
    amount_paid DECIMAL(10,2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE
);

ALTER TABLE applicants 
  ADD COLUMN living_location VARCHAR(255),
  ADD COLUMN occupation VARCHAR(100),
  ADD COLUMN sex VARCHAR(20) CHECK (sex IN ('Male', 'Female', 'Other')),
  ADD COLUMN relationship_status VARCHAR(50) CHECK (relationship_status IN ('Single', 'Married', 'Divorced', 'Widowed'))


  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, -- Never store raw passwords
    role VARCHAR(20) DEFAULT 'user', -- e.g., 'admin' or 'user'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE loans ADD COLUMN user_id INTEGER REFERENCES users(id);
ALTER TABLE applicants ADD COLUMN user_id INTEGER REFERENCES users(id)
ALTER TABLE repayments ADD COLUMN user_id INTEGER REFERENCES users(id);