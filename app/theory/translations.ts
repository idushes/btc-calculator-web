export type Lang = "en" | "ru" | "uk" | "es" | "de" | "fr";

export const LANGUAGES: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uk", label: "UA" },
  { code: "es", label: "ES" },
  { code: "de", label: "DE" },
  { code: "fr", label: "FR" },
];

interface Translation {
  back: string;
  title: string;
  subtitle: string;
  s1_title: string;
  s1_p1: string;
  s1_p2: string;
  s2_title: string;
  s2_p1: string;
  s2_bullet1: string;
  s2_bullet2: string;
  s2_bullet3: string;
  s3_title: string;
  s3_p1: string;
  s3_p2: string;
  s4_title: string;
  s4_p1: string;
  s5_title: string;
  s5_p1: string;
  quote: string;
  disclaimer: string;
}

export const translations: Record<Lang, Translation> = {
  en: {
    back: "Back to Calculator",
    title: "Based on Theory by Pavel Solodkov",
    subtitle: "MiningHub",
    s1_title: "What is the Energy Floor Theory?",
    s1_p1: "In a market often driven by speculation, the Energy Floor Theory provides a fundamental anchor. Developed by mining researcher Pavel Solodkov, the theory suggests that Bitcoin's price has a \"physical\" lower limit defined by the cost of its production.",
    s1_p2: "Bitcoin is supported by a global infrastructure consuming over 26 GW of power. If the market price falls below the cost of mining for the majority of the network, it creates a critical stress point for the blockchain's security and decentralization. Historically, this production cost acts as a \"hard floor,\" marking the most reliable zones for market bottoms.",
    s2_title: "How the Calculator Works",
    s2_p1: "This tool allows you to calculate the \"Energy Floor\" in real-time by adjusting the three fundamental pillars of the mining economy:",
    s2_bullet1: "Network Difficulty — the self-adjusting measure of how hard it is to find a Bitcoin block.",
    s2_bullet2: "Hardware Efficiency — measured in W/TH (Watts per Terahash). The model accounts for the \"mass market\" hardware (currently averaging 17–19 W/TH) that forms the backbone of the network.",
    s2_bullet3: "Electricity Cost — the average global rate for industrial miners (benchmark: $0.06/kWh).",
    s3_title: "About the Author",
    s3_p1: "Pavel Solodkov is a prominent crypto-analyst and the founder of MiningHub. With over three years of dedicated research into Bitcoin's mathematical models, Pavel has analyzed thousands of variables — from global energy rates to the real-world performance of mining hardware.",
    s3_p2: "His mission is to move Bitcoin valuation away from \"finger-in-the-air\" guessing and toward a transparent, data-driven methodology that reflects the actual cost of securing the network.",
    s4_title: "Why Use This Tool?",
    s4_p1: "The Energy Floor is a \"sanity check\" for investors and miners alike. While news and social media create volatility, the cost of electricity and hardware remains a constant reality. This calculator helps you strip away the noise and identify the level where the digital asset meets physical world costs.",
    s5_title: "The Historical Record",
    s5_p1: "Bitcoin's market price has never fallen below the average production cost for the majority of mining equipment on the network. This is not a coincidence — it is an economic constraint enforced by the physical realities of mining infrastructure, energy costs (W/TH), and the incentive structure of the protocol itself.",
    quote: "\"Bitcoin's price is a market choice; its production cost is a mathematical reality.\"",
    disclaimer: "This calculator is a tool for fundamental analysis and educational purposes only. It does not constitute financial advice.",
  },
  ru: {
    back: "Назад к калькулятору",
    title: "На основе теории Павла Солодкова",
    subtitle: "MiningHub",
    s1_title: "Что такое теория энергетического дна?",
    s1_p1: "На рынке, управляемом спекуляциями, теория энергетического дна предлагает фундаментальный якорь. Разработанная исследователем майнинга Павлом Солодковым, теория утверждает, что цена биткоина имеет «физический» нижний предел, определяемый себестоимостью его производства.",
    s1_p2: "Биткоин поддерживается глобальной инфраструктурой потребляющей более 26 ГВт мощности. Если рыночная цена падает ниже себестоимости майнинга для большинства сети, это создаёт критическую точку напряжения для безопасности и децентрализации блокчейна. Исторически эта себестоимость выступает «жёстким дном», обозначая наиболее надёжные зоны рыночных минимумов.",
    s2_title: "Как работает калькулятор",
    s2_p1: "Этот инструмент позволяет рассчитать «энергетическое дно» в реальном времени, регулируя три фундаментальных параметра экономики майнинга:",
    s2_bullet1: "Сложность сети — авторегулируемый показатель того, насколько сложно найти блок биткоина.",
    s2_bullet2: "Энергоэффективность оборудования — измеряется в W/TH (Ватт на Терахеш). Модель учитывает «массовое» оборудование (в среднем 17–19 W/TH), составляющее основу сети.",
    s2_bullet3: "Стоимость электроэнергии — средний мировой тариф для промышленных майнеров (бенчмарк: $0.06/кВт·ч).",
    s3_title: "Об авторе",
    s3_p1: "Павел Солодков — известный крипто-аналитик и основатель MiningHub. Более трёх лет углублённого исследования математических моделей биткоина, тысячи проанализированных переменных — от мировых тарифов на энергию до реальных показателей майнинг-оборудования.",
    s3_p2: "Его миссия — перевести оценку биткоина от «гадания на кофейной гуще» к прозрачной, основанной на данных методологии, отражающей реальную стоимость обеспечения безопасности сети.",
    s4_title: "Зачем использовать этот инструмент?",
    s4_p1: "Энергетическое дно — это «проверка на вменяемость» для инвесторов и майнеров. Пока новости и соцсети создают волатильность, стоимость электричества и оборудования остаётся неизменной реальностью. Калькулятор помогает отсечь шум и определить уровень, где цифровой актив встречается с физическими издержками.",
    s5_title: "Исторический факт",
    s5_p1: "Рыночная цена биткоина никогда не падала ниже средней себестоимости производства для большинства оборудования в сети. Это не совпадение — это экономическое ограничение, обусловленное физическими реалиями инфраструктуры майнинга, затратами энергии (W/TH) и структурой стимулов протокола.",
    quote: "«Цена биткоина — это выбор рынка; его себестоимость — математическая реальность.»",
    disclaimer: "Калькулятор является инструментом фундаментального анализа и предназначен только для образовательных целей. Не является финансовой рекомендацией.",
  },
  uk: {
    back: "Назад до калькулятора",
    title: "На основі теорії Павла Солодкова",
    subtitle: "MiningHub",
    s1_title: "Що таке теорія енергетичного дна?",
    s1_p1: "На ринку, керованому спекуляціями, теорія енергетичного дна пропонує фундаментальний якір. Розроблена дослідником майнінгу Павлом Солодковим, теорія стверджує, що ціна біткоїна має «фізичну» нижню межу, визначену собівартістю його виробництва.",
    s1_p2: "Біткоїн підтримується глобальною інфраструктурою, що споживає понад 26 ГВт потужності. Якщо ринкова ціна падає нижче собівартості майнінгу для більшості мережі, це створює критичну точку напруги для безпеки та децентралізації блокчейну. Історично ця собівартість виступає «жорстким дном», позначаючи найнадійніші зони ринкових мінімумів.",
    s2_title: "Як працює калькулятор",
    s2_p1: "Цей інструмент дозволяє розрахувати «енергетичне дно» в реальному часі, регулюючи три фундаментальні параметри економіки майнінгу:",
    s2_bullet1: "Складність мережі — авторегульований показник того, наскільки складно знайти блок біткоїна.",
    s2_bullet2: "Енергоефективність обладнання — вимірюється в W/TH (Ват на Терахеш). Модель враховує «масове» обладнання (в середньому 17–19 W/TH), що складає основу мережі.",
    s2_bullet3: "Вартість електроенергії — середній світовий тариф для промислових майнерів (бенчмарк: $0.06/кВт·год).",
    s3_title: "Про автора",
    s3_p1: "Павло Солодков — відомий крипто-аналітик та засновник MiningHub. Понад три роки поглибленого дослідження математичних моделей біткоїна, тисячі проаналізованих змінних — від світових тарифів на енергію до реальних показників майнінг-обладнання.",
    s3_p2: "Його місія — перевести оцінку біткоїна від «ворожіння на кавовій гущі» до прозорої, заснованої на даних методології, що відображає реальну вартість забезпечення безпеки мережі.",
    s4_title: "Навіщо використовувати цей інструмент?",
    s4_p1: "Енергетичне дно — це «перевірка на адекватність» для інвесторів та майнерів. Поки новини та соцмережі створюють волатильність, вартість електрики та обладнання залишається незмінною реальністю. Калькулятор допомагає відсікти шум та визначити рівень, де цифровий актив зустрічається з фізичними витратами.",
    s5_title: "Історичний факт",
    s5_p1: "Ринкова ціна біткоїна ніколи не падала нижче середньої собівартості виробництва для більшості обладнання в мережі. Це не збіг — це економічне обмеження, зумовлене фізичними реаліями інфраструктури майнінгу, витратами енергії (W/TH) та структурою стимулів протоколу.",
    quote: "«Ціна біткоїна — це вибір ринку; його собівартість — математична реальність.»",
    disclaimer: "Калькулятор є інструментом фундаментального аналізу та призначений лише для освітніх цілей. Не є фінансовою рекомендацією.",
  },
  es: {
    back: "Volver a la Calculadora",
    title: "Basado en la Teoría de Pavel Solodkov",
    subtitle: "MiningHub",
    s1_title: "¿Qué es la Teoría del Piso Energético?",
    s1_p1: "En un mercado a menudo impulsado por la especulación, la Teoría del Piso Energético proporciona un ancla fundamental. Desarrollada por el investigador de minería Pavel Solodkov, la teoría sugiere que el precio de Bitcoin tiene un límite inferior \"físico\" definido por el costo de su producción.",
    s1_p2: "Bitcoin cuenta con una infraestructura global que consume más de 26 GW de potencia. Si el precio de mercado cae por debajo del costo de minería para la mayoría de la red, se crea un punto de estrés crítico para la seguridad y descentralización de la blockchain. Históricamente, este costo de producción actúa como un \"piso duro\", marcando las zonas más confiables para los mínimos del mercado.",
    s2_title: "Cómo Funciona la Calculadora",
    s2_p1: "Esta herramienta le permite calcular el \"Piso Energético\" en tiempo real ajustando los tres pilares fundamentales de la economía minera:",
    s2_bullet1: "Dificultad de Red — la medida autoajustable de lo difícil que es encontrar un bloque de Bitcoin.",
    s2_bullet2: "Eficiencia del Hardware — medida en W/TH (Vatios por Terahash). El modelo considera el hardware del \"mercado masivo\" (actualmente promedio de 17–19 W/TH) que forma la columna vertebral de la red.",
    s2_bullet3: "Costo de Electricidad — la tarifa promedio global para mineros industriales (referencia: $0.06/kWh).",
    s3_title: "Sobre el Autor",
    s3_p1: "Pavel Solodkov es un destacado cripto-analista y fundador de MiningHub. Con más de tres años de investigación dedicada a los modelos matemáticos de Bitcoin, ha analizado miles de variables — desde tarifas energéticas globales hasta el rendimiento real del hardware de minería.",
    s3_p2: "Su misión es mover la valoración de Bitcoin de las adivinanzas hacia una metodología transparente basada en datos que refleje el costo real de asegurar la red.",
    s4_title: "¿Por Qué Usar Esta Herramienta?",
    s4_p1: "El Piso Energético es una \"verificación de cordura\" para inversores y mineros por igual. Mientras las noticias crean volatilidad, el costo de la electricidad y el hardware sigue siendo una realidad constante. Esta calculadora le ayuda a eliminar el ruido e identificar el nivel donde el activo digital se encuentra con los costos del mundo físico.",
    s5_title: "El Registro Histórico",
    s5_p1: "El precio de mercado de Bitcoin nunca ha caído por debajo del costo promedio de producción para la mayoría del equipo de minería en la red. Esto no es una coincidencia — es una restricción económica impuesta por las realidades físicas de la infraestructura minera, los costos energéticos (W/TH) y la estructura de incentivos del protocolo.",
    quote: "\"El precio de Bitcoin es una elección del mercado; su costo de producción es una realidad matemática.\"",
    disclaimer: "Esta calculadora es una herramienta de análisis fundamental y con fines educativos únicamente. No constituye asesoramiento financiero.",
  },
  de: {
    back: "Zurück zum Rechner",
    title: "Basierend auf der Theorie von Pavel Solodkov",
    subtitle: "MiningHub",
    s1_title: "Was ist die Energie-Boden-Theorie?",
    s1_p1: "In einem Markt, der oft von Spekulation getrieben wird, bietet die Energie-Boden-Theorie einen fundamentalen Anker. Entwickelt vom Mining-Forscher Pavel Solodkov, legt die Theorie nahe, dass der Bitcoin-Preis eine \"physische\" Untergrenze hat, die durch die Produktionskosten definiert wird.",
    s1_p2: "Bitcoin wird von einer globalen Infrastruktur gestützt, die über 26 GW Leistung verbraucht. Wenn der Marktpreis unter die Mining-Kosten der Mehrheit des Netzwerks fällt, entsteht ein kritischer Stresspunkt für die Sicherheit und Dezentralisierung der Blockchain. Historisch fungieren diese Produktionskosten als \"harter Boden\" und markieren die zuverlässigsten Zonen für Markttiefs.",
    s2_title: "Wie der Rechner funktioniert",
    s2_p1: "Dieses Tool ermöglicht es Ihnen, den \"Energie-Boden\" in Echtzeit zu berechnen, indem Sie die drei fundamentalen Säulen der Mining-Ökonomie anpassen:",
    s2_bullet1: "Netzwerk-Schwierigkeit — das selbstanpassende Maß dafür, wie schwierig es ist, einen Bitcoin-Block zu finden.",
    s2_bullet2: "Hardware-Effizienz — gemessen in W/TH (Watt pro Terahash). Das Modell berücksichtigt die \"Massenmarkt\"-Hardware (derzeit durchschnittlich 17–19 W/TH), die das Rückgrat des Netzwerks bildet.",
    s2_bullet3: "Stromkosten — der globale Durchschnittstarif für industrielle Miner (Benchmark: $0,06/kWh).",
    s3_title: "Über den Autor",
    s3_p1: "Pavel Solodkov ist ein renommierter Krypto-Analyst und Gründer von MiningHub. Mit über drei Jahren engagierter Forschung an Bitcoins mathematischen Modellen hat er Tausende von Variablen analysiert — von globalen Energietarifen bis zur realen Leistung von Mining-Hardware.",
    s3_p2: "Seine Mission ist es, die Bitcoin-Bewertung von Schätzungen hin zu einer transparenten, datengetriebenen Methodik zu bewegen, die die tatsächlichen Kosten der Netzwerksicherung widerspiegelt.",
    s4_title: "Warum dieses Tool verwenden?",
    s4_p1: "Der Energie-Boden ist ein \"Realitätscheck\" für Investoren und Miner gleichermaßen. Während Nachrichten und soziale Medien Volatilität erzeugen, bleiben die Kosten für Strom und Hardware eine konstante Realität. Dieser Rechner hilft Ihnen, das Rauschen auszublenden und das Niveau zu identifizieren, wo digitale Assets auf physische Kosten treffen.",
    s5_title: "Die historische Bilanz",
    s5_p1: "Der Marktpreis von Bitcoin ist nie unter die durchschnittlichen Produktionskosten der Mehrheit der Mining-Ausrüstung im Netzwerk gefallen. Dies ist kein Zufall — es ist eine wirtschaftliche Beschränkung, die durch die physischen Realitäten der Mining-Infrastruktur, die Energiekosten (W/TH) und die Anreizstruktur des Protokolls durchgesetzt wird.",
    quote: "\"Bitcoins Preis ist eine Marktentscheidung; seine Produktionskosten sind eine mathematische Realität.\"",
    disclaimer: "Dieser Rechner ist ein Werkzeug zur Fundamentalanalyse und dient ausschließlich Bildungszwecken. Er stellt keine Finanzberatung dar.",
  },
  fr: {
    back: "Retour à la Calculatrice",
    title: "Basé sur la Théorie de Pavel Solodkov",
    subtitle: "MiningHub",
    s1_title: "Qu'est-ce que la Théorie du Plancher Énergétique ?",
    s1_p1: "Dans un marché souvent guidé par la spéculation, la Théorie du Plancher Énergétique offre un ancrage fondamental. Développée par le chercheur en minage Pavel Solodkov, la théorie suggère que le prix du Bitcoin a une limite inférieure « physique » définie par le coût de sa production.",
    s1_p2: "Bitcoin est soutenu par une infrastructure mondiale consommant plus de 26 GW de puissance. Si le prix du marché tombe en dessous du coût de minage pour la majorité du réseau, cela crée un point de stress critique pour la sécurité et la décentralisation de la blockchain. Historiquement, ce coût de production agit comme un « plancher dur », marquant les zones les plus fiables pour les creux du marché.",
    s2_title: "Comment Fonctionne la Calculatrice",
    s2_p1: "Cet outil vous permet de calculer le « Plancher Énergétique » en temps réel en ajustant les trois piliers fondamentaux de l'économie minière :",
    s2_bullet1: "Difficulté du Réseau — la mesure auto-ajustable de la difficulté à trouver un bloc Bitcoin.",
    s2_bullet2: "Efficacité du Matériel — mesurée en W/TH (Watts par Terahash). Le modèle prend en compte le matériel du « marché de masse » (moyenne actuelle de 17–19 W/TH) qui constitue l'épine dorsale du réseau.",
    s2_bullet3: "Coût de l'Électricité — le tarif moyen mondial pour les mineurs industriels (référence : 0,06 $/kWh).",
    s3_title: "À Propos de l'Auteur",
    s3_p1: "Pavel Solodkov est un éminent crypto-analyste et fondateur de MiningHub. Avec plus de trois ans de recherche dédiée aux modèles mathématiques de Bitcoin, il a analysé des milliers de variables — des tarifs énergétiques mondiaux aux performances réelles du matériel de minage.",
    s3_p2: "Sa mission est de faire passer l'évaluation du Bitcoin de la simple conjecture vers une méthodologie transparente, basée sur les données, reflétant le coût réel de la sécurisation du réseau.",
    s4_title: "Pourquoi Utiliser Cet Outil ?",
    s4_p1: "Le Plancher Énergétique est une « vérification de bon sens » pour les investisseurs et les mineurs. Alors que les médias créent de la volatilité, le coût de l'électricité et du matériel reste une réalité constante. Cette calculatrice vous aide à éliminer le bruit et à identifier le niveau où l'actif numérique rencontre les coûts du monde physique.",
    s5_title: "Le Bilan Historique",
    s5_p1: "Le prix du marché du Bitcoin n'est jamais tombé en dessous du coût moyen de production pour la majorité des équipements de minage du réseau. Ce n'est pas une coïncidence — c'est une contrainte économique imposée par les réalités physiques de l'infrastructure minière, les coûts énergétiques (W/TH) et la structure d'incitation du protocole lui-même.",
    quote: "« Le prix du Bitcoin est un choix du marché ; son coût de production est une réalité mathématique. »",
    disclaimer: "Cette calculatrice est un outil d'analyse fondamentale à des fins éducatives uniquement. Elle ne constitue pas un conseil financier.",
  },
};
