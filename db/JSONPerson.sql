select person.id as personId,
vorname,
nachname,
email,
titel,

(select 
telefonEintrag.id,
nummer,
standort.bezeichnung as standort,
eintragTyp.bezeichnung as eintragTyp
from telefonEintragperson
join telefonEintrag on telefonEintrag.id=telefonEintragperson.telefonEintragID
join eintragTyp on telefonEintrag.eintragTypID=eintragTyp.id
join standort on telefonEintrag.standortID=standort.id
where telefonEintragperson.personID=person.id for json path
) as telefonNummern,

(select 
id,
bezeichnung
from personabteilung
join abteilung on abteilung.id=personabteilung.abteilungID
where personabteilung.personID=person.id for json path
) as abteilungen,

(select 
id,
bezeichnung
from standortperson
join standort on standort.id=standortperson.standortID
where standortperson.personID=person.id for json path
) as standorte

from person
--where person.id=30215 
for json path






