
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, X, Minimize2, Sparkles, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { villageData } from './MainCards';

// Base de connaissances ENRICHIE ET COMPLÈTE
const knowledgeBase = [
  // --- COÛTS & ÉCONOMIES ---
  { 
    keywords: ['prix', 'coût', 'argent', 'payer', 'cher', 'gratuit', 'budget', 'finances', 'licence'], 
    answer: "💰 **C'est imbattable !** NIRD repose sur des logiciels libres (Open Source) : le coût des licences est de **0€**. Les économies réalisées permettent de financer d'autres projets pédagogiques ou du matériel neuf quand c'est vraiment nécessaire." 
  },
  // --- WINDOWS & SYSTÈMES PROPRIÉTAIRES ---
  { 
    keywords: ['windows', 'microsoft', 'propriétaire', 'gafam', 'antivirus', 'virus', 'bug'], 
    answer: "🏛️ **Le Camp Romain (Windows) a ses défauts :** Coûts élevés, lourdeur qui ralentit les PC, mises à jour forcées, et surtout la télémétrie (aspiration des données). Avec NIRD, fini les antivirus coûteux : le système est immunisé par conception !" 
  },
  // --- OBSOLESCENCE & ÉCOLOGIE ---
  { 
    keywords: ['vieux', 'lent', 'rame', 'jeter', 'poubelle', 'écologie', 'carbone', 'planète', 'environnement', 'reen'], 
    answer: "🌿 **L'écologie est au cœur de NIRD !** Nous luttons contre l'obsolescence programmée. NIRD tourne parfaitement sur des ordinateurs de 10 ans. Résultat : **-60% d'empreinte carbone** en prolongeant la durée de vie du matériel. C'est conforme à la **loi REEN** de 2021 sur la sobriété numérique." 
  },
  // --- LINUX & TECHNIQUE ---
  { 
    keywords: ['linux', 'ubuntu', 'debian', 'système', 'os', 'compliqué', 'difficile'], 
    answer: "🐧 **NIRD est basé sur Linux (Debian/Ubuntu).** C'est le système qui fait tourner internet ! Pour l'utilisateur, c'est transparent : une interface simple (Primtux ou autre) adaptée aux élèves du CP au CM2. C'est stable, robuste et ça ne plante pas." 
  },
  // --- SOUVERAINETÉ & DONNÉES ---
  { 
    keywords: ['données', 'rgpd', 'privée', 'espion', 'google', 'souveraineté', 'français', 'education nationale'], 
    answer: "🛡️ **Vos données restent au village !** Contrairement aux GAFAM, NIRD ne collecte aucune donnée personnelle sur les élèves. C'est la garantie d'une souveraineté numérique réelle et du respect strict du RGPD." 
  },
  // --- LOIS & RÉFÉRENCES ---
  { 
    keywords: ['loi', 'officiel', 'ministère', 'code', 'droit', 'légal'], 
    answer: "📜 **C'est écrit dans le marbre !** L'Article L131-2 du Code de l'Éducation donne la priorité au logiciel libre. La loi REEN oblige les collectivités à favoriser le réemploi. NIRD est la réponse parfaite à ces obligations légales." 
  },
  // --- DÉMARCHES & INSTALLATION ---
  { 
    keywords: ['comment', 'installer', 'démarche', 'commencer', 'audit', 'étape'], 
    answer: "🗺️ **La voie est tracée :** 1) Audit du parc actuel (souvent réutilisable). 2) Délibération en conseil d'école/mairie. 3) Installation automatisée (rapide !). 4) Formation des enseignants. 5) Support via la communauté." 
  },
  // --- INCLUSION & MAISON ---
  { 
    keywords: ['maison', 'élève', 'famille', 'clef', 'usb', 'fracture', 'inégalité'], 
    answer: "🏠 **L'école partout !** Grâce à la **clé USB NIRD**, l'élève emporte son environnement de travail à la maison. Il retrouve ses logiciels et ses fichiers même sur l'ordinateur familial, sans rien installer. C'est ça, l'inclusion numérique." 
  },
  // --- PÉDAGOGIE ---
  { 
    keywords: ['apprendre', 'coder', 'programme', 'crcn', 'pix', 'compétence'], 
    answer: "🎓 **Former des citoyens, pas des consommateurs.** NIRD permet de valider les compétences du CRCN (Cadre de Référence des Compétences Numériques). Les élèves apprennent à *comprendre* l'outil, à coder, et à créer librement." 
  },
  // --- CONTACT ---
  { 
    keywords: ['contact', 'aide', 'support', 'tchap', 'téléphone', 'mail'], 
    answer: "📞 **Besoin d'aide ?** Cliquez sur le bouton 'Contactez-nous sur Tchap' en bas de page ou utilisez le formulaire dans la section Forum pour envoyer un message direct à l'entreprise !" 
  },
  // --- SALUTATIONS ---
  { 
    keywords: ['bonjour', 'salut', 'hello', 'coucou', 'druide'], 
    answer: "Salutations, noble visiteur ! 👋 Je suis le Druide NIRD. Je connais tous les secrets de notre solution libre. Pose-moi une question sur l'écologie, les coûts ou Windows !" 
  }
];

const NirdAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Par Bélénos ! Je suis le Druide Virtuel 🧙‍♂️. Je connais tout sur NIRD : Loi REEN, économies, Linux, écologie... Pose-moi une question !" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const findAnswer = (question) => {
    const lowerQ = question.toLowerCase();
    
    // 1. Recherche prioritaire dans la base de connaissances enrichie
    for (const entry of knowledgeBase) {
      // On vérifie si TOUS les mots d'un groupe de mots-clés sont présents (logique un peu plus stricte)
      // Ou si AU MOINS un mot clé fort est présent
      if (entry.keywords.some(keyword => lowerQ.includes(keyword))) {
        return entry.answer;
      }
    }

    // 2. Recherche secondaire dans les données du village (titres/descriptions)
    for (const card of villageData) {
      if (lowerQ.includes(card.title.toLowerCase()) || lowerQ.includes(card.character.toLowerCase())) {
        return `💡 À propos de **${card.title}** : ${card.details.intro} (Voir la carte dans le village pour plus de détails !)`;
      }
    }

    return "Par Toutatis ! Je sèche sur cette question... 🤔 Essaie de me demander des choses sur les **coûts**, l'**écologie**, **Windows** ou les **lois** !";
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const userMsg = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const question = inputValue;
    setInputValue('');
    
    // Simulation de réflexion
    setTimeout(() => {
      const answer = findAnswer(question);
      setMessages(prev => [...prev, { type: 'bot', text: answer }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-white w-80 md:w-96 h-[600px] rounded-3xl shadow-2xl border-4 border-blue-500 overflow-hidden flex flex-col mb-4 relative"
          >
            {/* Header Coloré NIRD */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Le Druide Savant</h3>
                  <p className="text-xs opacity-80 text-blue-100 mt-1">Expert NIRD & Linux</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition-colors">
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-stone-50 p-4 overflow-y-auto custom-scrollbar space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`
                      max-w-[85%] p-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed whitespace-pre-line
                      ${msg.type === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-none' 
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}
                    `}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question..."
                className="flex-1 bg-stone-100 border border-stone-200 text-gray-800 rounded-full px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              />
              <Button 
                type="submit" 
                size="icon" 
                className="rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 w-12 h-12 flex-shrink-0 shadow-lg transition-transform hover:scale-105 active:scale-95"
                disabled={!inputValue.trim()}
              >
                <Send className="w-5 h-5 text-white" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-colors border-[3px] border-white z-50
          ${isOpen ? 'bg-red-500 hover:bg-red-600 rotate-90' : 'bg-gradient-to-tr from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'}
        `}
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <>
            <MessageCircle className="w-8 h-8 absolute" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default NirdAssistant;
