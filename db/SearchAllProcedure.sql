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
        (SELECT ', ' + CONCAT(s.id, ' (', s.vorwahl, ', ', t.nummer, ', ', s.bezeichnung, ')')
         FROM telefonEintragperson tp
         JOIN telefonEintrag t ON t.id = tp.telefonEintragID
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
    EXISTS (SELECT 1 FROM @SearchTable WHERE String = p.vorname)
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE String = p.nachname)
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE String = s.bezeichnung)
    OR EXISTS (SELECT 1 FROM @SearchTable WHERE String = a.bezeichnung)
GROUP BY
    p.id;
GO

ALTER PROCEDURE SearchAllRessources
@SearchTable SearchTableType READONLY
AS	
SELECT 
	ressource.id,
	MAX(ressource.bezeichnung) AS bezeichnung,
	STUFF(
		(SELECT DISTINCT ', ' + standort.bezeichnung
		 FROM standort
		 JOIN standortressource ON standort.id = standortressource.standortID
		 WHERE standortressource.ressourceID = ressource.id
		 FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
		1, 2, '') AS standortbezeichnung,
	STUFF(
		(SELECT DISTINCT ', ' + standort.vorwahl
		 FROM standort
		 JOIN standortressource ON standort.id = standortressource.standortID
		 WHERE standortressource.ressourceID = ressource.id
		 FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
		1, 2, '') AS vorwahl,
	STUFF(
		(SELECT DISTINCT ', ' + abteilung.bezeichnung
		 FROM abteilung
		 JOIN ressourceabteilung ON abteilung.id = ressourceabteilung.abteilungID
		 WHERE ressourceabteilung.ressourceID = ressourceID
		 FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
		1, 2, '') AS abteilungbezeichnung,
	STUFF(
        (SELECT DISTINCT ', ' + telefonEintrag.nummer
         FROM telefonEintrag
         JOIN telefonEintragressource ON telefonEintrag.id = telefonEintragressource.telefonEintragId
         WHERE telefonEintragressource.ressourceID = ressource.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS nummern,
	STUFF(
        (SELECT DISTINCT ', ' + eintragTyp.bezeichnung
         FROM eintragTyp
         JOIN telefonEintrag ON eintragTyp.id = telefonEintrag.eintragTypID
         JOIN telefonEintragressource ON telefonEintrag.id = telefonEintragressource.telefonEintragId
         WHERE telefonEintragressource.ressourceID = ressource.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS telefoneintragbezeichnung,
	STUFF(
        (SELECT DISTINCT ', ' + CAST(telefonEintrag.eintragTypID AS nvarchar(MAX))
         FROM telefonEintrag
         JOIN telefonEintragressource ON telefonEintrag.id = telefonEintragressource.telefonEintragId
         WHERE telefonEintragressource.ressourceID = ressource.id
         FOR XML PATH(''), TYPE).value('.', 'nvarchar(MAX)'),
        1, 2, '') AS eintragTypIDs
FROM 
	Ressource
	JOIN standortressource on ressource.id = standortressource.ressourceId
    JOIN Standort on standort.id = standortressource.standortId
    JOIN ressourceabteilung on ressource.id = ressourceabteilung.ressourceId
    JOIN abteilung on abteilung.id = ressourceabteilung.abteilungId
WHERE
	Ressource.bezeichnung IN (SELECT String FROM @SearchTable)
	OR standort.bezeichnung IN (SELECT String FROM @SearchTable)
    OR abteilung.bezeichnung IN (SELECT String FROM @SearchTable)
GROUP BY
	ressource.id
GO

ALTER PROCEDURE SearchAll
	@SearchTable SearchTableType READONLY
	AS
		EXEC [dbo].[SearchAllPersons] @SearchTable
		EXEC [dbo].[SearchAllRessources] @SearchTable
GO