-- DROP DATABASE IF EXISTS insurance_docs_portal_db;
-- CREATE DATABASE IF NOT EXISTS insurance_docs_portal_db;
-- DELETE FROM insurance_docs_portal_db.companies WHERE id = 2;
-- ALTER TABLE insurance_docs_portal_db.companies AUTO_INCREMENT = 1;

-- CREATE SUPER ADMIN USER
INSERT INTO insurance_docs_portal_db.users (id, companyId, name, role, status, email, password)
VALUES (1, null, 'Kanha Yadav', 'super_admin', 1, 'kanha@gmail.com', '$2a$10$EfQQuMOJbHez27fUJW2N.uQL0L7lsepzeGRxIGQhyaa3flKTUG5o2');

INSERT INTO insurance_docs_portal_db.country (id, name, code,currency,currencySymbol,capital,continent,countryPhoneCode,status)
VALUES (1, 'United States','US','USD','$','Washington D.C','North America',+1, true);

INSERT INTO insurance_docs_portal_db.state (countryId,name, code,status)
 VALUES(1, 'Alaska','AK', true),
 (1, 'Alabama','AL', true),
 (1, 'Arizona','AZ', true),
 (1, 'Arkansas','AR', true),
 (1, 'California','CR', true),
 (1, 'Colorado','CO', true),
 (1, 'Connecticut','CT', true),
 (1, 'Delaware','DE', true),
 (1, 'Florida','FL', true),
 (1, 'Gregoria','GA', true),
 (1, 'Hawaii','HI', true),
 (1, 'Idaho','ID', true),
 (1, 'Illinois','IL', true),
 (1, 'Indiana','IN', true),
 (1, 'Iowa','IA', true),
 (1, 'Kansas','KS', true),
 (1, 'Kentucky','KY', true),
 (1, 'Maine','ME', true),
 (1, 'Maryland','MD', true),
 (1, 'Massachusetts','MA', true),
 (1, 'Michigan','MI', true),
 (1, 'Minnesota','MI', true),
 (1, 'Utah','UT', true),
 (1, 'Oregon','OR', true),
 (1, 'Ohio','OH', true),
 (1, 'New York','NY', true),
 (1, 'Nevada','NV', true),
 (1, 'Washington','WH', true),
 (1, 'Virginia','VA', true),
 (1, 'Texas','TX', true),
 (1, 'West Virginia','WV', true),
 (1, 'Vermont','VT', true),
 (1, 'Wyoming	','WT', true),
 (1, 'South Dakota','SD', true),
 (1, 'Oklahoma','OK', true),
 (1, 'New Jersey','NJ', true),
 (1, 'New Mexico','NM', true),
 (1, 'New Hemisphere','NH', true),
 (1, 'Mississippi','MS', true),
 (1, 'Montana','MT', true)

