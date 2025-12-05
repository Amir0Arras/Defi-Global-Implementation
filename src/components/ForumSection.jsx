
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Trash2, Mail, Lock, Globe, CornerDownRight, Loader2, ShieldCheck, AlertTriangle, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';

const ForumSection = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- PUBLIC FORM ---
  const [publicName, setPublicName] = useState('');
  const [publicEmail, setPublicEmail] = useState('');
  const [publicTitle, setPublicTitle] = useState('');
  const [publicMessage, setPublicMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- REPLIES ---
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [repliesMap, setRepliesMap] = useState({}); // { discussionId: [replies] }

  // --- PRIVATE FORM ---
  const [contactName, setContactName] = useState(''); // Used as sender info usually
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [isSendingPrivate, setIsSendingPrivate] = useState(false);

  useEffect(() => {
    if (activeTab === 'public') {
      fetchDiscussions();
      fetchReplies();
    }
  }, [activeTab]);

  const fetchDiscussions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('discussions')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false });
    
    if (!error) setDiscussions(data || []);
    setLoading(false);
  };

  const fetchReplies = async () => {
    const { data } = await supabase.from('discussion_replies').select('*').order('created_at', { ascending: true });
    if (data) {
      const grouped = {};
      data.forEach(r => {
        if (!grouped[r.discussion_id]) grouped[r.discussion_id] = [];
        grouped[r.discussion_id].push(r);
      });
      setRepliesMap(grouped);
    }
  };

  const handlePublicSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('moderate-review', {
        body: {
          type: 'discussion',
          auteur: publicName,
          email: publicEmail,
          titre: publicTitle,
          contenu: publicMessage
        }
      });

      if (error) throw error;

      if (result.status === 'approved') {
        toast({ 
          title: "Discussion publiée !", 
          description: "L'IA a validé votre sujet.", 
          className: "bg-green-100 border-green-500 text-green-800" 
        });
        fetchDiscussions();
        // Clear form ONLY if approved
        setPublicName(''); setPublicEmail(''); setPublicTitle(''); setPublicMessage('');
      } else if (result.status === 'rejected') {
        toast({ 
          title: "Sujet refusé par l'IA", 
          description: result.ai_feedback || "Contenu non conforme ou hors sujet.", 
          variant: "destructive",
          duration: 6000
        });
      } else {
        toast({ 
          title: "En attente de modération", 
          description: "L'IA a un doute. Un administrateur va relire.", 
          className: "bg-yellow-100 border-yellow-500 text-yellow-800" 
        });
        setPublicName(''); setPublicEmail(''); setPublicTitle(''); setPublicMessage('');
      }
      
    } catch (err) {
      console.error(err);
      toast({ title: "Erreur technique", description: "Réessayez plus tard.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplySubmit = async (discussionId) => {
    if (!replyName || !replyMessage) return;
    try {
      const { error } = await supabase.from('discussion_replies').insert({
        discussion_id: discussionId,
        auteur: replyName,
        contenu: replyMessage
      });
      
      if (error) throw error;
      
      toast({ title: "Réponse ajoutée !" });
      setReplyingTo(null);
      setReplyName(''); setReplyMessage('');
      fetchReplies(); // Refresh replies
    } catch (err) {
      toast({ title: "Erreur lors de la réponse", variant: "destructive" });
    }
  };

  const handlePrivateSubmit = async (e) => {
    e.preventDefault();
    setIsSendingPrivate(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('moderate-review', {
        body: {
          type: 'message',
          auteur: contactName, // Used for prompt context
          email: contactEmail,
          contenu: contactMessage
        }
      });

      if (error) throw error;

      if (result.status === 'approved') {
        toast({ 
          title: "Message envoyé !", 
          description: "L'équipe NIRD vous répondra bientôt.", 
          className: "bg-blue-100 border-blue-500 text-blue-800" 
        });
        setContactName(''); setContactEmail(''); setContactMessage('');
      } else {
        toast({ 
          title: "Message bloqué", 
          description: result.ai_feedback || "Contenu jugé inapproprié par l'IA.", 
          variant: "destructive" 
        });
      }
    } catch (err) {
      toast({ title: "Erreur envoi", variant: "destructive" });
    } finally {
      setIsSendingPrivate(false);
    }
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <MessageSquare className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <h2 className="text-4xl font-black text-gray-800 mb-4">L'Agora du Village</h2>
          <p className="text-xl text-gray-600 font-bold">Discussions publiques & Messages privés, modérés par nos Druides IA</p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('public')}
            className={`flex items-center px-6 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'public' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-orange-100'}`}
          >
            <Globe className="w-5 h-5 mr-2" /> Agora (Discussions)
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex items-center px-6 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'contact' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
          >
            <Mail className="w-5 h-5 mr-2" /> Message Privé (Membres)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Zone Formulaire */}
          <motion.div 
            layout
            className={`lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl border-4 ${activeTab === 'public' ? 'border-orange-200' : 'border-blue-200'}`}
          >
            {activeTab === 'public' ? (
              <form onSubmit={handlePublicSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-orange-600 flex items-center mb-4"><Globe className="mr-2" /> Lancer un sujet</h3>
                <div className="bg-orange-50 p-3 rounded-lg text-xs text-orange-700 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>L'IA rejette les sujets hors-contexte (vente, spam, etc). Restez sur les thèmes : Tech, École, RSE, Linux.</p>
                </div>
                <input required value={publicName} onChange={e => setPublicName(e.target.value)} placeholder="Votre Nom" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none" />
                <input required type="email" value={publicEmail} onChange={e => setPublicEmail(e.target.value)} placeholder="Votre Email (privé)" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none" />
                <input required value={publicTitle} onChange={e => setPublicTitle(e.target.value)} placeholder="Titre du sujet" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none font-bold" />
                <textarea required value={publicMessage} onChange={e => setPublicMessage(e.target.value)} placeholder="De quoi voulez-vous parler ?" rows="4" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-orange-400 outline-none" />
                <Button disabled={isSubmitting} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-6 rounded-xl">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : "Publier sur l'Agora"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handlePrivateSubmit} className="space-y-4">
                <h3 className="text-xl font-bold text-blue-600 flex items-center mb-4"><Lock className="mr-2" /> Message Privé</h3>
                <p className="text-sm text-gray-500 mb-2">Envoyez un message sécurisé aux membres de l'équipe NIRD.</p>
                <input required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Votre Nom" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-400 outline-none" />
                <input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Votre Email" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-400 outline-none" />
                <textarea required value={contactMessage} onChange={e => setContactMessage(e.target.value)} placeholder="Votre message confidentiel..." rows="4" className="w-full p-3 rounded-xl border-2 border-gray-100 focus:border-blue-400 outline-none" />
                <Button disabled={isSendingPrivate} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 rounded-xl">
                  {isSendingPrivate ? <Loader2 className="animate-spin" /> : "Envoyer Secrètement"}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Zone Liste (Seulement pour Public) */}
          {activeTab === 'public' && (
            <div className="lg:col-span-8 space-y-6">
              {loading ? (
                <div className="text-center py-12"><Loader2 className="w-10 h-10 animate-spin text-orange-300 mx-auto" /></div>
              ) : discussions.length === 0 ? (
                <div className="bg-orange-50 border-2 border-dashed border-orange-200 p-10 rounded-3xl text-center text-orange-400">Aucune discussion active. Lancez le premier sujet !</div>
              ) : (
                discussions.map((disc) => (
                  <motion.div key={disc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="text-xl font-black text-gray-800">{disc.titre}</h4>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Validé IA</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <User className="w-4 h-4" /> <span>{disc.auteur}</span> • <span>{new Date(disc.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">{disc.contenu}</p>
                    
                    {/* Réponses */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                      {repliesMap[disc.id]?.map(rep => (
                        <div key={rep.id} className="flex gap-3 text-sm">
                          <div className="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-orange-700 font-bold text-xs shrink-0">{rep.auteur[0]}</div>
                          <div>
                            <span className="font-bold text-gray-900">{rep.auteur}</span>
                            <p className="text-gray-600">{rep.contenu}</p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Formulaire Réponse */}
                      <div className="pt-2 flex flex-col gap-2">
                        {replyingTo === disc.id ? (
                          <div className="animate-in fade-in slide-in-from-top-2">
                            <input value={replyName} onChange={e => setReplyName(e.target.value)} placeholder="Votre nom" className="w-full p-2 rounded-lg border border-gray-200 text-sm mb-2" />
                            <div className="flex gap-2">
                              <input value={replyMessage} onChange={e => setReplyMessage(e.target.value)} placeholder="Votre réponse..." className="w-full p-2 rounded-lg border border-gray-200 text-sm" />
                              <Button size="sm" onClick={() => handleReplySubmit(disc.id)} className="bg-orange-500 hover:bg-orange-600"><Send className="w-4 h-4" /></Button>
                              <Button size="sm" variant="ghost" onClick={() => setReplyingTo(null)}><X className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setReplyingTo(disc.id)} className="text-orange-500 text-sm font-bold hover:underline flex items-center gap-1">
                            <CornerDownRight className="w-4 h-4" /> Répondre
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
          
          {activeTab === 'contact' && (
            <div className="lg:col-span-8 bg-blue-50 border border-blue-100 p-10 rounded-3xl text-center">
               <Lock className="w-16 h-16 text-blue-300 mx-auto mb-4" />
               <h3 className="text-2xl font-bold text-blue-900 mb-2">Canal Sécurisé</h3>
               <p className="text-blue-700 max-w-md mx-auto">Les messages envoyés via ce formulaire sont cryptés et stockés en base de données sécurisée, accessibles uniquement par les administrateurs certifiés NIRD.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ForumSection;
