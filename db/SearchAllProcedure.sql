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
    p.id,
	MAX(p.vorname) AS vorname,
    MAX(p.nachname) AS nachname,
	MAX(p.titel) AS titel,
    MAX(p.email) AS email,
    STUFF(
        (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
         FROM standortperson sp
         JOIN standort s ON s.id = sp.standortID
         WHERE sp.personID = p.id
         GROUP BY s.id, s.bezeichnung
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS standorte,
    STUFF(
        (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
         FROM Personabteilung pd
         JOIN abteilung a ON a.id = pd.abteilungId
         WHERE pd.personId = p.id
         GROUP BY a.id, a.bezeichnung
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS abteilungen,
    STUFF(
        (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.id, ', ', et.bezeichnung, ')')
         FROM telefonEintragperson tp
         JOIN telefonEintrag t ON t.id = tp.telefonEintragID
		 JOIN eintragTyp et ON t.eintragTypID = et.id
         JOIN standort s ON s.id = t.standortID
         WHERE tp.personID = p.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS nummern
FROM
    Person p
    JOIN standortperson sp ON p.id = sp.personId
    JOIN Standort s ON s.id = sp.standortId
    JOIN personabteilung pa ON p.id = pa.personId
    JOIN abteilung a ON a.id = pa.abteilungId
WHERE
    EXISTS (SELECT 1 FROM @SearchTable WHERE p.vorname LIKE '%' + String + '%')
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE p.nachname LIKE '%' + String + '%')
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE s.bezeichnung LIKE '%' + String + '%')
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE a.bezeichnung LIKE '%' + String + '%')
GROUP BY
    p.id;
GO

ALTER PROCEDURE SearchAllRessources
    @SearchTable SearchTableType READONLY
AS
SELECT 
    r.id,
    MAX(r.bezeichnung) AS bezeichnung,
    STUFF(
        (SELECT ', ' + CONCAT(s.id, ' (', s.bezeichnung, ')')
         FROM standortressource sr
         JOIN standort s ON s.id = sr.standortID
         WHERE sr.ressourceID = r.id
         GROUP BY s.id, s.bezeichnung
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS standorte,
    STUFF(
        (SELECT ', ' + CONCAT(a.id, ' (', a.bezeichnung, ')')
         FROM ressourceabteilung pd
         JOIN abteilung a ON a.id = pd.abteilungId
         WHERE pd.ressourceID = r.id
         GROUP BY a.id, a.bezeichnung
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS abteilungen,
    STUFF(
        (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ', ', et.id, ', ', et.bezeichnung, ')')
         FROM telefonEintragressource tp
         JOIN telefonEintrag t ON t.id = tp.telefonEintragID
		 JOIN eintragTyp et ON t.eintragTypID = et.id
         JOIN standort s ON s.id = t.standortID
         WHERE tp.ressourceID = r.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS nummern
FROM 
    Ressource r
    JOIN standortressource sr ON r.id = sr.ressourceId
    JOIN Standort s ON s.id = sr.standortId
    JOIN ressourceabteilung ra ON r.id = ra.ressourceId
    JOIN abteilung a ON a.id = ra.abteilungId
WHERE
    EXISTS (SELECT 1 FROM @SearchTable WHERE r.bezeichnung LIKE '%' + String + '%')
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE s.bezeichnung LIKE '%' + String + '%')
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE a.bezeichnung LIKE '%' + String + '%')
GROUP BY
    r.id;

GO

ALTER PROCEDURE SearchAll
	@SearchTable SearchTableType READONLY
	AS
		EXEC [dbo].[SearchAllPersons] @SearchTable
		EXEC [dbo].[SearchAllRessources] @SearchTable
GO