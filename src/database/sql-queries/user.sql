-- CREATE SUPER ADMIN USER
INSERT INTO insurance_docs_portal_db.users (id, companyId, name, role, status, email, password)
VALUES (1, null, 'Kanha Yadav', 'super_admin', 1, 'kanha@gmail.com', '$2a$10$EfQQuMOJbHez27fUJW2N.uQL0L7lsepzeGRxIGQhyaa3flKTUG5o2');
