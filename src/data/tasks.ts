// Données originales pour les tâches interactives

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface SurveyQuestion {
  id: number;
  type: 'single' | 'multiple' | 'rating' | 'text';
  question: string;
  options?: string[];
  maxRating?: number;
}

export interface TutorialSlide {
  title: string;
  content: string;
  tip?: string;
  highlight?: string;
}

// === QUIZ ===
export const quizQuestions: Record<string, QuizQuestion[]> = {
  'culture-generale': [
    { id: 1, question: 'Quelle est la capitale de l\'Australie ?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correctAnswer: 2, explanation: 'Canberra est la capitale de l\'Australie, choisie comme compromis entre Sydney et Melbourne.' },
    { id: 2, question: 'Combien de continents y a-t-il sur Terre ?', options: ['5', '6', '7', '8'], correctAnswer: 2, explanation: 'Il y a 7 continents : Afrique, Amérique du Nord, Amérique du Sud, Antarctique, Asie, Europe et Océanie.' },
    { id: 3, question: 'Qui a peint la Joconde ?', options: ['Van Gogh', 'Picasso', 'Léonard de Vinci', 'Michel-Ange'], correctAnswer: 2, explanation: 'La Joconde a été peinte par Léonard de Vinci entre 1503 et 1519.' },
    { id: 4, question: 'Quelle est la plus grande planète du système solaire ?', options: ['Saturne', 'Jupiter', 'Neptune', 'Terre'], correctAnswer: 1, explanation: 'Jupiter est la plus grande planète, avec un diamètre d\'environ 143 000 km.' },
    { id: 5, question: 'En quelle année est tombé le mur de Berlin ?', options: ['1987', '1989', '1991', '1993'], correctAnswer: 1, explanation: 'Le mur de Berlin est tombé le 9 novembre 1989.' },
  ],
  'mathematiques': [
    { id: 1, question: 'Combien font 15 × 12 ?', options: ['170', '180', '190', '200'], correctAnswer: 1, explanation: '15 × 12 = 180. On peut le calculer comme 15 × 10 + 15 × 2 = 150 + 30 = 180.' },
    { id: 2, question: 'Quelle est la racine carrée de 144 ?', options: ['10', '11', '12', '13'], correctAnswer: 2, explanation: '√144 = 12, car 12 × 12 = 144.' },
    { id: 3, question: 'Combien de degrés dans un triangle ?', options: ['90°', '180°', '270°', '360°'], correctAnswer: 1, explanation: 'La somme des angles d\'un triangle est toujours de 180°.' },
    { id: 4, question: 'Que vaut 2 puissance 5 ?', options: ['10', '16', '25', '32'], correctAnswer: 3, explanation: '2^5 = 2 × 2 × 2 × 2 × 2 = 32.' },
    { id: 5, question: 'Quel est le nombre premier suivant 7 ?', options: ['9', '10', '11', '13'], correctAnswer: 2, explanation: '11 est le nombre premier suivant 7. 9 n\'est pas premier (3×3), 10 non plus (2×5).' },
  ],
  'histoire': [
    { id: 1, question: 'Qui était le premier président des États-Unis ?', options: ['Lincoln', 'Washington', 'Jefferson', 'Roosevelt'], correctAnswer: 1, explanation: 'George Washington a été le premier président des États-Unis de 1789 à 1797.' },
    { id: 2, question: 'En quelle année a commencé la Seconde Guerre mondiale ?', options: ['1914', '1939', '1941', '1945'], correctAnswer: 1, explanation: 'La Seconde Guerre mondiale a commencé en 1939 avec l\'invasion de la Pologne par l\'Allemagne.' },
    { id: 3, question: 'Quel empire a construit le Colisée à Rome ?', options: ['Grec', 'Romain', 'Byzantin', 'Ottoman'], correctAnswer: 1, explanation: 'Le Colisée a été construit sous l\'Empire romain entre 70 et 80 apr. J.-C.' },
    { id: 4, question: 'Qui a découvert l\'Amérique en 1492 ?', options: ['Magellan', 'Christophe Colomb', 'Vasco de Gama', 'Cartier'], correctAnswer: 1, explanation: 'Christophe Colomb a atteint l\'Amérique en 1492, bien que des Vikings y soient arrivés avant lui.' },
    { id: 5, question: 'Quand la Révolution française a-t-elle commencé ?', options: ['1776', '1789', '1799', '1804'], correctAnswer: 1, explanation: 'La Révolution française a commencé en 1789 avec la prise de la Bastille le 14 juillet.' },
  ],
  'sciences': [
    { id: 1, question: 'Quel est le symbole chimique de l\'or ?', options: ['Or', 'Au', 'Ag', 'Gd'], correctAnswer: 1, explanation: 'Le symbole Au vient du latin "aurum" qui signifie or.' },
    { id: 2, question: 'Combien de chromosomes possède l\'être humain ?', options: ['23', '46', '48', '64'], correctAnswer: 1, explanation: 'L\'être humain possède 46 chromosomes (23 paires).' },
    { id: 3, question: 'Quelle est la vitesse de la lumière ?', options: ['300 000 km/s', '150 000 km/s', '30 000 km/s', '3 000 km/s'], correctAnswer: 0, explanation: 'La lumière voyage à environ 300 000 km/s (précisément 299 792 458 m/s).' },
    { id: 4, question: 'Quel organe pompe le sang dans le corps ?', options: ['Le foie', 'Le cerveau', 'Le cœur', 'Les poumons'], correctAnswer: 2, explanation: 'Le cœur est l\'organe qui pompe le sang dans tout le corps humain.' },
    { id: 5, question: 'Quel gaz respirons-nous principalement ?', options: ['Oxygène', 'Azote', 'CO2', 'Hydrogène'], correctAnswer: 1, explanation: 'L\'air que nous respirons contient environ 78% d\'azote, 21% d\'oxygène.' },
  ],
  'geographie': [
    { id: 1, question: 'Quel est le plus long fleuve du monde ?', options: ['Amazone', 'Nil', 'Mississippi', 'Yangtsé'], correctAnswer: 1, explanation: 'Le Nil est généralement considéré comme le plus long fleuve du monde (6 650 km).' },
    { id: 2, question: 'Dans quel pays se trouve le Taj Mahal ?', options: ['Pakistan', 'Inde', 'Bangladesh', 'Népal'], correctAnswer: 1, explanation: 'Le Taj Mahal se trouve à Agra, en Inde.' },
    { id: 3, question: 'Quelle est la capitale du Japon ?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], correctAnswer: 2, explanation: 'Tokyo est la capitale du Japon depuis 1868.' },
    { id: 4, question: 'Quel est le plus grand désert du monde ?', options: ['Sahara', 'Gobi', 'Antarctique', 'Kalahari'], correctAnswer: 2, explanation: 'L\'Antarctique est le plus grand désert du monde (14 millions de km²).' },
    { id: 5, question: 'Combien de pays compte l\'Union européenne ?', options: ['25', '27', '28', '30'], correctAnswer: 1, explanation: 'L\'UE compte 27 pays membres depuis le Brexit en 2020.' },
  ],
  'technologie': [
    { id: 1, question: 'Qui a fondé Microsoft ?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Larry Page'], correctAnswer: 1, explanation: 'Bill Gates a cofondé Microsoft avec Paul Allen en 1975.' },
    { id: 2, question: 'Que signifie "HTTP" ?', options: ['HyperText Transfer Protocol', 'High Tech Transfer Protocol', 'HyperText Transmission Process', 'Home Transfer Text Protocol'], correctAnswer: 0, explanation: 'HTTP signifie HyperText Transfer Protocol, le protocole du web.' },
    { id: 3, question: 'Quelle entreprise a créé l\'iPhone ?', options: ['Samsung', 'Google', 'Apple', 'Nokia'], correctAnswer: 2, explanation: 'Apple a créé l\'iPhone, lancé en 2007 par Steve Jobs.' },
    { id: 4, question: 'Qu\'est-ce que l\'IA ?', options: ['Internet Avancé', 'Intelligence Artificielle', 'Interface Automatique', 'Information Avancée'], correctAnswer: 1, explanation: 'IA signifie Intelligence Artificielle.' },
    { id: 5, question: 'Combien de bits dans un octet ?', options: ['4', '8', '16', '32'], correctAnswer: 1, explanation: 'Un octet (byte) contient 8 bits.' },
  ],
};

