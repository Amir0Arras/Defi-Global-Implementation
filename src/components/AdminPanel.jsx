
import React, { useState, useEffect } from 'react';
import { Shield, Lock, UserCheck, Trash2, Star, Check, X, Eye, MessageCircle, AlertTriangle, Globe, Mail, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/customSupabaseClient';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CandidateDetailView from './admin/CandidateDetailView';

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Data States
  const [candidatures, setCandidatures] = useState([]);
  const [members, setMembers] = useState([]);
  const [avis, setAvis] = useState([]);
  const [discussions, setDiscussions] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null); 

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    setIsLoading(true);
    const { data: cData } = await supabase.from('candidatures').select('*').order('created_at', { ascending: false });
    if (cData) setCandidatures(cData);
    
    const { data: mData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (mData) setMembers(mData);

    const { data: aData } = await supabase.from('avis').select('*').order('created_at', { ascending: false });
    if (aData) setAvis(aData);
    
    const { data: dData } = await supabase.from('discussions').select('*').order('created_at', { ascending: false });
    if (dData) setDiscussions(dData);

    const { data: msgData } = await supabase.from('messages_prives').select('*').order('created_at', { ascending: false });
    if (msgData) setMessages(msgData);

    setIsLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === 'admin') {
      setIsAuthenticated(true);
      toast({ title: "Accès autorisé", description: "Bienvenue au Conseil des Druides." });
    } else {
      toast({ title: "Accès refusé", variant: "destructive" });
    }
  };

  const updateStatus = async (table, id, newStatus) => {
    try {
      await supabase.from(table).update({ status: newStatus }).eq('id', id);
      toast({ title: "Statut mis à jour", description: `Élément passé en ${newStatus}` });
      loadData();
    } catch (e) {
      toast({ title: "Erreur", variant: "destructive" });
    }
  };

  const deleteItem = async (table, id) => {
    if(!window.confirm("Supprimer définitivement ?")) return;
    await supabase.from(table).delete().eq('id', id);
    loadData();
  };

  return (
    <div className="py-8 text-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-2 border-stone-300 text-stone-500 hover:bg-stone-100 rounded-full px-6 py-4 text-sm font-bold opacity-60 hover:opacity-100 transition-all">
            <Lock className="w-4 h-4 mr-2" /> Accès Conseil (Admin)
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-stone-50">
          {!isAuthenticated ? (
            <div className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto text-stone-400 mb-4" />
              <form onSubmit={handleLogin} className="max-w-xs mx-auto space-y-4">
                <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 rounded-lg border" />
                <Button type="submit" className="w-full">Entrer</Button>
              </form>
            </div>
          ) : (
            <div className="p-4">
              <DialogHeader className="mb-6 flex flex-row items-center justify-between">
                <DialogTitle className="text-2xl font-black text-stone-800 flex items-center gap-2">
                  <Shield className="text-purple-600" /> Administration NIRD
                </DialogTitle>
                <Button variant="ghost" size="sm" onClick={loadData} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </DialogHeader>

              <Tabs defaultValue="discussions" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-8 text-xs md:text-sm">
                  <TabsTrigger value="candidatures">Recrutement</TabsTrigger>
                  <TabsTrigger value="members">Membres</TabsTrigger>
                  <TabsTrigger value="avis">Avis ({avis.filter(x=>x.status!=='approved').length})</TabsTrigger>
                  <TabsTrigger value="discussions">Agora ({discussions.filter(x=>x.status!=='approved').length})</TabsTrigger>
                  <TabsTrigger value="messages">Messages ({messages.filter(x=>x.status!=='approved').length})</TabsTrigger>
                </TabsList>

                {/* --- AGORA MODERATION --- */}
                <TabsContent value="discussions">
                  <div className="space-y-4">
                    {discussions.length === 0 && <p className="text-gray-400 italic">Aucune discussion.</p>}
                    {discussions.map(d => (
                      <div key={d.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex flex-col md:flex-row gap-4 ${d.status === 'pending' ? 'border-yellow-400' : d.status === 'approved' ? 'border-green-500' : 'border-red-500 opacity-80'}`}>
                        <div className="flex-grow text-left">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-bold text-lg">{d.titre} <span className="text-sm font-normal text-gray-500">par {d.auteur}</span></h4>
                            <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${d.status==='approved'?'bg-green-100 text-green-800': d.status==='rejected'?'bg-red-100 text-red-800':'bg-yellow-100 text-yellow-800'}`}>{d.status}</span>
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded mb-2 whitespace-pre-wrap">{d.contenu}</p>
                          {d.ai_feedback && <p className="text-xs font-medium text-blue-600 flex items-center"><AlertTriangle className="w-3 h-3 mr-1"/> Analyse IA: {d.ai_feedback}</p>}
                        </div>
                        <div className="flex gap-2 items-center md:flex-col justify-center min-w-[100px]">
                          {d.status !== 'approved' && (
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 w-full" onClick={() => updateStatus('discussions', d.id, 'approved')}>
                              <Check className="w-4 h-4 mr-1"/> Valider
                            </Button>
                          )}
                          {d.status !== 'rejected' && (
                            <Button size="sm" variant="destructive" className="w-full" onClick={() => updateStatus('discussions', d.id, 'rejected')}>
                              <X className="w-4 h-4 mr-1"/> Rejeter
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-600 w-full" onClick={() => deleteItem('discussions', d.id)}>
                            <Trash2 className="w-4 h-4 mr-1"/> Supprimer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* --- MESSAGES PRIVÉS --- */}
                <TabsContent value="messages">
                  <div className="space-y-4">
                    {messages.map(m => (
                      <div key={m.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm text-left ${m.status === 'rejected' ? 'border-red-500 opacity-75' : 'border-blue-500'}`}>
                         <div className="flex justify-between items-center mb-2">
                           <div>
                             <span className="font-bold text-blue-800">{m.sender_email}</span>
                             <span className="text-xs text-gray-400 ml-2">{new Date(m.created_at).toLocaleString()}</span>
                           </div>
                           <div className="flex gap-2">
                              {m.status !== 'rejected' && <Button size="sm" variant="outline" onClick={() => updateStatus('messages_prives', m.id, 'rejected')} title="Marquer comme spam"><AlertTriangle className="w-4 h-4 text-orange-500"/></Button>}
                              <Button size="sm" variant="ghost" onClick={() => deleteItem('messages_prives', m.id)}><Trash2 className="w-4 h-4 text-red-400"/></Button>
                           </div>
                         </div>
                         <p className="text-gray-700 bg-blue-50 p-3 rounded-lg text-sm">{m.contenu}</p>
                         {m.ai_feedback && <p className="text-xs text-blue-500 mt-2 font-medium">IA: {m.ai_feedback}</p>}
                      </div>
                    ))}
                    {messages.length === 0 && <p className="text-gray-400 italic">Boîte de réception vide.</p>}
                  </div>
                </TabsContent>

                {/* --- AVIS --- */}
                <TabsContent value="avis">
                   <div className="space-y-4">
                    {avis.map(a => (
                      <div key={a.id} className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex gap-4 ${a.status === 'pending' ? 'border-yellow-400' : a.status === 'approved' ? 'border-green-500' : 'border-red-500 opacity-75'}`}>
                        <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden">
                           {a.image_url ? <img src={a.image_url} className="w-full h-full object-cover"/> : <div className="h-full flex items-center justify-center"><Star className="text-gray-300"/></div>}
                        </div>
                        <div className="flex-grow text-left">
                          <h4 className="font-bold">{a.auteur}</h4>
                          <p className="text-sm italic text-gray-600">"{a.contenu}"</p>
                          {a.ai_feedback && <p className="text-xs text-orange-600 mt-1 font-medium">IA: {a.ai_feedback}</p>}
                        </div>
                        <div className="flex flex-col gap-2">
                          {a.status !== 'approved' && <Button size="sm" className="bg-green-600" onClick={() => updateStatus('avis', a.id, 'approved')}><Check className="w-4 h-4"/></Button>}
                          {a.status !== 'rejected' && <Button size="sm" variant="destructive" onClick={() => updateStatus('avis', a.id, 'rejected')}><X className="w-4 h-4"/></Button>}
                        </div>
                      </div>
                    ))}
                   </div>
                </TabsContent>
                
                <TabsContent value="candidatures">
                  <div className="space-y-2">
                    {candidatures.map(c => (
                      <div key={c.id} className="bg-white p-3 rounded border flex justify-between items-center">
                        <span>{c.nom} {c.prenom} ({c.role || 'Candidat'})</span>
                        <Button size="sm" variant="outline" onClick={() => setSelectedCandidate(c)}><Eye className="w-4 h-4"/></Button>
                      </div>
                    ))}
                  </div>
                  {selectedCandidate && (
                    <CandidateDetailView candidate={selectedCandidate} onClose={() => setSelectedCandidate(null)} onApprove={()=>{}} onReject={()=>{}} />
                  )}
                </TabsContent>
                
                <TabsContent value="members">
                  {members.map(m => <div key={m.id} className="bg-white p-2 mb-2 rounded border">{m.nom} {m.prenom}</div>)}
                </TabsContent>

              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
