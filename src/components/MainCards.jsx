
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Lightbulb, Award, Target, FileText, X, MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import Bees from './Bees';
import { Button } from '@/components/ui/button';

const villageData = [
  {
    id: 1,
    title: "Le Camp des Romains",
    subtitle: "Systèmes Traditionnels",
    character: "Obélix",
    // Forme Ronde/Menhir (Obélix)
    shapeClass: "rounded-[50%]",
    shapeStyle: { 
      aspectRatio: "1/1",
      borderWidth: "6px"
    },
    icon: AlertCircle,
    color: "bg-red-100 text-red-600",
    borderColor: "border-red-400",
    position: "col-start-1 md:col-start-1",
    shortDesc: "Ils sont fous ces Romains !",
    link: "https://nird.forge.apps.education.fr/pourquoi/",
    details: {
      intro: "Comme un camp romain rigide et coûteux, les systèmes propriétaires (Windows, etc.) enferment l'école.",
      points: [
        { title: "Coûts Exorbitants", text: "Licences perpétuelles onéreuses qui pèsent sur le budget des collectivités." },
        { title: "Obsolescence Programmée", text: "Matériel déclaré 'trop vieux' artificiellement, forçant au rachat inutile." },
        { title: "Données Personnelles", text: "Pillage des données élèves (télémétrie) par les GAFAM, contraire au RGPD." },
        { title: "Virus & Sécurité", text: "Vulnérabilité constante aux malwares nécessitant des antivirus coûteux." },
        { title: "Perte de Souveraineté", text: "Dépendance totale à des acteurs étrangers pour l'éducation nationale." }
      ]
    }
  },
  {
    id: 2,
    title: "La Potion Magique",
    subtitle: "Solution NIRD",
    character: "Panoramix",
    // Forme Bâton (Panoramix) - Haut et étroit
    shapeClass: "rounded-2xl",
    shapeStyle: { 
      height: "110%",
      width: "85%",
      margin: "0 auto",
      borderRadius: "50px 50px 20px 20px",
      borderWidth: "5px"
    },
    icon: Lightbulb,
    color: "bg-blue-100 text-blue-600",
    borderColor: "border-blue-400",
    position: "col-start-1 md:col-start-3",
    shortDesc: "La recette secrète du Druide",
    link: "https://nird.forge.apps.education.fr/index.html",
    details: {
      intro: "NIRD est la potion magique qui redonne le pouvoir aux écoles grâce à l'Open Source.",
      points: [
        { title: "Linux & Logiciels Libres", text: "Système stable, gratuit, sans virus et transparent (basé sur Debian/Ubuntu)." },
        { title: "Seconde Vie du Matériel", text: "NIRD tourne parfaitement sur des PC de 10 ans d'âge. Plus besoin de jeter !" },
        { title: "Interface Intuitive", text: "Un bureau simple, adapté aux élèves du CP au CM2 et au collège." },
        { title: "Zéro Licence", text: "Budget logiciel = 0€. Les économies partent dans les projets pédagogiques." },
        { title: "Respect de la Vie Privée", text: "Aucun traçage. Vos données restent dans l'école." }
      ]
    }
  },
  {
    id: 3,
    title: "Le Conseil du Village",
    subtitle: "Pourquoi NIRD ?",
    character: "Abraracourcix",
    // Forme Bouclier (Abraracourcix) - Rond avec bordure pointillée (rivets)
    shapeClass: "rounded-full",
    shapeStyle: { 
      aspectRatio: "1/1",
      borderStyle: "dashed",
      borderWidth: "8px"
    },
    icon: Award,
    color: "bg-pink-100 text-pink-600",
    borderColor: "border-pink-400",
    position: "col-start-1 md:col-start-1",
    shortDesc: "Sur le bouclier du chef !",
    link: "https://nird.forge.apps.education.fr/pourquoi/",
    details: {
      intro: "L'adoption de NIRD s'appuie sur des textes officiels et une vision optimiste de l'avenir.",
      points: [
        { title: "Loi REEN (2021)", text: "Obligation de favoriser le réemploi et la sobriété numérique dans la commande publique." },
        { title: "Code de l'Éducation", text: "Priorité au logiciel libre (Article L131-2) pour l'égalité d'accès." },
        { title: "Cadre CRCN", text: "Développer les compétences numériques réelles, pas juste cliquer sur des icônes." },
        { title: "Liberté Pédagogique", text: "Les enseignants choisissent leurs outils sans diktat commercial." },
        { title: "Communauté Solidaire", text: "Un réseau d'entraide national plutôt qu'une hotline payante." }
      ]
    }
  },
  {
    id: 4,
    title: "Les Lauriers de César",
    subtitle: "Objectifs",
    character: "Astérix",
    // Forme Casque (Astérix) - Pointe au milieu, "ailes" sur les côtés simulées par clip-path
    shapeClass: "rounded-none",
    shapeStyle: { 
      clipPath: "polygon(50% 0%, 80% 15%, 100% 10%, 100% 100%, 0% 100%, 0% 10%, 20% 15%)",
      paddingTop: "3rem"
    },
    icon: Target,
    color: "bg-yellow-100 text-yellow-600",
    borderColor: "border-yellow-400",
    position: "col-start-1 md:col-start-3",
    shortDesc: "Par Toutatis !",
    link: "https://nird.forge.apps.education.fr/linux/",
    details: {
      intro: "Notre mission : former des citoyens numériques éclairés, pas des consommateurs passifs.",
      points: [
        { title: "Inclusion Totale", text: "Réduire la fracture numérique : le même outil à l'école et à la maison (clé USB NIRD)." },
        { title: "Écologie Concrète", text: "Réduire de 60% l'empreinte carbone du parc informatique scolaire." },
        { title: "Souveraineté Numérique", text: "Reprendre le contrôle de nos infrastructures éducatives." },
        { title: "Autonomie", text: "Apprendre aux élèves comment fonctionne l'ordinateur, coder, créer." }
      ]
    }
  },
  {
    id: 5,
    title: "Armes de Vercingétorix",
    subtitle: "Démarches",
    character: "Vercingétorix",
    // Forme Couronne (Vercingétorix) - Zigzag en haut
    shapeClass: "rounded-none",
    shapeStyle: { 
      clipPath: "polygon(0% 0%, 25% 15%, 50% 0%, 75% 15%, 100% 0%, 100% 100%, 0% 100%)",
      paddingTop: "3rem"
    },
    icon: FileText,
    color: "bg-purple-100 text-purple-600",
    borderColor: "border-purple-400",
    position: "col-start-1 md:col-start-2",
    shortDesc: "Je dépose les armes... numériques !",
    link: "https://nird.forge.apps.education.fr/index.html",
    details: {
      intro: "Rejoindre le village NIRD est un parcours balisé et accompagné.",
      points: [
        { title: "1. Audit", text: "Inventaire du parc existant (souvent réutilisable à 90%)." },
        { title: "2. Délibération", text: "Vote en conseil d'école et accord de la collectivité (Mairie/Département)." },
        { title: "3. Installation", text: "Déploiement automatisé de NIRD sur les postes (rapide et sans douleur)." },
        { title: "4. Formation", text: "Ateliers ludiques pour les enseignants et remise des clés aux élèves." },
        { title: "5. Support", text: "Assistance technique via Tchap et la communauté locale." }
      ]
    }
  }
];

