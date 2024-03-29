USE [Kontaktverzeichnis]
GO
/****** Object:  Table [dbo].[abteilung]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[abteilung](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[bezeichnung] [varchar](255) NOT NULL,
 CONSTRAINT [PK_abteilung] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[eintragTyp]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[eintragTyp](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[bezeichnung] [varchar](255) NOT NULL,
 CONSTRAINT [PK_eintragTyp] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[person]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[person](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[vorname] [varchar](255) NOT NULL,
	[nachname] [varchar](255) NOT NULL,
	[personalnummer] [varchar](255) NULL,
	[kostenstelle] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[titel] [varchar](255) NULL,
 CONSTRAINT [PK_person] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[personabteilung]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[personabteilung](
	[abteilungID] [int] NOT NULL,
	[personID] [int] NOT NULL,
 CONSTRAINT [PK_personabteilung] PRIMARY KEY CLUSTERED 
(
	[abteilungID] ASC,
	[personID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ressource]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ressource](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[bezeichnung] [varchar](255) NOT NULL,
	[email] [varchar](255) NULL,
 CONSTRAINT [PK_ressource] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ressourceabteilung]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ressourceabteilung](
	[ressourceID] [int] NOT NULL,
	[abteilungID] [int] NOT NULL,
 CONSTRAINT [PK_ressourceabteilung] PRIMARY KEY CLUSTERED 
(
	[ressourceID] ASC,
	[abteilungID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[standort]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[standort](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[bezeichnung] [varchar](255) NOT NULL,
	[vorwahl] [varchar](255) NULL,
 CONSTRAINT [PK_standort] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[standortperson]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[standortperson](
	[standortID] [int] NOT NULL,
	[personID] [int] NOT NULL,
 CONSTRAINT [PK_standortperson] PRIMARY KEY CLUSTERED 
(
	[standortID] ASC,
	[personID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[standortressource]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[standortressource](
	[standortID] [int] NOT NULL,
	[ressourceID] [int] NOT NULL,
 CONSTRAINT [PK_standortressource] PRIMARY KEY CLUSTERED 
(
	[standortID] ASC,
	[ressourceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[telefonEintrag]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[telefonEintrag](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[eintragTypID] [int] NOT NULL,
	[nummer] [varchar](255) NOT NULL,
	[standortID] [int] NULL,
 CONSTRAINT [PK_telefonEintrag] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[telefonEintragperson]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[telefonEintragperson](
	[telefonEintragID] [int] NOT NULL,
	[personID] [int] NOT NULL,
 CONSTRAINT [PK_telefonEintragperson] PRIMARY KEY CLUSTERED 
(
	[telefonEintragID] ASC,
	[personID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[telefonEintragressource]    Script Date: 14.06.2023 11:27:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[telefonEintragressource](
	[telefonEintragID] [int] NOT NULL,
	[ressourceID] [int] NOT NULL,
 CONSTRAINT [PK_telefonEintragressource] PRIMARY KEY CLUSTERED 
(
	[telefonEintragID] ASC,
	[ressourceID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[personabteilung]  WITH CHECK ADD  CONSTRAINT [FK_personabteilung_abteilung] FOREIGN KEY([abteilungID])
REFERENCES [dbo].[abteilung] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[personabteilung] CHECK CONSTRAINT [FK_personabteilung_abteilung]
GO
ALTER TABLE [dbo].[personabteilung]  WITH CHECK ADD  CONSTRAINT [FK_personabteilung_person] FOREIGN KEY([personID])
REFERENCES [dbo].[person] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[personabteilung] CHECK CONSTRAINT [FK_personabteilung_person]
GO
ALTER TABLE [dbo].[ressourceabteilung]  WITH CHECK ADD  CONSTRAINT [FK_ressourceabteilung_abteilung] FOREIGN KEY([abteilungID])
REFERENCES [dbo].[abteilung] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ressourceabteilung] CHECK CONSTRAINT [FK_ressourceabteilung_abteilung]
GO
ALTER TABLE [dbo].[ressourceabteilung]  WITH CHECK ADD  CONSTRAINT [FK_ressourceabteilung_ressource] FOREIGN KEY([ressourceID])
REFERENCES [dbo].[ressource] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[ressourceabteilung] CHECK CONSTRAINT [FK_ressourceabteilung_ressource]
GO
ALTER TABLE [dbo].[standortperson]  WITH CHECK ADD  CONSTRAINT [FK_standortperson_person] FOREIGN KEY([personID])
REFERENCES [dbo].[person] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[standortperson] CHECK CONSTRAINT [FK_standortperson_person]
GO
ALTER TABLE [dbo].[standortperson]  WITH CHECK ADD  CONSTRAINT [FK_standortperson_standort] FOREIGN KEY([standortID])
REFERENCES [dbo].[standort] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[standortperson] CHECK CONSTRAINT [FK_standortperson_standort]
GO
ALTER TABLE [dbo].[standortressource]  WITH CHECK ADD  CONSTRAINT [FK_standortressource_ressource] FOREIGN KEY([ressourceID])
REFERENCES [dbo].[ressource] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[standortressource] CHECK CONSTRAINT [FK_standortressource_ressource]
GO
ALTER TABLE [dbo].[standortressource]  WITH CHECK ADD  CONSTRAINT [FK_standortressource_standort] FOREIGN KEY([standortID])
REFERENCES [dbo].[standort] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[standortressource] CHECK CONSTRAINT [FK_standortressource_standort]
GO
ALTER TABLE [dbo].[telefonEintrag]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintrag_eintragTyp] FOREIGN KEY([eintragTypID])
REFERENCES [dbo].[eintragTyp] ([id])
GO
ALTER TABLE [dbo].[telefonEintrag] CHECK CONSTRAINT [FK_telefonEintrag_eintragTyp]
GO
ALTER TABLE [dbo].[telefonEintrag]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintrag_standort] FOREIGN KEY([standortID])
REFERENCES [dbo].[standort] ([id])
GO
ALTER TABLE [dbo].[telefonEintrag] CHECK CONSTRAINT [FK_telefonEintrag_standort]
GO
ALTER TABLE [dbo].[telefonEintragperson]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintragperson_person] FOREIGN KEY([personID])
REFERENCES [dbo].[person] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[telefonEintragperson] CHECK CONSTRAINT [FK_telefonEintragperson_person]
GO
ALTER TABLE [dbo].[telefonEintragperson]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintragperson_telefonEintrag] FOREIGN KEY([telefonEintragID])
REFERENCES [dbo].[telefonEintrag] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[telefonEintragperson] CHECK CONSTRAINT [FK_telefonEintragperson_telefonEintrag]
GO
ALTER TABLE [dbo].[telefonEintragressource]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintragressource_ressource] FOREIGN KEY([ressourceID])
REFERENCES [dbo].[ressource] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[telefonEintragressource] CHECK CONSTRAINT [FK_telefonEintragressource_ressource]
GO
ALTER TABLE [dbo].[telefonEintragressource]  WITH CHECK ADD  CONSTRAINT [FK_telefonEintragressource_telefonEintrag] FOREIGN KEY([telefonEintragID])
REFERENCES [dbo].[telefonEintrag] ([id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[telefonEintragressource] CHECK CONSTRAINT [FK_telefonEintragressource_telefonEintrag]
GO
