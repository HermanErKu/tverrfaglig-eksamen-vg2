# Skolens nettverk LAN oppsett

Under LAN-partyet til skolen er det viktig å ha et stabilt nettverk som er satt opp riktig. Dette er for å sikre:
- At mange brukere kan bruke nettverket samtidig med bra hastighet og uten å oppleve avbrudd
- Et sikkert nettverk der alle som er pålogget kan være trygge
- Et nettverk som er enkelt å overvåke og logge ytelse for å finne forbedringer underveis og oppdage feil med en gang


## Organisering og oppsett

På skolens LAN-party antar jeg at det vil være omtrent 50 til 100 deltakere. Det vil derfor være mye trafikk og dette kan skape problemer. Jeg antar at de fleste brukerne vil bruke ethernet kabler, men jeg må også legge til rette for WiFi tilkobling til f.eks. telefoner eller enheter som ikke har ethernet tilkoblingsmuligheter. 

Oppsettet blir basert på bruk av Ubiquiti Unifi utstyr, siden dette er noe skolen bruker nå og det gir mye kontroll, og blir organisert med flere switcher, VLAN, DHCP og overvåking av ytelse og trafikk. 

### VLAN segmentering
Jeg vil dele nettverket inn i flere soner ved hjelp av VLAN. Ved segmentering av nettverket bidrar man til bedre ytelse og sikkerhet, ved at nettverket er delt opp i mindre deler som ikke har tilgang til hverandre, og enklere feilsøking.

VLAN segmenteringen vil se omtrent slik ut:
| VLAN | Navn | Formål |
| --- | --- | --- |
| 10 | Kablet sone 1 | Deltakere i sone 1 i lokalet |
| 11 | Kablet sone 2 | Deltakere i sone 2 i lokalet |
| 12 | Kablet sone 3 | Deltakere i sone 3 i lokalet |
| 13 | Kablet sone 4 | Deltakere i sone 4 i lokalet |
| 20 | Trådløst WiFi | Alle deltakere og brukere på WiFi |
| 30 | Spillservere | Spillservere som må ha høy prioritet og tilgang til alle VLAN |
| 99 | Admin | Admin PCer, nettverkskontrollere, overvåking og logging |

Ved å dele opp de som skal bruke kablet internett i 4 soner reduserer man risikoen for lagg ved at man isolerer trafikk innenfor VLANene som gjør at pakker ikke blir sendt til hele nettverket, det blir færre enheter som snakker med hverandre unødvendig og man kan få mer sikkerhet og kontroll ved ad Admin og server VLAN kan få høyere prioritet og tilgang.


### Utstyr
Jeg vil sette opp nettverket til å ha en Core switch på toppen som styrer alt. Hele nettverket skal bruke gigabit switcher og utstyr, og cat6 kabler som opprettholder hastighet over hele nettverket. 

I hver VLAN sone med kablet internett vil jeg ha 2-3 swithcer som skal takle 7-12 deltakere. Alle swithcene skal være gigabit swithcer slik at man opprettholder bra internetthastighet. Å ha flere switcher reduserer risikoen for at noe skal gå galt ved å tillate kortere kabler fra swithcen til brukeren, og at hvis en switch går ned er det kun 7-12 brukere som blir tatt ned istedenfor flere.

I det trådløse VLANet settes det opp 2-3 aksesspunkter strategisk i lokalet for å gi WiFi tilgang overalt.

#### Utstyrsliste:
- Core switch
- 10x gigabit-switcher
- 2-3 aksesspunkter
- Unifi controller
- Servere
- AdminPC 


## Fordeling av IP-addresser
For å fordele IP-addresser bruker jeg en DHCP server, via Unifi controlleren. DHCP står for Dynamic Host Configuration Protocol og kan tildele IP-addresser automatisk.

Jeg vil tildele hvert VLAN med sitt eget DHCP-pool. Dette gjør at det blir full kontroll over IP-struktur og at ikke brukere får IP-addresser fra feil nettverksområde

Til servere og logging/kontroller utstyr vil jeg bruke statiske IP-addresser som jeg setter på forhånd. Det er dumt hvis en server's IP-addresse plutselig blir byttet av DHCP.


## Logging og overvåking
Med Unifi controller får man bra sanntidsovervåkning og logging på hele nettverket. Man kan da få data som:
- Live trafikk per port og enhet
- Enhetslogg
- Varslinger som: switch som mister kontakt, DoS angrep, overbelastning
- Heatmaps for WiFi

### Grafana og prometheus
Hvis man ønsker mer detaljert analyse av nettverket og mer tilpassede admin dashboards kan man bruke Grafana med Prometheus som samler inn data fra Unifi API. Da får man mye mer tilpasning etter behov og det blir enklere å gjøre analyse av nettverket. Man kan da logge data som:
- Bandwith over tid per switch eller port
- Aktive enheter per VLAN
- Packetloss og latency
- WiFi signalstyrke og tilkoblingstid
- Høy trafikk fra enkelte enheter

