# Lokale spillservere

I denne oppgaven skal jeg sette opp lokale servere til multiplayer spill til et LAN. Siden LANet skjer på Tangen og Tangen har sitt eget serverrom har jeg valgt å sette opp serverne lokalt on-prem. 

Min løsning ville vært å sette opp en server med Proxmox VE, derfra kunne jeg startet en VM med Ubuntu Linux og lastet ned Docker. Da kunne jeg kjørt servere i Docker containere med bruk av docker compose. Jeg vedlikeholder serverne ved å sette opp en kron jobb som kan backupe servere der det trengs. Til overvåking kunne jeg brukt Proxmox sitt eget system, men jeg kunne også satt opp en løsning med Grafana og Prometheus for å monitorere serverbruk og spillstatistikk. For å vedlikeholde mer hadde jeg satt opp mulighet til SSH som hadde latt meg koble til serveren.

De fleste multiplayer spill støtter å hoste servere lokalt, men noen spill må kjøres på utgivernes offisielle servere og lar meg ikke hoste disse lokalt. Jeg spurte ChatGPT om en tabell med de mest populære spillene og hvordan disse støtter min løsning:

| Spill            | Docker-støtte  | Egnet for selvhosting? |
| ---------------- | -------------- | ---------------------- |
| Minecraft (Java) | ✅ God støtte   | ✅ Ja                   |
| CS\:GO           | ✅ God støtte   | ✅ Ja                   |
| Valheim          | ✅ God støtte   | ✅ Ja                   |
| ARK: Survival    | ✅ OK støtte    | ✅ Ja                   |
| Rust             | ✅ OK støtte    | ✅ Ja                   |
| Terraria         | ✅ God støtte   | ✅ Ja                   |
| Valorant         | ❌ Ingen støtte | ❌ Nei                  |
| Fortnite         | ❌ Ingen støtte | ❌ Nei                  |




### Operativsystem
Jeg bruker Proxmox VE på server.
Jeg bruker Ubuntu Linux i VM på server.

Proxmox med forskjellige VM-er gjør at jeg kan isolere VM-ene, kjøre spillservere parallelt og manage ressurser til hver server VM.


### Installering og konfigurering
Installere Docker og docker compose med sudo kommandoer i terminal på Ubuntu VM.
Lage en rask docker-compose fil med image til serverne og viktige innstillinger.
Starte serveren med docker-compose up kommandoen.


### Tilkobling
Jeg passer på at i docker-compose filen åpner jeg opp portene til serveren. F. eks. på en Minecraft server ville standard port vært 25565. Da kunne alle koblet seg til serveren ved bruk av:  < server_ip>:25565

Hvis alle skal sitte på samme nettverk som serveren trenger jeg ikke å gjøre noe mer, men om serveren også skal være tilgjengelig fra andre nettverk, måtte jeg åpnet en port med "Port forwarding". Da kunne man koblet seg til ved bruk av < skolens_public_ip>:25565


### Overvåking og vedlikehold
For å vedlikeholdt serveren kunne jeg regelmessig oppdatert docker og imaget til serverne, dette kan gjøres med få raske sudo og docker kommandoer.

Jeg ville også kjørt backup av servere som trenger det, og gjort dette til en eventuell kron jobb som kjører regelmessig.

Til overvåking kunne jeg brukt Proxmox sin egen Web UI der jeg hadde fått viktig informasjon om serveren og VM-ene.

Eventuelt kunne jeg satt opp et litt mer sofistikert system ved bruk av Grafana og Prometheus for å få server info, eller Grafana og spill server APIer, som f.eks. Minecraft RCON, for å hentet spillstatistikk.