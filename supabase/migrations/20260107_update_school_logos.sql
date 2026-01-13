-- Update School Logos
-- Run this SQL in Supabase SQL Editor after uploading logos to public/school-logos/
-- Generated: 2026-01-07

-- First ensure the logo column exists
ALTER TABLE schools ADD COLUMN IF NOT EXISTS logo TEXT;

-- Update logos for matching schools
-- The logo path points to static files served from public folder

UPDATE schools SET logo = '/school-logos/COTABATO CITY CENTRAL PILOT.jfif' WHERE LOWER(name) LIKE '%cotabato city central pilot%';
UPDATE schools SET logo = '/school-logos/Kimpo Elementary School.jfif' WHERE LOWER(name) LIKE '%kimpo elementary%';
UPDATE schools SET logo = '/school-logos/Krislamville ELEMENTARY SCHOOL.jfif' WHERE LOWER(name) LIKE '%krislamville%';
UPDATE schools SET logo = '/school-logos/P.C. Hill Elementary School.jfif' WHERE LOWER(name) LIKE '%p.c. hill%' OR LOWER(name) LIKE '%pc hill%';
UPDATE schools SET logo = '/school-logos/Sero Central School.jfif' WHERE LOWER(name) LIKE '%sero central%';
UPDATE schools SET logo = '/school-logos/Buaya-Buaya Elementary School.jfif' WHERE LOWER(name) LIKE '%buaya-buaya%';
UPDATE schools SET logo = '/school-logos/Bubong Elementary School.png' WHERE LOWER(name) LIKE '%bubong elementary%';
UPDATE schools SET logo = '/school-logos/Diocolano Elementary School.png' WHERE LOWER(name) LIKE '%diocolano elementary%';
UPDATE schools SET logo = '/school-logos/L.R. Sebastian ES.jfif' WHERE LOWER(name) LIKE '%l.r. sebastian%' OR LOWER(name) LIKE '%lr sebastian%';
UPDATE schools SET logo = '/school-logos/Mokamadali Elementary School.jfif' WHERE LOWER(name) LIKE '%mokamadali%';
UPDATE schools SET logo = '/school-logos/Notre Dame Village Central ES.jfif' WHERE LOWER(name) LIKE '%notre dame village central%';
UPDATE schools SET logo = '/school-logos/Pagalamatan Elementary School.jfif' WHERE LOWER(name) LIKE '%pagalamatan%';
UPDATE schools SET logo = '/school-logos/Tamontaka Central School.jfif' WHERE LOWER(name) LIKE '%tamontaka central%';
UPDATE schools SET logo = '/school-logos/Timako Elementary School.jfif' WHERE LOWER(name) LIKE '%timako%';
UPDATE schools SET logo = '/school-logos/Usman Baunga ES.jfif' WHERE LOWER(name) LIKE '%usman baunga%';
UPDATE schools SET logo = '/school-logos/Amirol ES.jfif' WHERE LOWER(name) LIKE '%amirol%';
UPDATE schools SET logo = '/school-logos/Darping ES.jfif' WHERE LOWER(name) LIKE '%darping%';
UPDATE schools SET logo = '/school-logos/Datu Ayunan ES.jfif' WHERE LOWER(name) LIKE '%datu ayunan es%' OR LOWER(name) LIKE '%datu ayunan elementary%';
UPDATE schools SET logo = '/school-logos/Datu Usman Elementary School.jfif' WHERE LOWER(name) LIKE '%datu usman elementary%';
UPDATE schools SET logo = '/school-logos/Lugay-Lugay Central School.jfif' WHERE LOWER(name) LIKE '%lugay-lugay%';
UPDATE schools SET logo = '/school-logos/Rojas Central ES.jfif' WHERE LOWER(name) LIKE '%rojas central%';
UPDATE schools SET logo = '/school-logos/Datu Siang Central School.png' WHERE LOWER(name) LIKE '%datu siang central%';
UPDATE schools SET logo = '/school-logos/Don E. Sero Elementary School.png' WHERE LOWER(name) LIKE '%don e. sero%';
UPDATE schools SET logo = '/school-logos/J. Marquez Elementary School.jfif' WHERE LOWER(name) LIKE '%j. marquez elementary%';
UPDATE schools SET logo = '/school-logos/Vilo Central Elementary School.jfif' WHERE LOWER(name) LIKE '%vilo central%';
UPDATE schools SET logo = '/school-logos/Mandanas Elementary School.jfif' WHERE LOWER(name) LIKE '%mandanas%';
UPDATE schools SET logo = '/school-logos/Fernanda Borbon Elementary School.png' WHERE LOWER(name) LIKE '%fernanda borbon%';
UPDATE schools SET logo = '/school-logos/CANIZARES NATIONAL HIGH SCHOOL- School of Arts and Trades.png' WHERE LOWER(name) LIKE '%canizares national high%';
UPDATE schools SET logo = '/school-logos/Cotabato City NHS - Rojas 13.jfif' WHERE LOWER(name) LIKE '%cotabato city nhs%rojas%13%';
UPDATE schools SET logo = '/school-logos/Cotabato City NHS - Main.jfif' WHERE LOWER(name) LIKE '%cotabato city nhs%main%';
UPDATE schools SET logo = '/school-logos/Datu Ayunan National High School.jfif' WHERE LOWER(name) LIKE '%datu ayunan national high%';
UPDATE schools SET logo = '/school-logos/Datu Siang NHS.jfif' WHERE LOWER(name) LIKE '%datu siang nhs%';
UPDATE schools SET logo = '/school-logos/J. Marquez NHS.jfif' WHERE LOWER(name) LIKE '%j. marquez nhs%';
UPDATE schools SET logo = '/school-logos/Notre Dame Village National High School.png' WHERE LOWER(name) LIKE '%notre dame village national high%';
UPDATE schools SET logo = '/school-logos/Pilot Provincial Science High School and Technology.jfif' WHERE LOWER(name) LIKE '%pilot provincial science high%';
UPDATE schools SET logo = '/school-logos/CCNHS - Datu Sema Kalantungan Site.jfif' WHERE LOWER(name) LIKE '%ccnhs%datu sema kalantungan%';
UPDATE schools SET logo = '/school-logos/CCNHS - ANNEX ( Bubong Site).jfif' WHERE LOWER(name) LIKE '%ccnhs%bubong%';
UPDATE schools SET logo = '/school-logos/CCNHS-ANNEX (Buaya-Buaya Site).jfif' WHERE LOWER(name) LIKE '%ccnhs%buaya-buaya%';
UPDATE schools SET logo = '/school-logos/CCNHS - Annex (LR Sebastian Site).png' WHERE LOWER(name) LIKE '%ccnhs%lr sebastian%' OR LOWER(name) LIKE '%ccnhs%l.r. sebastian%';
UPDATE schools SET logo = '/school-logos/CCNHS - Annex (Diocolano Site).jfif' WHERE LOWER(name) LIKE '%ccnhs%diocolano%';
UPDATE schools SET logo = '/school-logos/CCNHS - Annex (Don E. Sero Site).jfif' WHERE LOWER(name) LIKE '%ccnhs%don e. sero%';
UPDATE schools SET logo = '/school-logos/CCNHS - Annex (PC Hill Site).png' WHERE LOWER(name) LIKE '%ccnhs%pc hill%';
UPDATE schools SET logo = '/school-logos/Cotabato City Bangsamoro Stand Alone Senior High School.png' WHERE LOWER(name) LIKE '%cotabato city bangsamoro stand alone%';
UPDATE schools SET logo = '/school-logos/Mohammad Integrated School.png' WHERE LOWER(name) LIKE '%mohammad integrated%';

-- Show summary of updated schools
SELECT COUNT(*) as schools_with_logos FROM schools WHERE logo IS NOT NULL;
