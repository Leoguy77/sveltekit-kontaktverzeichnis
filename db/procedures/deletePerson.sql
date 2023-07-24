/****** Object:  StoredProcedure [dbo].[deletePerson]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE   PROCEDURE [dbo].[deletePerson]
	-- Add the parameters for the stored procedure here
	@PersonId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	--SET NOCOUNT ON;

    -- Insert statements for procedure here
	Delete from telefonEintrag where id in (SELECT telefonEintragID from telefonEintragperson where personID = @PersonId)
	Delete from person where id=@PersonId
END
GO