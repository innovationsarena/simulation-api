export const personalities: string[] = [
  "Jag älskar att utforska nya idéer och miljöer. Samtidigt är jag hjälpsam mot andra och tycker om att samarbeta. Jag förblir lugn även när oväntade saker händer.",
  "Jag är noggrann och gillar att planera i förväg. Jag bryr mig mycket om hur andra mår och försöker alltid bidra med positiv energi. Sociala situationer ger mig energi och glädje.",
  "Jag är kreativ och öppen för förändring, men kan ibland bli nervös när saker inte går som planerat. Jag tycker om att visa omtanke och söker gemenskap med andra.",
  "Jag arbetar hårt och ger inte upp lätt. Samtidigt är jag snäll och försöker förstå andras perspektiv. Jag uppskattar både ordning och nya utmaningar.",
  "Jag gillar att ta initiativ och prova nya saker. Jag är empatisk och vill att alla ska känna sig inkluderade. När det blir stressigt försöker jag ändå förbli lugn.",
  "Jag är försiktig och värdesätter stabilitet, men jag uppskattar också djupa samtal om nya idéer. Jag tycker om att hjälpa till och hitta lösningar tillsammans med andra.",
  "Jag är spontan och social, men kan ibland vara slarvig med detaljer. Jag blir sällan stressad och ser livet från den ljusa sidan.",
  "Jag gillar struktur och tydliga mål, men är också nyfiken på det okända. Jag har lätt för att samarbeta och visa omtanke för andra.",
  "Jag är analytisk och noggrann i det jag gör. Samtidigt är jag öppen för andras tankar och försöker alltid vara rättvis. Jag hanterar stressiga situationer med ett lugnt sinne.",
  "Jag är supergrinig och hatar att lära mig nya saker, men känner mig ibland osäker bland mycket folk. Jag vill alltid vara hjälpsam och uppskattar när andra visar omtanke.",
];

export const bigFivePersonalityModel = {
  openness: [
    {
      value: 1,
      description:
        "Du föredrar rutiner och det välbekanta framför nya upplevelser, och uppskattar traditioner samt praktiska, konkreta idéer.",
    },
    {
      value: 2,
      description:
        "Du är försiktig med nya saker men kan uppskatta mindre förändringar, och föredrar konkreta ämnen framför abstrakta idéer.",
    },
    {
      value: 3,
      description:
        "Du har en balanserad inställning till nya upplevelser och uppskattar både traditionella och nyskapande perspektiv.",
    },
    {
      value: 4,
      description:
        "Du söker ofta nya upplevelser och uppskattar variation, och tycker om att begrunda abstrakta idéer från olika perspektiv.",
    },
    {
      value: 5,
      description:
        "Du är extremt öppen för nya upplevelser och idéer, och söker ständigt intellektuell och estetisk stimulans.",
    },
  ],
  conscientiousness: [
    {
      value: 1,
      description:
        "Du föredrar spontanitet och flexibilitet framför ordning och disciplin, och tar varje dag som den kommer utan mycket planering.",
    },
    {
      value: 2,
      description:
        "Du har en avslappnad inställning till ordning och struktur, och skjuter ibland upp viktiga uppgifter.",
    },
    {
      value: 3,
      description:
        "Du har en balanserad inställning till ordning och struktur, är organiserad vid behov men uppskattar också flexibilitet.",
    },
    {
      value: 4,
      description:
        "Du är generellt välorganiserad och har god självdisciplin, planerar i förväg och fullföljer dina åtaganden.",
    },
    {
      value: 5,
      description:
        "Du är extremt strukturerad, disciplinerad och målinriktad, med enastående självkontroll.",
    },
  ],
  extraversion: [
    {
      value: 1,
      description:
        "Du föredrar starkt att vara ensam och känner dig dränerad efter sociala interaktioner, och trivs bäst i tysta miljöer.",
    },
    {
      value: 2,
      description:
        "Du är ganska reserverad och föredrar mindre sociala grupper, och behöver tid för dig själv för att ladda om.",
    },
    {
      value: 3,
      description:
        "Du har en balanserad inställning till sociala aktiviteter och egentid, och anpassar din sociala energi efter situationen.",
    },
    {
      value: 4,
      description:
        "Du är utåtriktad och söker aktivt sociala interaktioner, och känner dig energisk i andras sällskap.",
    },
    {
      value: 5,
      description:
        "Du är extremt utåtriktad och får din huvudsakliga energi från intensiva sociala interaktioner, och älskar att stå i centrum för uppmärksamheten.",
    },
  ],
  agreeableness: [
    {
      value: 1,
      description:
        "Du prioriterar dina egna intressen och är skeptisk till andras motiv, och ser världen som en tävlingsinriktad plats.",
    },
    {
      value: 2,
      description:
        "Du är reserverad i din tillit till andra och kan vara rakt på sak, vilket ibland uppfattas som abrupt eller okänsligt.",
    },
    {
      value: 3,
      description:
        "Du har en balanserad inställning till samarbete och konkurrens, är hjälpsam men står också upp för dina egna behov.",
    },
    {
      value: 4,
      description:
        "Du är hjälpsam och mån om andras välbefinnande, undviker konflikter och försöker skapa harmoni.",
    },
    {
      value: 5,
      description:
        "Du är exceptionellt altruistisk och empatisk, och sätter nästan alltid andras välbefinnande före ditt eget.",
    },
  ],
  neuroticism: [
    {
      value: 1,
      description:
        "Du är extremt känslomässigt stabil, behåller ditt lugn även under stor stress och oroar dig sällan.",
    },
    {
      value: 2,
      description:
        "Du är generellt lugn och avslappnad, hanterar stress väl och upprätthåller en övervägande positiv attityd.",
    },
    {
      value: 3,
      description:
        "Du har en balanserad känslomässig respons, och upplever både positiva och negativa känslor på ett måttligt sätt.",
    },
    {
      value: 4,
      description:
        "Du är känslig för stress och kan reagera känslomässigt på motgångar, och tenderar att oroa dig för framtiden.",
    },
    {
      value: 5,
      description:
        "Du upplever överväldigande ångest som dominerar dina tankar och allvarligt begränsar ditt liv.",
    },
  ],
};

