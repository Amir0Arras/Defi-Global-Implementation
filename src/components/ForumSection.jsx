
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, User, Trash2, Mail, Lock, Globe, Image as ImageIcon, CornerDownRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';

const ForumSection = () => {
  const [activeTab, setActiveTab] = useState('public');
  const [posts, setPosts] = useState([]);
  
  // --- STATE FORMULAIRE PUBLIC ---
  const [publicName, setPublicName] = useState('');
  const [publicMessage, setPublicMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // --- STATE RÉPONSES ---
  const [replyingTo, setReplyingTo] = useState(null); // ID du post auquel on répond
  const [replyName, setReplyName] = useState('');
  const [replyMessage, setReplyMessage] = useState('');

  // --- STATE FORMULAIRE CONTACT ---
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  // Charger les messages
  useEffect(() => {
    const savedPosts = localStorage.getItem('nird_forum_posts_v2');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Erreur lecture forum", e);
      }
    } else {
      setPosts([
        { 
          id: 1, 
          name: "Bonemine", 
          message: "Le site est très clair, bravo pour l'initiative !", 
          date: new Date().toISOString(),
          image: null,
          replies: []
        },
        { 
          id: 2, 
          name: "Assurancetourix", 
          message: "Je peux composer une chanson sur Linux ? 🎵", 
          date: new Date(Date.now() - 86400000).toISOString(),
          image: null,
          replies: [
             { id: 21, name: "Cétautomatix", message: "NON ! Pas de chanson !", date: new Date().toISOString() }
          ]
        }
      ]);
    }
  }, []);

  // --- GESTION IMAGE (Base64) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 300000) { // Limite ~300KB pour localStorage
        toast({
          title: "Image trop lourde",
          description: "Le village n'accepte que les petites gravures (< 300ko).",
          variant: "destructive"
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- SOUMISSION MESSAGE PRINCIPAL ---
  const handlePublicSubmit = (e) => {
    e.preventDefault();
    if (!publicName.trim() || !publicMessage.trim()) return;

    const newPost = {
      id: Date.now(),
      name: publicName.trim(),
      message: publicMessage.trim(),
      date: new Date().toISOString(),
      image: selectedImage,
      replies: []
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    
    setPublicName('');
    setPublicMessage('');
    setSelectedImage(null);
    
    toast({
      title: "Avis publié !",
      description: "Votre message est visible sur l'Agora.",
      className: "bg-yellow-100 border-yellow-400 text-yellow-800"
    });
  };

  // --- SOUMISSION RÉPONSE ---
  const handleReplySubmit = (parentId) => {
    if (!replyName.trim() || !replyMessage.trim()) return;

    const newReply = {
      id: Date.now(),
      name: replyName.trim(),
      message: replyMessage.trim(),
      date: new Date().toISOString()
    };

    const updatedPosts = posts.map(post => {
      if (post.id === parentId) {
        return { ...post, replies: [...(post.replies || []), newReply] };
      }
      return post;
    });

    savePosts(updatedPosts);
    setReplyingTo(null);
    setReplyName('');
    setReplyMessage('');
    toast({ title: "Réponse envoyée !" });
  };

  const savePosts = (newPosts) => {
    setPosts(newPosts);
    localStorage.setItem('nird_forum_posts_v2', JSON.stringify(newPosts));
  };

  const handleDelete = (id) => {
    const updatedPosts = posts.filter(post => post.id !== id);
    savePosts(updatedPosts);
    toast({ title: "Message supprimé", variant: "destructive" });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;
    setTimeout(() => {
       toast({
        title: "Message envoyé !",
        description: `Merci ${contactName}, l'équipe NIRD vous répondra à ${contactEmail} !`,
        className: "bg-blue-100 border-blue-400 text-blue-800"
      });
      setContactName(''); setContactEmail(''); setContactMessage('');
    }, 800);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-yellow-50 to-orange-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <MessageSquare className="w-16 h-16 mx-auto text-orange-500 mb-4" />
          <h2 className="text-4xl font-black text-gray-800 mb-4">L'Agora du Village</h2>
          <p className="text-xl text-gray-600 font-bold">Discutez, partagez des images, répondez aux amis !</p>
        </div>

        {/* Onglets */}
        <div className="flex justify-center gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('public')}
            className={`flex items-center px-6 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'public' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-orange-100'}`}
          >
            <Globe className="w-5 h-5 mr-2" /> Discussion Publique
          </button>
          <button 
            onClick={() => setActiveTab('contact')}
            className={`flex items-center px-6 py-3 rounded-full font-bold text-lg transition-all ${activeTab === 'contact' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
          >
            <Mail className="w-5 h-5 mr-2" /> Message Privé (Entreprise)
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Zone Formulaire (Gauche) - Prend 4 colonnes sur grand écran */}
          <motion.div 
            key={activeTab}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`
              lg:col-span-4 bg-white p-6 rounded-3xl shadow-xl border-4 
              ${activeTab === 'public' ? 'border-orange-200' : 'border-blue-200'}
            `}
          >
            {activeTab === 'public' ? (
              <>
                <h3 className="text-2xl font-bold mb-6 text-orange-600 flex items-center">
                  <Globe className="mr-2" /> Nouveau Sujet
                </h3>
                <form onSubmit={handlePublicSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Votre Nom</label>
                    <input
                      type="text"
                      value={publicName}
                      onChange={(e) => setPublicName(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium"
                      placeholder="Ex: Astérix"
                      maxLength={30}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Message</label>
                    <textarea
                      value={publicMessage}
                      onChange={(e) => setPublicMessage(e.target.value)}
                      className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-orange-400 focus:outline-none font-medium min-h-[100px]"
                      placeholder="Exprimez-vous..."
                      maxLength={300}
                    />
                  </div>
                  
                  {/* Upload Image */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Ajouter une image</label>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer bg-orange-50 hover:bg-orange-100 text-orange-700 border-2 border-orange-200 rounded-xl px-4 py-2 flex items-center transition-colors">
                        <ImageIcon className="w-5 h-5 mr-2" />
                        <span>Choisir</span>
                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      </label>
                      {selectedImage && (
                        <div className="relative group">
                          <img src={selectedImage} alt="Preview" className="w-10 h-10 rounded-lg object-cover border border-gray-200" />
                          <button 
                            type="button" 
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:scale-110 transition-transform"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl text-lg shadow-md mt-4">
                    <Send className="w-5 h-5 mr-2" /> Publier
                  </Button>
                </form>
              </>
            ) : (
              <>
                {/* Formulaire Contact Privé (Identique précédente version) */}
                <h3 className="text-2xl font-bold mb-6 text-blue-600 flex items-center">
                  <Lock className="mr-2" /> Contacter NIRD
                </h3>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none" placeholder="Nom" required />
                  <input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none" placeholder="Email" required />
                  <textarea value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} className="w-full p-3 rounded-xl border-2 border-gray-200 focus:border-blue-400 outline-none min-h-[100px]" placeholder="Message privé..." required />
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl">Envoyer</Button>
                </form>
              </>
            )}
          </motion.div>

          {/* Zone Fil de Discussion (Droite) - Prend 8 colonnes */}
          <div className={`
            lg:col-span-8 bg-orange-100/50 p-6 rounded-3xl border-4 border-orange-200 h-[700px] overflow-y-auto custom-scrollbar
            ${activeTab === 'contact' ? 'opacity-50 grayscale-[50%] pointer-events-none' : ''} 
          `}>
            <h3 className="text-2xl font-bold mb-6 text-orange-800 sticky top-0 bg-orange-100/95 pb-2 z-10 border-b border-orange-200">
              Le Fil de l'Agora
            </h3>
            
            <div className="space-y-6">
              {posts.length === 0 ? (
                <p className="text-center text-gray-500 italic py-10">Le silence règne... Soyez le premier à parler !</p>
              ) : (
                posts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-5 rounded-2xl shadow-sm border-2 border-orange-100 relative group"
                  >
                    {/* Header Message */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-orange-100 p-2 rounded-full">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-black text-gray-800">{post.name}</p>
                          <p className="text-xs text-gray-400">{new Date(post.date).toLocaleDateString()} à {new Date(post.date).toLocaleTimeString().slice(0,5)}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(post.id)} className="text-gray-300 hover:text-red-500 transition-colors" title="Supprimer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Contenu Message */}
                    <div className="pl-12">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.message}</p>
                      
                      {/* Image Postée */}
                      {post.image && (
                        <div className="mt-3">
                          <img src={post.image} alt="Post attachment" className="max-h-48 rounded-lg border border-gray-200 shadow-sm hover:scale-105 transition-transform cursor-pointer" />
                        </div>
                      )}

                      {/* Bouton Répondre */}
                      <div className="mt-3">
                        <button 
                          onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                          className="text-sm font-bold text-orange-500 hover:text-orange-700 flex items-center gap-1"
                        >
                          <CornerDownRight className="w-4 h-4" /> Répondre
                        </button>
                      </div>

                      {/* Formulaire de Réponse */}
                      <AnimatePresence>
                        {replyingTo === post.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-3 bg-orange-50 p-4 rounded-xl border border-orange-200"
                          >
                            <input 
                              className="w-full mb-2 p-2 rounded-lg border border-orange-200 text-sm"
                              placeholder="Votre nom..."
                              value={replyName}
                              onChange={(e) => setReplyName(e.target.value)}
                            />
                            <textarea 
                              className="w-full mb-2 p-2 rounded-lg border border-orange-200 text-sm"
                              placeholder="Votre réponse..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Annuler</Button>
                              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white" onClick={() => handleReplySubmit(post.id)}>Envoyer</Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Fil de Réponses */}
                    {post.replies && post.replies.length > 0 && (
                      <div className="mt-4 pl-8 ml-4 border-l-2 border-orange-100 space-y-3">
                        {post.replies.map((reply) => (
                          <div key={reply.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-gray-200 w-6 h-6 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-500" />
                              </div>
                              <span className="font-bold text-gray-700">{reply.name}</span>
                              <span className="text-xs text-gray-400">- {new Date(reply.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-gray-600 ml-8">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForumSection;