// === SURVEYS ===
export const surveyQuestions: Record<string, SurveyQuestion[]> = {
  'consommation': [
    { id: 1, type: 'single', question: 'À quelle fréquence faites-vous des achats en ligne ?', options: ['Tous les jours', 'Plusieurs fois par semaine', 'Une fois par semaine', 'Une fois par mois', 'Rarement'] },
    { id: 2, type: 'multiple', question: 'Quels types de produits achetez-vous en ligne ?', options: ['Vêtements', 'Électronique', 'Livres', 'Alimentation', 'Beauté', 'Maison'] },
    { id: 3, type: 'rating', question: 'Quelle importance accordez-vous aux avis clients ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Quel est votre budget mensuel shopping ?', options: ['Moins de 10 000 FCFA', '10 000-30 000 FCFA', '30 000-50 000 FCFA', '50 000-100 000 FCFA', 'Plus de 100 000 FCFA'] },
    { id: 5, type: 'text', question: 'Qu\'est-ce qui vous motive le plus dans un achat ?' },
  ],
  'tech': [
    { id: 1, type: 'single', question: 'Quel smartphone utilisez-vous ?', options: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'Autre'] },
    { id: 2, type: 'multiple', question: 'Quels appareils tech possédez-vous ?', options: ['Ordinateur portable', 'Tablette', 'Montre connectée', 'Casque VR', 'Enceinte connectée', 'Console de jeu'] },
    { id: 3, type: 'rating', question: 'À quel point êtes-vous technophile ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Combien dépensez-vous en tech par an ?', options: ['Moins de 50 000 FCFA', '50 000-100 000 FCFA', '100 000-200 000 FCFA', 'Plus de 200 000 FCFA'] },
    { id: 5, type: 'text', question: 'Quelle innovation tech attendez-vous le plus ?' },
  ],
  'lifestyle': [
    { id: 1, type: 'single', question: 'Comment décririez-vous votre style de vie ?', options: ['Actif et sportif', 'Calme et reposant', 'Créatif et artistique', 'Social et festif', 'Équilibré'] },
    { id: 2, type: 'multiple', question: 'Quelles activités pratiquez-vous ?', options: ['Sport', 'Lecture', 'Voyages', 'Cuisine', 'Photographie', 'Musique', 'Gaming'] },
    { id: 3, type: 'rating', question: 'Quelle importance accordez-vous au bien-être ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Combien de temps libre avez-vous par jour ?', options: ['Moins d\'1h', '1-2h', '2-4h', 'Plus de 4h'] },
    { id: 5, type: 'text', question: 'Qu\'est-ce qui vous passionne dans la vie ?' },
  ],
  'beaute': [
    { id: 1, type: 'single', question: 'Quel est votre type de peau ?', options: ['Sèche', 'Grasse', 'Mixte', 'Normale', 'Sensible'] },
    { id: 2, type: 'multiple', question: 'Quels produits de beauté utilisez-vous ?', options: ['Crème hydratante', 'Fond de teint', 'Mascara', 'Rouge à lèvres', 'Sérum', 'Parfum'] },
    { id: 3, type: 'rating', question: 'Quelle importance accordez-vous aux produits bio ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Combien dépensez-vous en beauté par mois ?', options: ['Moins de 5 000 FCFA', '5 000-10 000 FCFA', '10 000-20 000 FCFA', 'Plus de 20 000 FCFA'] },
    { id: 5, type: 'text', question: 'Quelle marque de beauté préférez-vous et pourquoi ?' },
  ],
  'voyage': [
    { id: 1, type: 'single', question: 'Combien de voyages faites-vous par an ?', options: ['Aucun', '1-2', '3-5', 'Plus de 5'] },
    { id: 2, type: 'multiple', question: 'Quels types de destinations préférez-vous ?', options: ['Plage', 'Montagne', 'Ville', 'Campagne', 'Désert', 'Tropique'] },
    { id: 3, type: 'rating', question: 'Quelle importance accordez-vous au tourisme durable ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Quel est votre budget voyage annuel ?', options: ['Moins de 100 000 FCFA', '100 000-300 000 FCFA', '300 000-500 000 FCFA', 'Plus de 500 000 FCFA'] },
    { id: 5, type: 'text', question: 'Quelle est votre destination de rêve ?' },
  ],
  'alimentation': [
    { id: 1, type: 'single', question: 'Combien de repas par jour faites-vous ?', options: ['2', '3', '4', 'Plus de 4'] },
    { id: 2, type: 'multiple', question: 'Quels régimes suivez-vous ?', options: ['Végétarien', 'Vegan', 'Sans gluten', 'Halal', 'Casher', 'Aucun'] },
    { id: 3, type: 'rating', question: 'Quelle importance accordez-vous au bio ?', maxRating: 5 },
    { id: 4, type: 'single', question: 'Combien dépensez-vous en nourriture par mois ?', options: ['Moins de 20 000 FCFA', '20 000-40 000 FCFA', '40 000-60 000 FCFA', 'Plus de 60 000 FCFA'] },
    { id: 5, type: 'text', question: 'Quel est votre plat préféré ?' },
  ],
};

