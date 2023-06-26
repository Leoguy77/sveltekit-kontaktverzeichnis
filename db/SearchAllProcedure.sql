USE Kontaktverzeichnis
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================

--CREATE TYPE SearchTableType
--   AS TABLE
--      ( String VARCHAR(50));
--GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================


ALTER PROCEDURE SearchAllPersons
@SearchTable SearchTableType READONLY
AS
SELECT
    MAX(person.vorname) AS vorname,
    MAX(person.nachname) AS nachname,
    MAX(person.email) AS email,
    person.id,
    STUFF(
        (SELECT DISTINCT ', ' + standort.bezeichnung
         FROM Standort
         JOIN standortperson ON standort.id = standortperson.standortId
         WHERE standortperson.personId = person.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS standortbezeichnung,
    STUFF(
        (SELECT DISTINCT ', ' + abteilung.bezeichnung
         FROM Abteilung
         JOIN personabteilung ON abteilung.id = personabteilung.abteilungId
         WHERE personabteilung.personId = person.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS abteilungbezeichnung,
    STUFF(
        (SELECT DISTINCT ', ' + telefonEintrag.nummer
         FROM telefonEintrag
         JOIN telefonEintragPerson ON telefonEintrag.id = telefonEintragPerson.telefonEintragId
         WHERE telefonEintragPerson.personId = person.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS nummern,
    (SELECT TOP 1 standort.vorwahl
     FROM Standort
     JOIN standortperson ON standort.id = standortperson.standortId
     WHERE standortperson.personId = person.id) AS vorwahl,
    STUFF(
        (SELECT DISTINCT ', ' + eintragTyp.bezeichnung
         FROM eintragTyp
         JOIN telefonEintrag ON eintragTyp.id = telefonEintrag.eintragTypID
         JOIN telefonEintragPerson ON telefonEintrag.id = telefonEintragPerson.telefonEintragId
         WHERE telefonEintragPerson.personId = person.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS telefoneintragbezeichnung,
    (SELECT TOP 1 telefonEintrag.eintragTypID
     FROM telefonEintrag
     JOIN telefonEintragPerson ON telefonEintrag.id = telefonEintragPerson.telefonEintragId
     WHERE telefonEintragPerson.personId = person.id) AS eintragTypID
FROM
    Person
    JOIN standortperson ON person.id = standortperson.personId
    JOIN Standort ON standort.id = standortperson.standortId
    JOIN personabteilung ON person.id = personabteilung.personId
    JOIN abteilung ON abteilung.id = personabteilung.abteilungId
    JOIN telefonEintragPerson ON person.id = telefonEintragPerson.personId
    JOIN telefonEintrag ON telefonEintrag.id = telefonEintragPerson.telefonEintragId
WHERE
    Person.vorname IN (SELECT String FROM @SearchTable) 
    OR person.nachname IN (SELECT String FROM @SearchTable)
    OR standort.bezeichnung IN (SELECT String FROM @SearchTable)
    OR abteilung.bezeichnung IN (SELECT String FROM @SearchTable)
GROUP BY
    person.id;
GO

ALTER PROCEDURE SearchAllRessources
@SearchTable SearchTableType READONLY
AS	
SELECT 
	ressource.id,
	ressource.bezeichnung,
	standort.bezeichnung as standortbezeichnung,
	standort.vorwahl,
	abteilung.bezeichnung as abteilungsbezeichnung,
	telefonEintrag.nummer,
	eintragTyp.bezeichnung as telefoneintragbezeichnung,
	telefonEintrag.eintragTypID 
FROM 
	Ressource
	JOIN standortressource on ressource.id = standortressource.ressourceId
    JOIN Standort on standort.id = standortressource.standortId
    JOIN ressourceabteilung on ressource.id = ressourceabteilung.ressourceId
    JOIN abteilung on abteilung.id = ressourceabteilung.abteilungId
	JOIN telefonEintragRessource on ressource.id = telefonEintragRessource.ressourceId
	JOIN telefonEintrag on telefonEintrag.id = telefonEintragRessource.telefonEintragId
	JOIN eintragTyp on telefonEintrag.eintragTypID = eintragTyp.id
    -- Search for all abteilugen containing any of the strings from the table
WHERE
	Ressource.bezeichnung IN (SELECT String FROM @SearchTable)
	OR standort.bezeichnung IN (SELECT String FROM @SearchTable)
    OR abteilung.bezeichnung IN (SELECT String FROM @SearchTable)
GO

ALTER PROCEDURE SearchAll
	@SearchTable SearchTableType READONLY
	AS
		EXEC [dbo].[SearchAllPersons] @SearchTable
		EXEC [dbo].[SearchAllRessources] @SearchTable
GO