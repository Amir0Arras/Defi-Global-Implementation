import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Briefcase, Heart, Globe, Award, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const TeamSection = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [consent, setConsent] = useState(false); // RGPD

  const [formData, setFormData] = useState({
    nom: '', prenom: '', role: '', email: '',
    competences: '', passions: '', langues: '', projets: '', cv: '', photo: null
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setProfiles(data || []);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      toast({ title: "Erreur", description: "Impossible de charger les profils.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500000) {
        toast({ title: "Image trop lourde", description: "Max 500ko svp pour l'écologie numérique !", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, photo: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitCandidature = async (e) => {
    e.preventDefault();
    
    if (!consent) {
      toast({ title: "Consentement requis", description: "Veuillez accepter la politique de confidentialité.", variant: "destructive" });
      return;
    }

    const newCandidature = {
      nom: formData.nom,
      prenom: formData.prenom,
      email: formData.email,
      competences: formData.competences.split(',').map(s => s.trim()).filter(s => s),
      passions: formData.passions.split(',').map(s => s.trim()).filter(s => s),
      langues: formData.langues.split(',').map(s => s.trim()).filter(s => s),
      projets: formData.projets.split(',').map(s => s.trim()).filter(s => s),
      cv_url: formData.cv,
      photo_url: formData.photo,
      status: 'pending'
    };

    try {
      const { error } = await supabase.from('candidatures').insert([newCandidature]);
      if (error) throw error;

      setIsModalOpen(false);
      setFormData({ nom: '', prenom: '', role: '', email: '', competences: '', passions: '', langues: '', projets: '', cv: '', photo: null });
      setConsent(false);
      
      toast({
        title: "Candidature envoyée !",
        description: "Le Conseil des Druides va étudier votre profil.",
        className: "bg-green-100 border-green-500 text-green-800"
      });
    } catch (error) {
      console.error('Error submitting:', error);
      toast({ title: "Erreur", description: "Impossible d'envoyer la candidature.", variant: "destructive" });
    }
  };

  const filteredProfiles = profiles.filter(profile => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (profile.nom?.toLowerCase() || '').includes(searchLower) || 
      (profile.prenom?.toLowerCase() || '').includes(searchLower) ||
      (profile.role?.toLowerCase() || '').includes(searchLower) ||
      (profile.competences || []).some(c => c.toLowerCase().includes(searchLower));

    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'tech') return matchesSearch && (profile.role.toLowerCase().includes('dev') || profile.role.toLowerCase().includes('tech') || profile.role.toLowerCase().includes('cto'));
    if (selectedFilter === 'pédago') return matchesSearch && (profile.role.toLowerCase().includes('prof') || profile.role.toLowerCase().includes('formateur') || profile.role.toLowerCase().includes('pédago'));
    if (selectedFilter === 'design') return matchesSearch && (profile.role.toLowerCase().includes('design') || profile.role.toLowerCase().includes('graphiste'));
    
    return matchesSearch; 
  });

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden" id="equipe">
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-blue-900 mb-4 tracking-tight">
            Les Irréductibles (Notre Équipe)
          </h2>
          {/* Contraste amélioré: text-blue-700 -> text-blue-800 */}
          <p className="text-xl text-blue-800 font-bold max-w-2xl mx-auto">
            Découvrez les talents qui forgent le village NIRD. Des passionnés du libre au service de l'école.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-blue-100 mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            <input 
              type="text" 
              placeholder="Rechercher un druide..." 
              aria-label="Rechercher un membre de l'équipe"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-gray-50 font-medium"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0" role="tablist">
            {['Tous', 'Tech', 'Pédago', 'Design'].map((filter) => (
              <button 
                key={filter}
                role="tab"
                aria-selected={selectedFilter === (filter === 'Tous' ? 'all' : filter.toLowerCase())}
                onClick={() => setSelectedFilter(filter === 'Tous' ? 'all' : filter.toLowerCase())}
                className={`px-4 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  (selectedFilter === 'all' && filter === 'Tous') || selectedFilter === filter.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl px-6 py-6 shadow-lg transform hover:scale-105 transition-all"
            aria-label="Ouvrir le formulaire de candidature"
          >
            <Plus className="w-5 h-5 mr-2" /> Ajouter mon profil
          </Button>
        </div>

        {isLoading ? (
           <div className="text-center py-20 text-gray-500 animate-pulse" role="status">Chargement des irréductibles...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredProfiles.map((profile) => (
                <motion.article
                  key={profile.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-3xl shadow-xl border-4 border-white overflow-hidden relative group focus-within:ring-4 focus-within:ring-blue-400"
                  tabIndex="0"
                >
                  <div className="h-24 bg-gradient-to-r from-blue-400 to-purple-500"></div>
                  <div className="px-6 pb-6">
                    <div className="relative -mt-12 mb-4 flex justify-between items-end">
                      <div className="relative">
                        {/* Image avec attribut loading lazy pour la performance */}
                        <img 
                          src={profile.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.nom}`} 
                          alt={`Photo de ${profile.prenom} ${profile.nom}`}
                          loading="lazy"
                          className="w-24 h-24 rounded-2xl border-4 border-white shadow-md bg-white object-cover"
                        />
                        {profile.verified_badge && (
                          <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-white p-1 rounded-full border-2 border-white shadow-sm" title="Profil Vérifié">
                            <Award className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider line-clamp-1 max-w-[120px]">
                        {profile.role}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-gray-800 mb-1">
                      {profile.prenom} {profile.nom}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium mb-4 flex items-center">
                      <Globe className="w-3 h-3 mr-1" aria-hidden="true" /> {(profile.langues || []).join(', ')}
                    </p>

                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center"><Briefcase className="w-3 h-3 mr-1" aria-hidden="true"/> Compétences</p>
                        <div className="flex flex-wrap gap-1">
                          {(profile.competences || []).slice(0, 4).map((c, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-bold">{c}</span>
                          ))}
                          {(profile.competences || []).length > 4 && <span className="px-2 py-1 text-xs text-gray-500">+{profile.competences.length - 4}</span>}
                        </div>
                      </div>
                      
                      {profile.projets && profile.projets.length > 0 && (
                        <div>
                           <p className="text-xs font-bold text-gray-500 uppercase mb-1 flex items-center"><Heart className="w-3 h-3 mr-1" aria-hidden="true"/> Projets Phares</p>
                           <p className="text-sm font-medium text-gray-700 italic line-clamp-2">"{profile.projets.join(', ')}"</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal Candidature Optimisée */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
            >
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Fermer le formulaire"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="p-8">
                <h3 id="modal-title" className="text-3xl font-black text-blue-900 mb-2">Rejoindre le Village</h3>
                <p className="text-gray-600 mb-8 font-medium">Remplissez ce parchemin pour proposer votre candidature.</p>
                
                <form onSubmit={handleSubmitCandidature} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="prenom" className="block text-sm font-bold text-gray-700 mb-1">Prénom</label>
                      <input id="prenom" required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.prenom} onChange={e => setFormData({...formData, prenom: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="nom" className="block text-sm font-bold text-gray-700 mb-1">Nom</label>
                      <input id="nom" required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.nom} onChange={e => setFormData({...formData, nom: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                      <input id="email" required type="email" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-1">Rôle visé</label>
                      <input id="role" required type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="competences" className="block text-sm font-bold text-gray-700 mb-1">Compétences</label>
                    <input id="competences" type="text" placeholder="Linux, React..." className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.competences} onChange={e => setFormData({...formData, competences: e.target.value})} />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Photo de profil (Optionnel)</label>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-3 rounded-xl font-bold transition-colors border-2 border-blue-200 focus-within:ring-2 focus-within:ring-blue-500">
                        <Upload className="w-5 h-5" /> Choisir une image
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                      </label>
                      {formData.photo && <img src={formData.photo} alt="Aperçu" className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" />}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="passions" className="block text-sm font-bold text-gray-700 mb-1">Passions</label>
                      <input id="passions" type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.passions} onChange={e => setFormData({...formData, passions: e.target.value})} />
                    </div>
                    <div>
                      <label htmlFor="langues" className="block text-sm font-bold text-gray-700 mb-1">Langues</label>
                      <input id="langues" type="text" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none" value={formData.langues} onChange={e => setFormData({...formData, langues: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projets" className="block text-sm font-bold text-gray-700 mb-1">Vos Projets / Lien CV</label>
                    <textarea id="projets" className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none min-h-[100px]" value={formData.projets} onChange={e => setFormData({...formData, projets: e.target.value})} />
                  </div>

                  {/* Consentement RGPD */}
                  <div className="flex items-start space-x-3 bg-blue-50 p-4 rounded-xl">
                    <input 
                      type="checkbox" 
                      id="consent" 
                      checked={consent} 
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="consent" className="text-sm text-gray-700 cursor-pointer">
                      Je consens à ce que mes données soient traitées dans le cadre de ma candidature. Je comprends qu'elles seront conservées de manière sécurisée et que je peux demander leur suppression à tout moment.
                    </label>
                  </div>

                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl text-lg shadow-md">
                    Envoyer ma candidature
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default TeamSection;