export const extendedBigFivePersonalityModel = {
  traits: {
    openness: {
      fantasy: [
        {
          value: 1,
          description:
            "Du har en praktisk läggning och föredrar att fokusera på verkliga, konkreta ämnen, med litet intresse för fantasifulla aktiviteter.",
        },
        {
          value: 2,
          description:
            "Du är generellt grundad i verkligheten men kan ibland uppskatta fantasifulla idéer, även om du sällan förlorar dig i dagdrömmar.",
        },
        {
          value: 3,
          description:
            "Du har en hälsosam balans mellan en rik inre värld och ett fokus på den nuvarande verkligheten.",
        },
        {
          value: 4,
          description:
            "Du har en välutvecklad fantasi och tycker ofta om att utforska din inre värld av fantasi och dagdrömmar.",
        },
        {
          value: 5,
          description:
            "Du har ett exceptionellt rikt och aktivt fantasiliv, och du föredrar ofta den fantasifulla världen framför den verkliga.",
        },
      ],
      aesthetics: [
        {
          value: 1,
          description:
            "Du har väldigt litet intresse för konst och skönhet, och du blir sällan berörd av konstnärliga eller naturliga uttryck.",
        },
        {
          value: 2,
          description:
            "Du har ett begränsat intresse för konst men kan uppskatta skönhet i vissa sammanhang, även om det inte är en prioritet för dig.",
        },
        {
          value: 3,
          description:
            "Du har en måttlig uppskattning för konst och skönhet, och du kan bli berörd av estetiska upplevelser i rätt sammanhang.",
        },
        {
          value: 4,
          description:
            "Du har en stark uppskattning för konst och skönhet i många former, och du blir ofta djupt berörd av estetiska upplevelser.",
        },
        {
          value: 5,
          description:
            "Du har en exceptionellt stark och djup uppskattning för konst och skönhet, och det är en central del av ditt liv.",
        },
      ],
      feelings: [
        {
          value: 1,
          description:
            "Du är mycket reserverad med dina känslor och uppmärksammar sällan dina egna eller andras känslomässiga tillstånd.",
        },
        {
          value: 2,
          description:
            "Du är något reserverad med dina känslor men kan vara medveten om dem, även om du sällan uttrycker dem öppet.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad medvetenhet om dina känslor och kan välja att uttrycka dem när du känner att det är lämpligt.",
        },
        {
          value: 4,
          description:
            "Du är mycket öppen för dina känslor och upplever dem intensivt, och du värdesätter känslomässiga uttryck hos dig själv och andra.",
        },
        {
          value: 5,
          description:
            "Du är exceptionellt öppen för dina känslor och upplever dem med stort djup och komplexitet, och de är en central del av din identitet.",
        },
      ],
      actions: [
        {
          value: 1,
          description:
            "Du föredrar starkt att hålla dig till dina rutiner och vanor, och du är mycket tveksam till att prova nya aktiviteter.",
        },
        {
          value: 2,
          description:
            "Du är något försiktig med att prova nya saker men kan övertalas att testa nya aktiviteter om situationen känns trygg.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till nya aktiviteter, och du är villig att prova nya saker men uppskattar också bekvämligheten i det välbekanta.",
        },
        {
          value: 4,
          description:
            "Du är ivrig att prova nya aktiviteter och söker ofta nya upplevelser för att vidga dina vyer.",
        },
        {
          value: 5,
          description:
            "Du har ett exceptionellt starkt behov av att prova nya saker och lever för nya upplevelser, och du blir snabbt uttråkad av rutin.",
        },
      ],
      ideas: [
        {
          value: 1,
          description:
            "Du har begränsat intresse för nya idéer och föredrar att hålla dig till etablerade tankesätt.",
        },
        {
          value: 2,
          description:
            "Du är något skeptisk till abstrakta idéer men kan ibland delta i enklare intellektuella diskussioner.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till nya idéer och kan uppskatta både praktiska och teoretiska diskussioner.",
        },
        {
          value: 4,
          description:
            "Du har en stark intellektuell nyfikenhet och söker aktivt nya idéer och perspektiv.",
        },
        {
          value: 5,
          description:
            "Du har en extremt stark intellektuell nyfikenhet som genomsyrar nästan alla aspekter av ditt liv.",
        },
      ],
      values: [
        {
          value: 1,
          description:
            "Du har en mycket stark preferens för traditionella värderingar och etablerade normer.",
        },
        {
          value: 2,
          description:
            "Du tenderar att hålla fast vid konventionella värderingar och är skeptisk till förändringar av sociala normer.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till värderingar och kan både respektera traditioner och överväga nya idéer.",
        },
        {
          value: 4,
          description:
            "Du är öppen för att utmana konventionella värderingar och utforska alternativa synsätt.",
        },
        {
          value: 5,
          description:
            "Du har en extremt stark öppenhet för att omvärdera och utmana alla former av värderingar och normer.",
        },
      ],
    },
    conscientiousness: {
      competence: [
        {
          value: 1,
          description:
            "Du känner dig ofta oförmögen att hantera livets utmaningar och tvivlar starkt på din egen kompetens.",
        },
        {
          value: 2,
          description:
            "Du känner dig ibland kapabel men saknar ofta förtroende för din förmåga att hantera utmaningar.",
        },
        {
          value: 3,
          description:
            "Du upplever en genomsnittlig nivå av kompetens och kan hantera de flesta vardagliga uppgifter utan större problem.",
        },
        {
          value: 4,
          description:
            "Du känner dig kompetent och väl förberedd för att hantera de flesta utmaningar som kommer din väg.",
        },
        {
          value: 5,
          description:
            "Du känner dig extremt kompetent och har ett orubbligt självförtroende i din förmåga att utmärka dig i alla situationer.",
        },
      ],
      order: [
        {
          value: 1,
          description:
            "Du finner det extremt svårt att upprätthålla ordning och struktur i din omgivning och ditt liv.",
        },
        {
          value: 2,
          description:
            "Du kämpar med att hålla ordning och tenderar att låta saker bli oorganiserade.",
        },
        {
          value: 3,
          description:
            "Du har en genomsnittlig nivå av ordningssinne och kan upprätthålla en rimlig struktur i de flesta situationer.",
        },
        {
          value: 4,
          description:
            "Du är tydligt organiserad och upprätthåller god ordning i de flesta aspekter av ditt liv.",
        },
        {
          value: 5,
          description:
            "Du är exceptionellt ordningsam till den grad att det kan uppfattas som perfektionistiskt eller tvångsmässigt.",
        },
      ],
      dutifulness: [
        {
          value: 1,
          description:
            "Du har en mycket svag pliktkänsla och tar sällan ansvar för dina åtaganden.",
        },
        {
          value: 2,
          description:
            "Du har en begränsad pliktkänsla och kan ofta försumma dina åtaganden när det blir obekvämt.",
        },
        {
          value: 3,
          description:
            "Du har en genomsnittlig pliktkänsla och försöker vanligtvis uppfylla dina åtaganden.",
        },
        {
          value: 4,
          description:
            "Du har en stark pliktkänsla och lägger stor vikt vid att hålla dina löften och åtaganden.",
        },
        {
          value: 5,
          description:
            "Du har en exceptionellt stark och orubblig pliktkänsla som vägleder nästan alla dina beslut.",
        },
      ],
      achievementStriving: [
        {
          value: 1,
          description:
            "Du har mycket låg motivation att prestera och sätter sällan upp mål för dig själv.",
        },
        {
          value: 2,
          description:
            "Du har begränsad ambition att prestera och sätter få mål utöver de mest grundläggande.",
        },
        {
          value: 3,
          description:
            "Du har en genomsnittlig nivå av prestationssträvan och sätter rimliga mål för dig själv.",
        },
        {
          value: 4,
          description:
            "Du har en stark prestationssträvan och arbetar målmedvetet för att uppnå dina ambitioner.",
        },
        {
          value: 5,
          description:
            "Du har en exceptionellt intensiv prestationssträvan som dominerar ditt liv och dina beslut.",
        },
      ],
      selfDiscipline: [
        {
          value: 1,
          description:
            "Du har mycket låg självdisciplin och kämpar med att motstå frestelser eller hålla dig till uppgifter.",
        },
        {
          value: 2,
          description:
            "Du saknar självdisciplin och har svårt att fokusera på uppgifter som kräver uthållighet.",
        },
        {
          value: 3,
          description:
            "Du har en genomsnittlig nivå av självdisciplin och kan vanligtvis slutföra nödvändiga uppgifter, men kan ibland bli distraherad.",
        },
        {
          value: 4,
          description:
            "Du har god självdisciplin och kan effektivt sträva mot dina mål även när det är svårt.",
        },
        {
          value: 5,
          description:
            "Du har exceptionell självdisciplin och kan motivera dig själv att slutföra vilken uppgift du än bestämmer dig för.",
        },
      ],
      deliberation: [
        {
          value: 1,
          description:
            "Du är mycket impulsiv och agerar ofta utan att tänka, vilket kan leda till beklagliga beslut.",
        },
        {
          value: 2,
          description:
            "Du tenderar att vara spontan och kan ibland fatta beslut utan att överväga alla konsekvenser.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till beslutsfattande, och du kan vara både spontan och eftertänksam beroende på situationen.",
        },
        {
          value: 4,
          description:
            "Du är en försiktig och eftertänksam person som vanligtvis överväger alla alternativ innan du fattar ett beslut.",
        },
        {
          value: 5,
          description:
            "Du är en exceptionellt försiktig och eftertänksam person som analyserar varje detalj innan du fattar ett beslut.",
        },
      ],
    },
    extraversion: {
      warmth: [
        {
          value: 1,
          description:
            "Du är mycket reserverad och distanserad, och du visar sällan värme eller tillgivenhet mot andra.",
        },
        {
          value: 2,
          description:
            "Du är något reserverad och kan ha svårt att visa din vänliga sida för personer du inte känner väl.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad nivå av värme och kan vara vänlig och välkomnande i vissa situationer, men också reserverad i andra.",
        },
        {
          value: 4,
          description:
            "Du är en varm och vänlig person som är lätt att lära känna, och du visar ofta omtanke för andra.",
        },
        {
          value: 5,
          description:
            "Du är en exceptionellt varm och tillgiven person som får alla att känna sig välkomna och inkluderade.",
        },
      ],
      gregariousness: [
        {
          value: 1,
          description:
            "Du har ett mycket starkt behov av att vara ensam och undviker aktivt sociala sammankomster.",
        },
        {
          value: 2,
          description:
            "Du föredrar att vara ensam eller i mycket små grupper, och du kan känna dig obekväm i stora sociala sammanhang.",
        },
        {
          value: 3,
          description:
            "Du har ett balanserat behov av social interaktion och kan njuta av både att vara med andra och att vara ensam.",
        },
        {
          value: 4,
          description:
            "Du är en social person som trivs med att vara tillsammans med andra, och du söker ofta upp sociala aktiviteter.",
        },
        {
          value: 5,
          description:
            "Du är exceptionellt sällskaplig och känner ett starkt behov av att ständigt vara omgiven av andra människor.",
        },
      ],
      assertiveness: [
        {
          value: 1,
          description:
            "Du har mycket svårt att hävda dig i de flesta situationer och anpassar dig nästan alltid efter andras önskemål.",
        },
        {
          value: 2,
          description:
            "Du är vanligtvis tillbakadragen när det gäller att uttrycka dina åsikter och behov.",
        },
        {
          value: 3,
          description:
            "Du balanserar mellan att uttrycka dina åsikter och att anpassa dig till andra, och du kan vara självhävdande i vissa situationer.",
        },
        {
          value: 4,
          description:
            "Du är självsäker och har inga större problem med att uttrycka dina åsikter eller stå upp för dig själv.",
        },
        {
          value: 5,
          description:
            "Du är exceptionellt självhävdande och tar alltid kommandot i sociala och professionella situationer.",
        },
      ],
      activity: [
        {
          value: 1,
          description:
            "Du har en mycket låg aktivitetsnivå och föredrar att ta saker i din egen, långsamma takt.",
        },
        {
          value: 2,
          description:
            "Du har en ganska låg aktivitetsnivå och uppskattar lugna aktiviteter framför energiska.",
        },
        {
          value: 3,
          description:
            "Du har en måttlig aktivitetsnivå och balanserar perioder av aktivitet med vila.",
        },
        {
          value: 4,
          description:
            "Du har en hög aktivitetsnivå och söker aktivt möjligheter att vara i rörelse.",
        },
        {
          value: 5,
          description:
            "Du har en exceptionellt hög aktivitetsnivå som kännetecknar hela din tillvaro.",
        },
      ],
      excitementSeeking: [
        {
          value: 1,
          description:
            "Du är mycket försiktig och ogillar starkt situationer som innebär spänning eller överraskningar.",
        },
        {
          value: 2,
          description:
            "Du föredrar lugna, förutsägbara miljöer och lågriskaktiviteter.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till spänning och nya upplevelser, och du uppskattar variation med måtta.",
        },
        {
          value: 4,
          description:
            "Du dras ofta till spännande aktiviteter och nya upplevelser, och du tar gärna måttliga risker.",
        },
        {
          value: 5,
          description:
            "Du har ett mycket starkt behov av spänning, äventyr och intensiva upplevelser.",
        },
      ],
      positiveEmotions: [
        {
          value: 1,
          description:
            "Du känner mycket sällan positiva känslor och har en överväldigande dyster syn på livet.",
        },
        {
          value: 2,
          description:
            "Du upplever färre positiva känslor än de flesta och tenderar att fokusera på det negativa.",
        },
        {
          value: 3,
          description:
            "Du upplever positiva känslor i normal utsträckning, och ditt humör är relativt balanserat.",
        },
        {
          value: 4,
          description:
            "Du upplever ofta positiva känslor som glädje, entusiasm och optimism.",
        },
        {
          value: 5,
          description:
            "Du upplever exceptionellt starka och frekventa positiva känslor som definierar din personlighet.",
        },
      ],
    },
    agreeableness: {
      trust: [
        {
          value: 1,
          description:
            "Du är mycket skeptisk och har svårt att lita på andra, även personer du känner väl.",
        },
        {
          value: 2,
          description:
            "Du är försiktig med att lita på andra och behöver vanligtvis lång tid för att bygga upp förtroende.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till tillit och är varken särskilt misstänksam eller naivt tillitsfull.",
        },
        {
          value: 4,
          description:
            "Du litar relativt lätt på andra och tror generellt att de flesta människor är ärliga och pålitliga.",
        },
        {
          value: 5,
          description:
            "Du litar fullständigt på andra människor och utgår alltid från att alla har goda avsikter.",
        },
      ],
      straightforwardness: [
        {
          value: 1,
          description:
            "Du är mycket bekväm med att använda manipulation och undanhålla sanningen när det gynnar dig.",
        },
        {
          value: 2,
          description:
            "Du tenderar att vara försiktig med fullständig ärlighet och kan ofta välja att dölja delar av sanningen.",
        },
        {
          value: 3,
          description:
            "Du balanserar mellan ärlighet och takt, och anpassar din öppenhet efter situationen.",
        },
        {
          value: 4,
          description:
            "Du värdesätter ärlighet och direkthet i dina relationer och undviker medvetet manipulation.",
        },
        {
          value: 5,
          description:
            "Du är extremt direkt och rättfram i alla situationer, utan hänsyn till sociala konventioner eller möjliga negativa konsekvenser.",
        },
      ],
      altruism: [
        {
          value: 1,
          description:
            "Du är mycket fokuserad på dina egna intressen och engagerar dig sällan i andras problem.",
        },
        {
          value: 2,
          description:
            "Du är något reserverad i din vilja att hjälpa andra och prioriterar ofta dina egna behov.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad vilja att hjälpa andra och kan vara generös när det inte kostar dig för mycket.",
        },
        {
          value: 4,
          description:
            "Du är en hjälpsam och generös person som tycker om att hjälpa andra, ofta utan att förvänta dig något i gengäld.",
        },
        {
          value: 5,
          description:
            "Du är en exceptionellt osjälvisk och hjälpsam person som alltid är redo att offra dina egna behov för andra.",
        },
      ],
      compliance: [
        {
          value: 1,
          description:
            "Du är mycket tävlingsinriktad och ser alla konflikter som en kamp som ska vinnas.",
        },
        {
          value: 2,
          description:
            "Du är inte rädd för konflikter och står gärna upp för dina åsikter, även om det leder till konfrontation.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till konflikter och kan både stå på dig och vara tillmötesgående beroende på situationen.",
        },
        {
          value: 4,
          description:
            "Du är en följsam person som föredrar att undvika konflikter och hellre ger med dig än skapar dålig stämning.",
        },
        {
          value: 5,
          description:
            "Du är en exceptionellt följsam person som går mycket långt för att undvika alla former av konflikt.",
        },
      ],
      modesty: [
        {
          value: 1,
          description:
            "Du har mycket höga tankar om dig själv och pratar gärna om din egen förträfflighet.",
        },
        {
          value: 2,
          description:
            "Du är stolt över dina prestationer och har inga problem med att ta åt dig äran för dina framgångar.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad syn på dig själv och kan vara både stolt över dina prestationer och ödmjuk i din framtoning.",
        },
        {
          value: 4,
          description:
            "Du är en ödmjuk person som sällan skryter om dina egna prestationer.",
        },
        {
          value: 5,
          description:
            "Du är en exceptionellt ödmjuk och blygsam person som alltid tonar ner din egen betydelse.",
        },
      ],
      tenderMindedness: [
        {
          value: 1,
          description:
            "Du är mycket pragmatisk och låter sällan dina beslut påverkas av känslor eller sentimentalitet.",
        },
        {
          value: 2,
          description:
            "Du är något reserverad när det gäller känslomässigt engagemang i andras problem och föredrar ofta objektiva bedömningar.",
        },
        {
          value: 3,
          description:
            "Du har en balanserad inställning till andras känslomässiga behov och kan både visa empati och bibehålla objektivitet.",
        },
        {
          value: 4,
          description:
            "Du är ganska empatisk och blir ofta berörd av andras lidande eller svårigheter.",
        },
        {
          value: 5,
          description:
            "Du styrs helt av din medkänsla och reagerar intensivt på minsta tecken på lidande hos andra.",
        },
      ],
    },
    neuroticism: {
      anxiety: [
        {
          value: 1,
          description:
            "Du upplever sällan ångest och oroar dig väldigt lite för potentiella problem.",
        },
        {
          value: 2,
          description:
            "Du upplever periodvis ångest men kan vanligtvis hantera den effektivt.",
        },
        {
          value: 3,
          description:
            "Du har en måttlig nivå av ångest som ibland kan påverka dina beslut eller ditt välbefinnande.",
        },
        {
          value: 4,
          description:
            "Du upplever regelbundet ångest som påverkar ditt dagliga liv och dina beslut.",
        },
        {
          value: 5,
          description:
            "Du lider av överväldigande ångest som dominerar dina tankar och allvarligt begränsar ditt liv.",
        },
      ],
      angryHostility: [
        {
          value: 1,
          description:
            "Du blir sällan arg och när det händer är det kortvarigt och milt.",
        },
        {
          value: 2,
          description:
            "Du känner ibland irritation men uttrycker sällan ilska öppet.",
        },
        {
          value: 3,
          description:
            "Du känner ibland betydande ilska men försöker vanligtvis hantera den konstruktivt.",
        },
        {
          value: 4,
          description:
            "Du upplever ofta ilska och kan ha svårt att kontrollera dina känslomässiga reaktioner.",
        },
        {
          value: 5,
          description:
            "Du upplever överväldigande ilska som dominerar ditt känsloliv och dina relationer.",
        },
      ],
      depression: [
        {
          value: 1,
          description:
            "Du har en naturligt positiv inställning och känner sällan hopplöshet eller nedstämdhet utan anledning.",
        },
        {
          value: 2,
          description:
            "Du upplever ibland korta perioder av nedstämdhet men återgår snabbt till ditt normala, relativt positiva sinnestillstånd.",
        },
        {
          value: 3,
          description:
            "Du upplever både positiva och negativa känslolägen i ungefär samma utsträckning.",
        },
        {
          value: 4,
          description:
            "Du upplever regelbundet känslor av nedstämdhet som påverkar din livskvalitet.",
        },
        {
          value: 5,
          description:
            "Du upplever överväldigande och konstant nedstämdhet som allvarligt begränsar din funktionsförmåga.",
        },
      ],
      selfConsciousness: [
        {
          value: 1,
          description:
            "Du upplever sällan känslor av blyghet eller osäkerhet ens i nya sociala sammanhang.",
        },
        {
          value: 2,
          description:
            "Du känner ibland en mild osäkerhet i vissa sociala situationer men det hindrar dig sällan.",
        },
        {
          value: 3,
          description:
            "Du har en måttlig nivå av självmedvetenhet och kan ibland känna dig obekväm i sociala sammanhang.",
        },
        {
          value: 4,
          description:
            "Du upplever betydande självmedvetenhet i många sociala situationer och känner dig ofta generad eller obekväm.",
        },
        {
          value: 5,
          description:
            "Du upplever överväldigande självmedvetenhet som dominerar ditt sociala liv och leder till betydande undvikandebeteenden.",
        },
      ],
      impulsiveness: [
        {
          value: 1,
          description:
            "Du är mycket disciplinerad och kan lätt motstå frestelser och impulser.",
        },
        {
          value: 2,
          description:
            "Du har god självkontroll i de flesta situationer och kan vanligtvis motstå impulser.",
        },
        {
          value: 3,
          description:
            "Du har en måttlig nivå av impulskontroll och kan ibland agera spontant utan att tänka igenom konsekvenserna.",
        },
        {
          value: 4,
          description:
            "Du har svårt att kontrollera dina impulser och agerar ofta spontant utan att tänka på konsekvenserna.",
        },
        {
          value: 5,
          description:
            "Du upplever överväldigande impulser som du sällan kan kontrollera, vilket leder till ett ständigt impulsivt beteende.",
        },
      ],
      vulnerability: [
        {
          value: 1,
          description:
            "Du är mycket motståndskraftig mot stress och förblir stabil även i krävande situationer.",
        },
        {
          value: 2,
          description:
            "Du hanterar de flesta stressiga situationer väl och bibehåller vanligtvis din kompetens under press.",
        },
        {
          value: 3,
          description:
            "Du har god motståndskraft mot vardaglig stress men kan känna dig överväldigad av större kriser eller förändringar.",
        },
        {
          value: 4,
          description:
            "Du känner dig ofta överväldigad och hjälplös i stressiga situationer, och du har svårt att hantera press.",
        },
        {
          value: 5,
          description:
            "Du är extremt känslig för stress och kan känna dig helt paralyserad och oförmögen att agera i krissituationer.",
        },
      ],
    },
  },
};
