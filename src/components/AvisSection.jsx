import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, Upload, Image as ImageIcon, Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const AvisSection = () => {
  const [avisList, setAvisList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({ auteur: '', email: '', contenu: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApprovedAvis();
  }, []);

  const fetchApprovedAvis = async () => {
    try {
      const { data, error } = await supabase
        .from('avis')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setAvisList(data || []);
    } catch (error) {
      console.error('Erreur chargement avis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: "Image trop lourde", description: "Max 2MB svp", variant: "destructive" });
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedImageUrl = null;

      // 1. Upload de l'image si présente
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('avis-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;
        
        const { data: publicData } = supabase.storage
          .from('avis-images')
          .getPublicUrl(fileName);
          
        uploadedImageUrl = publicData.publicUrl;
      }

      // 2. Appel à l'IA de modération via Edge Function
      const { data: result, error: fnError } = await supabase.functions.invoke('moderate-review', {
        body: {
          auteur: formData.auteur,
          email: formData.email,
          contenu: formData.contenu,
          image_url: uploadedImageUrl
        }
      });

      if (fnError) throw fnError;

      // 3. Feedback utilisateur
      if (result.status === 'approved') {
        toast({
          title: "Avis publié instantanément !",
          description: "L'IA NIRD a validé votre message positif.",
          className: "bg-green-100 border-green-500 text-green-800"
        });
        fetchApprovedAvis(); // Rafraîchir la liste
      } else if (result.status === 'rejected') {
        toast({
          title: "Avis rejeté par l'IA",
          description: result.ai_feedback || "Contenu non conforme à la charte NIRD.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Avis en attente",
          description: "L'IA hésite... Un druide va relire votre message.",
          className: "bg-yellow-100 border-yellow-500 text-yellow-800"
        });
      }

      // Reset form
      setFormData({ auteur: '', email: '', contenu: '' });
      setImageFile(null);
      setImagePreview(null);

    } catch (error) {
      console.error('Erreur envoi:', error);
      toast({ title: "Erreur technique", description: "Impossible d'envoyer l'avis.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-blue-900 mb-4">Le Mur des Témoignages</h2>
          <p className="text-xl text-blue-600 font-bold flex items-center justify-center gap-2">
             <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
             Vos avis modérés par notre Intelligence Artificielle
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Formulaire */}
          <div className="lg:col-span-1 bg-stone-50 p-6 rounded-3xl border border-stone-200 shadow-lg h-fit sticky top-24">
            <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-stone-700">
              <Send className="w-5 h-5" /> Laisser un avis
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Votre Nom</label>
                <input 
                  required 
                  type="text" 
                  className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-blue-400 outline-none" 
                  value={formData.auteur}
                  onChange={e => setFormData({...formData, auteur: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Votre Email (privé)</label>
                <input 
                  required 
                  type="email" 
                  className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-blue-400 outline-none" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-stone-600 mb-1">Votre Message</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full p-3 rounded-xl border-2 border-stone-200 focus:border-blue-400 outline-none" 
                  value={formData.contenu}
                  onChange={e => setFormData({...formData, contenu: e.target.value})}
                  placeholder="Qu'avez-vous pensé de l'expérience NIRD ?"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-stone-600 mb-2">Photo (Optionnelle)</label>
                <div className="flex flex-col gap-2">
                  <label className="cursor-pointer bg-white border-2 border-dashed border-stone-300 rounded-xl p-4 flex items-center justify-center hover:bg-stone-100 transition-colors">
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    <div className="flex flex-col items-center text-stone-400">
                      <Upload className="w-6 h-6 mb-1" />
                      <span className="text-xs font-bold">Cliquez pour upload</span>
                    </div>
                  </label>
                  {imagePreview && (
                    <div className="relative rounded-xl overflow-hidden border border-stone-200 h-32">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl text-lg shadow-md"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyse IA en cours...</>
                ) : (
                  "Envoyer mon avis"
                )}
              </Button>
              <p className="text-xs text-center text-stone-400 mt-2">
                Modération automatique par IA activée.
              </p>
            </form>
          </div>

          {/* Liste des Avis */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 text-blue-200 animate-spin" /></div>
            ) : avisList.length === 0 ? (
              <div className="text-center py-20 bg-stone-50 rounded-3xl border-dashed border-2 border-stone-200">
                <p className="text-stone-400 font-medium">Soyez le premier à donner votre avis !</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {avisList.map((avis) => (
                    <motion.div
                      key={avis.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100 hover:shadow-xl transition-shadow flex flex-col"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-lg">
                             {avis.auteur.charAt(0).toUpperCase()}
                           </div>
                           <div>
                             <h4 className="font-bold text-stone-800">{avis.auteur}</h4>
                             <span className="text-xs text-green-600 flex items-center bg-green-50 px-2 py-0.5 rounded-full w-fit">
                               <CheckCircle2 className="w-3 h-3 mr-1" /> Vérifié IA
                             </span>
                           </div>
                        </div>
                        <span className="text-xs text-stone-400">{new Date(avis.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex-grow">
                        <p className="text-stone-600 italic mb-4">"{avis.contenu}"</p>
                        {avis.image_url && (
                          <img 
                            src={avis.image_url} 
                            alt="Illustration avis" 
                            className="w-full h-48 object-cover rounded-xl border border-stone-100 mb-2"
                          />
                        )}
                      </div>

                      {avis.ai_feedback && (
                        <div className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-400 flex items-center">
                           <Star className="w-3 h-3 mr-1 text-yellow-400" /> IA: {avis.ai_feedback}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AvisSection;