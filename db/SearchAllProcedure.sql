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
		-- SET NOCOUNT ON added to prevent extra result sets from
		-- interfering with SELECT statements.
		SET NOCOUNT ON;
		SELECT * FROM Person 
		JOIN standortperson on person.id = standortperson.personId
		JOIN Standort on standort.id = standortperson.standortId
		JOIN personabteilung on person.id = personabteilung.personId
		JOIN abteilung on abteilung.id = personabteilung.abteilungId
        -- Search for all persons containing any of the strings from the table
        WHERE Person.vorname IN (SELECT String FROM @SearchTable) 
		OR person.nachname IN (SELECT String FROM @SearchTable)
		OR standort.bezeichnung IN (SELECT String FROM @SearchTable)
		OR abteilung.bezeichnung IN (SELECT String FROM @SearchTable)
GO

ALTER PROCEDURE SearchAllRessources
	@SearchTable SearchTableType READONLY
	AS
		-- SET NOCOUNT ON added to prevent extra result sets from
		-- interfering with SELECT statements.
		SET NOCOUNT ON;
		SELECT * FROM Ressource
        JOIN standortressource on ressource.id = standortressource.ressourceId
        JOIN Standort on standort.id = standortressource.standortId
        JOIN ressourceabteilung on ressource.id = ressourceabteilung.ressourceId
        JOIN abteilung on abteilung.id = ressourceabteilung.abteilungId
        -- Search for all abteilugen containing any of the strings from the table
		WHERE Ressource.bezeichnung IN (SELECT String FROM @SearchTable)
        OR standort.bezeichnung IN (SELECT String FROM @SearchTable)
        OR abteilung.bezeichnung IN (SELECT String FROM @SearchTable)
GO
