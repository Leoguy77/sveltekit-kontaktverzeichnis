USE [Kontaktverzeichnis]
GO
/****** Object:  View [dbo].[JSONPerson]    Script Date: 25.07.2023 14:18:48 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
create   view [dbo].[JSONPerson] as
select person.id as id,
vorname,
nachname,
personalnummer,
kostenstelle,
email,
titel,

(
select telefonEintrag.id,nummer,standortId,eintragTypId,
(select standort.id, standort.bezeichnung from standort
 where standort.id=telefonEintrag.standortId
for json path, WITHOUT_ARRAY_WRAPPER) as  standort,
(select eintragTyp.id, eintragTyp.bezeichnung from eintragTyp where eintragTyp.id=eintragTypId for json path, WITHOUT_ARRAY_WRAPPER) as eintragTyp
from telefonEintrag 

join _personTotelefonEintrag on _personTotelefonEintrag.B=telefonEintrag.id

where _personTotelefonEintrag.A=person.id for json path

) as telefonEintrag,

(select 
id,
bezeichnung
from _abteilungToperson
join abteilung on abteilung.id=_abteilungToperson.A
where _abteilungToperson.B=person.id for json path
) as abteilung,

(select 
id,
bezeichnung
from _personTostandort
join standort on standort.id=_personTostandort.B
where _personTostandort.A=person.id for json path
) as standort

from person 
--where person.id=30215 
--for json path






GO