// === TUTORIALS ===
export const tradingSlides: TutorialSlide[] = [
  { title: 'Bienvenue dans le trading', content: 'Le trading consiste à acheter et vendre des actifs financiers (actions, devises, cryptos) dans le but de réaliser un profit. C\'est une activité qui demande de la discipline et des connaissances.', tip: 'Commencez toujours par un compte démo avant d\'investir de l\'argent réel.', highlight: 'Le trading comporte des risques de perte en capital.' },
  { title: 'Les bases du marché', content: 'Un marché financier est un lieu d\'échange d\'actifs. Les principaux marchés sont : les actions (bourses), le Forex (devises), les cryptomonnaies, les matières premières (or, pétrole) et les obligations.', tip: 'Diversifiez vos investissements sur plusieurs types d\'actifs.', highlight: 'La diversification réduit les risques.' },
  { title: 'L\'analyse technique', content: 'L\'analyse technique étudie les graphiques de prix pour prédire les mouvements futurs. Les outils principaux sont : les tendances, les supports et résistances, les indicateurs (RSI, MACD, moyennes mobiles).', tip: 'Apprenez à lire un graphique en chandeliers japonais.', highlight: 'Le prix reflète toute l\'information disponible.' },
  { title: 'Gestion des risques', content: 'La gestion des risques est LA compétence la plus importante. Règles d\'or : ne risquez jamais plus de 1-2% de votre capital par trade, utilisez toujours un stop-loss, ne mettez pas tous vos œufs dans le même panier.', tip: 'Un bon trader protège son capital avant de chercher le profit.', highlight: 'Préservez votre capital est la règle n°1.' },
  { title: 'Psychologie du trading', content: '90% du succès en trading vient de la psychologie. Les émotions (peur, avidité, espoir) sont vos pires ennemis. Développez une discipline stricte, un plan de trading et tenez un journal de vos trades.', tip: 'Ne tradez jamais sous le coup d\'une émotion forte.', highlight: 'Patience et discipline sont les clés du succès.' },
];