const VillageMap = () => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <section className="relative py-20 px-4 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] bg-yellow-50/50">
      {/* Arrière-plan décoratif "Village" - Chemin central */}
      <div className="absolute inset-0 pointer-events-none flex justify-center">
        <svg className="h-full w-full max-w-4xl opacity-20" viewBox="0 0 400 1000" preserveAspectRatio="none">
          <path 
            d="M200,0 C200,0 200,100 100,200 C0,300 0,400 100,500 C200,600 300,700 200,800 C100,900 200,1000 200,1000" 
            fill="none" 
            stroke="#d97706" 
            strokeWidth="40" 
            strokeDasharray="20,20"
            className="drop-shadow-xl"
          />
        </svg>
      </div>

      <Bees />

      <div className="max-w-6xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-gray-800 drop-shadow-sm">
          🗺️ La Carte du Village NIRD
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 auto-rows-auto place-items-center">
          {villageData.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                layoutId={`card-${card.id}`}
                className={`${card.position} relative group cursor-pointer w-full max-w-xs flex justify-center`}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: index % 2 === 0 ? 2 : -2 }}
              >
                {/* Liaison visuelle */}
                <div className={`absolute top-1/2 ${index % 2 === 0 ? '-right-16' : '-left-16'} w-16 h-3 bg-stone-300 hidden md:block -z-10 transform ${index % 2 === 0 ? '-rotate-12' : 'rotate-12'} border-2 border-stone-400 border-dashed`} />

                <div 
                  onClick={() => setSelectedCard(card)}
                  style={card.shapeStyle}
                  className={`
                    ${card.color} ${card.borderColor} ${card.shapeClass}
                    bg-opacity-95 border-4 shadow-xl
                    p-6 transition-all duration-300 hover:shadow-2xl
                    flex flex-col items-center text-center h-full min-h-[320px] w-full justify-between relative overflow-hidden
                  `}
                >
                  <div className="mb-2 p-3 bg-white rounded-full shadow-md z-10">
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="z-10 flex-grow flex flex-col justify-center">
                    <h3 className="text-xl font-black mb-1 leading-tight">{card.title}</h3>
                    <p className="text-xs font-bold opacity-80 mb-2 uppercase tracking-wider">{card.subtitle}</p>
                    <div className="w-12 h-1 bg-current opacity-30 mx-auto mb-2 rounded-full"></div>
                    <p className="text-sm font-medium italic opacity-90">"{card.shortDesc}"</p>
                  </div>

                  <div className="mt-4 z-10 space-y-2 w-full">
                    <div className="flex items-center justify-center text-xs font-bold uppercase tracking-wide opacity-70">
                       <MapPin className="w-3 h-3 mr-1" /> {card.character}
                    </div>
                    
                    {card.link && (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        className="w-full text-xs font-bold bg-white/50 hover:bg-white/80 border border-current"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(card.link, '_blank');
                        }}
                      >
                        Lire plus <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal Détails */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              layoutId={`card-${selectedCard.id}`}
              className={`
                bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto
                rounded-3xl shadow-2xl border-8 ${selectedCard.borderColor}
                relative flex flex-col
              `}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`p-8 ${selectedCard.color} bg-opacity-20 border-b-4 ${selectedCard.borderColor}`}>
                <button 
                  onClick={() => setSelectedCard(null)}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-md z-10"
                >
                  <X className="w-6 h-6 text-gray-800" />
                </button>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 bg-white rounded-2xl shadow-lg ${selectedCard.color}`}>
                    {React.createElement(selectedCard.icon, { className: "w-8 h-8" })}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-gray-800">
                      {selectedCard.title}
                    </h2>
                    <p className="text-sm font-bold opacity-70 uppercase">{selectedCard.character}</p>
                  </div>
                </div>
                <p className="text-lg font-medium opacity-90">{selectedCard.details.intro}</p>
              </div>

              <div className="p-8 bg-white">
                <div className="grid gap-6">
                  {selectedCard.details.points.map((point, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex gap-4 items-start p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                    >
                      <div className={`mt-1 min-w-[24px] h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${selectedCard.color.replace('text-', 'bg-').replace('bg-', 'text-white ')}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{point.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{point.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-center gap-4">
                   {selectedCard.link && (
                      <Button 
                        onClick={() => window.open(selectedCard.link, '_blank')}
                        className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-8 py-6 text-lg font-bold shadow-lg"
                      >
                        Site Officiel <ExternalLink className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                  <Button 
                    onClick={() => setSelectedCard(null)}
                    variant="outline"
                    className="border-2 border-gray-900 text-gray-900 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-bold"
                  >
                    Retour au Village <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default VillageMap;
export { villageData };
