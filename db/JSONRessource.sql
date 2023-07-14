select ressource.id as ressourceId,
bezeichnung,
email,

(select 
telefonEintrag.id,
nummer,
standort.bezeichnung as standort,
eintragTyp.bezeichnung as eintragTyp
from telefonEintragressource
join telefonEintrag on telefonEintrag.id=telefonEintragressource.telefonEintragID
join eintragTyp on telefonEintrag.eintragTypID=eintragTyp.id
join standort on telefonEintrag.standortID=standort.id
where telefonEintragressource.ressourceID=ressource.id for json path
) as telefonNummern,

(select 
id,
bezeichnung
from ressourceabteilung
join abteilung on abteilung.id=ressourceabteilung.abteilungID
where ressourceabteilung.ressourceID=ressource.id for json path
) as abteilungen,

(select 
id,
bezeichnung
from standortressource
join standort on standort.id=standortressource.standortID
where standortressource.ressourceID=ressource.id for json path
) as standorte

from ressource
--where ressource.id=30215 
for json path