export const marketingSlides: TutorialSlide[] = [
  { title: 'Introduction au SEO', content: 'Le SEO (Search Engine Optimization) est l\'art d\'optimiser votre site pour apparaître en tête des résultats Google. Cela augmente votre trafic organique et donc vos conversions sans dépenser en publicité.', tip: 'Le SEO est un marathon, pas un sprint. Les résultats prennent 3-6 mois.', highlight: '75% des utilisateurs ne dépassent jamais la première page Google.' },
  { title: 'Recherche de mots-clés', content: 'La recherche de mots-clés est la base du SEO. Identifiez les termes que vos clients recherchent, avec un bon volume et une concurrence acceptable. Utilisez des outils comme Google Keyword Planner, Ubersuggest ou Ahrefs.', tip: 'Ciblez des mots-clés de longue traîne (3+ mots) pour moins de concurrence.', highlight: 'Un bon mot-clé = intention d\'achat + volume + faible concurrence.' },
  { title: 'Optimisation on-page', content: 'Optimisez chaque page : title tag (60 caractères max), meta description (155 caractères), URL courte, H1 unique, contenu de qualité (1000+ mots), images avec alt text, liens internes.', tip: 'Le contenu de qualité bat toujours l\'optimisation technique seule.', highlight: 'Le contenu est roi. "Content is King" - Bill Gates.' },
  { title: 'Stratégie de contenu', content: 'Créez du contenu qui répond aux questions de votre audience. Blog, vidéos, infographies, guides... Le contenu attire les visiteurs et construit votre autorité. La régularité est clé : publiez au moins 1x par semaine.', tip: 'Un contenu qui résout un problème = un contenu qui convertit.', highlight: 'Les entreprises qui bloguent génèrent 67% plus de leads.' },
  { title: 'Link building', content: 'Les backlinks (liens vers votre site) sont le critère n°1 de Google. Obtenez-les via : guest posting, relations presse, contenu remarquable, partenariats. La qualité compte plus que la quantité.', tip: 'Un backlink d\'un site autorité vaut 1000 liens de faible qualité.', highlight: '72% des SEO disent que les backlinks sont cruciaux.' },
];