## Sikkerhetstiltak
For å sikre nettverket mot angrep og stabil drift setter jeg i verk disse sikkerhetstiltakene:
| Tiltak | Beskrivelse |
| --- | --- |
| **VLAN Segmentering** | Hindrer unødvendig mye trafikk på nettverket og mellom enheter |
| **Brannmurregler** | Tillater bare nødvendig trafikk mellom VLANene|
| **Port sikkerhe**t | Begrenser antall MAC-addresser per port |
| **Admin VLAN** | Kritiske og viktige systemer isoleres |
| **Overvåking** | Overvåking av nettverket fanger opp unormale mønstre og DoS angrep |

## Nettverksskisse
[![](https://mermaid.ink/img/pako:eNqVlc2OmzAUhV_FsjQ7EmGb_0WladquWjVqWo1UyIIBJ7EG7MgxnbbRvHsNxBAC00xYgO1z7PsZfC9HmImcwghuCvGc7VKpwOdvCQf6WghJ4_oGVs9MZbt1wlvh7g58rRSVIBNFVfJDbwez2TvwUe2o5FStlF7tQntgn9jU-IrKX1TSKek-Lxk_CV18EwM8FiJ7aocP1eNWpvtdL8amtW4d9ZUzSTPFBAff3_ejA-aWSHCKekPT1cKsaeGhgDuBDAXSCY6BH5A2q8YJrJ8AJfCMc8hqvkm3-AOK268C0PpSwkbCZxLl-asI2CDgmxCIiUNGCI6RnJHkGsl9Ix0xdOQmOs_E8UYIvpH8NyI4BsG5CSEwcYIRQmikcCQhu_u09iXfBajOhDqjJrOgEeL6fvX0d1nZJtwSxfdZRg8HsBSMq8EJu7TioRX_x0qGVnNohts5FYLJHRktPjWu7uu8qrRJrbNmz4ri0AiDjY29eODFk7hNcZqEbZW4eVwF7WtcX_KWi3bybLlYv-pcCK6kKAoq4x-cbdjsqRs454UW3EqWw0jJilqwpLJM6y481qYE6upX0gRGupnTTVoVKoEJf9HT9in_KURpZkpRbXcw2qT6tViw2uepoh9YqrdcdqNSh6RyISquYIRC12tWgdER_tb9AM8dG9khCX0He8QmFvwDI8ed-5j4PvIQsrHru86LBf82ge15YLvERsQOPIKC0LcgzZkS8kv742r-Xy__ACd89og?type=png)](https://mermaid.live/edit#pako:eNqVlc2OmzAUhV_FsjQ7EmGb_0WladquWjVqWo1UyIIBJ7EG7MgxnbbRvHsNxBAC00xYgO1z7PsZfC9HmImcwghuCvGc7VKpwOdvCQf6WghJ4_oGVs9MZbt1wlvh7g58rRSVIBNFVfJDbwez2TvwUe2o5FStlF7tQntgn9jU-IrKX1TSKek-Lxk_CV18EwM8FiJ7aocP1eNWpvtdL8amtW4d9ZUzSTPFBAff3_ejA-aWSHCKekPT1cKsaeGhgDuBDAXSCY6BH5A2q8YJrJ8AJfCMc8hqvkm3-AOK268C0PpSwkbCZxLl-asI2CDgmxCIiUNGCI6RnJHkGsl9Ix0xdOQmOs_E8UYIvpH8NyI4BsG5CSEwcYIRQmikcCQhu_u09iXfBajOhDqjJrOgEeL6fvX0d1nZJtwSxfdZRg8HsBSMq8EJu7TioRX_x0qGVnNohts5FYLJHRktPjWu7uu8qrRJrbNmz4ri0AiDjY29eODFk7hNcZqEbZW4eVwF7WtcX_KWi3bybLlYv-pcCK6kKAoq4x-cbdjsqRs454UW3EqWw0jJilqwpLJM6y481qYE6upX0gRGupnTTVoVKoEJf9HT9in_KURpZkpRbXcw2qT6tViw2uepoh9YqrdcdqNSh6RyISquYIRC12tWgdER_tb9AM8dG9khCX0He8QmFvwDI8ed-5j4PvIQsrHru86LBf82ge15YLvERsQOPIKC0LcgzZkS8kv742r-Xy__ACd89og)


## Kilder
Undervisning om nettverk

https://chatgpt.com/share/684c042e-6108-8004-921d-c4eb0963bf9c

https://chatgpt.com/share/684c043f-e1bc-8004-aca0-9e344fbe4d5e

https://community.ui.com/releases/Grafana-dashboard-for-UniFi-APs-now-available-/28e70453-6bfc-4b5f-a60e-30c4a6642a65

https://community.ui.com/questions/UnPoller-Store-UniFi-Controller-Metrics-in-Prometheus-or-InfluxDB/58a0ea34-d2b3-41cd-93bb-d95d3896d1a1

https://www.google.com/search?q=how+to+use+grafana+for+wifi+logging+with+ubiquiti&rlz=1C1GCEA_enNO1093NO1093&oq=how+to+use+grafana+for+wifi+logging+with+&gs_lcrp=EgZjaHJvbWUqBwgBECEYoAEyBggAEEUYOTIHCAEQIRigATIHCAIQIRigATIHCAMQIRigAdIBCDk3ODhqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8