export const seoSlides: TutorialSlide[] = [
  { title: 'Qu\'est-ce que le SEO ?', content: 'Le référencement naturel (SEO) optimise votre visibilité dans les moteurs de recherche. C\'est le canal marketing le plus rentable à long terme.', tip: 'Le SEO génère 1000% plus de trafic que les réseaux sociaux.', highlight: '93% des expériences en ligne commencent par un moteur de recherche.' },
  { title: 'Les 3 piliers du SEO', content: 'Technique (vitesse, mobile, structure), Contenu (qualité, mots-clés), Popularité (backlinks). Les trois doivent être travaillés simultanément.', tip: 'Un site lent perd 53% de ses visiteurs mobiles.', highlight: 'Google utilise 200+ critères de classement.' },
  { title: 'Optimisation technique', content: 'Vitesse de chargement (< 3s), responsive mobile, HTTPS, sitemap XML, robots.txt, données structurées Schema.org, Core Web Vitals.', tip: 'Testez votre vitesse sur PageSpeed Insights de Google.', highlight: '1 seconde de retard = 7% de conversions en moins.' },
  { title: 'Création de contenu', content: 'Écrivez pour l\'humain d\'abord, optimisez pour Google ensuite. Contenu long (1500+ mots), structuré (H1, H2, H3), original et à forte valeur ajoutée.', tip: 'Répondez aux questions "People Also Ask" de Google.', highlight: 'Le contenu long génère 3x plus de backlinks.' },
  { title: 'Mesurer vos résultats', content: 'Utilisez Google Search Console et Google Analytics. Suivez : positions, clics, impressions, CTR, trafic organique, conversions.', tip: 'La patience est votre meilleure alliée en SEO.', highlight: 'Le SEO a un ROI moyen de 275%.' },
];
