import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X, ArrowLeft, Mail, FileText, Heart, Globe, Briefcase, UserCheck } from 'lucide-react';

const CandidateDetailView = ({ candidate, onClose, onApprove, onReject, isProcessing }) => {
  if (!candidate) return null;

  return (
    <div className="animate-in slide-in-from-right duration-300">
      <Button variant="ghost" onClick={onClose} className="mb-4 pl-0 hover:pl-2 transition-all text-stone-600" aria-label="Retour à la liste">
        <ArrowLeft className="w-4 h-4 mr-2" /> Retour à la liste
      </Button>

      <article className="bg-white rounded-2xl shadow-lg overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 relative">
           <div className="absolute -bottom-16 left-8">
             {candidate.photo_url ? (
               <img src={candidate.photo_url} className="w-32 h-32 rounded-2xl border-4 border-white shadow-md object-cover bg-white" alt={`Photo de ${candidate.prenom}`} />
             ) : (
               <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-md bg-stone-100 flex items-center justify-center">
                 <UserCheck className="w-12 h-12 text-stone-300"/>
               </div>
             )}
           </div>
        </div>
        
        <div className="pt-20 px-8 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
            <div>
              <h2 className="text-3xl font-black text-stone-800">{candidate.prenom} {candidate.nom}</h2>
              <p className="text-stone-600 font-medium flex items-center mt-1">
                <Mail className="w-4 h-4 mr-2" aria-hidden="true"/> {candidate.email}
              </p>
              <p className="text-xs text-stone-500 mt-2">Reçue le : {new Date(candidate.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => onApprove(candidate)} disabled={isProcessing} className="bg-green-600 hover:bg-green-700 text-white shadow-lg">
                {isProcessing ? "..." : <><Check className="w-4 h-4 mr-2" /> Accepter</>}
              </Button>
              <Button onClick={() => onReject(candidate)} disabled={isProcessing} variant="destructive" className="shadow-lg">
                 {isProcessing ? "..." : <><X className="w-4 h-4 mr-2" /> Refuser</>}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="space-y-6">
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center"><Briefcase className="w-4 h-4 mr-2"/> Compétences</h3>
                <div className="flex flex-wrap gap-2">
                  {(candidate.competences || []).map((c, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-stone-200 text-stone-700 rounded-lg text-sm font-bold">{c}</span>
                  ))}
                </div>
              </div>

              <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center"><Globe className="w-4 h-4 mr-2"/> Langues</h3>
                <div className="flex flex-wrap gap-2">
                  {(candidate.langues || []).map((l, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">{l}</span>
                  ))}
                </div>
              </div>

               <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
                <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center"><FileText className="w-4 h-4 mr-2"/> CV & Documents</h3>
                {candidate.cv_url ? (
                   <a href={candidate.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                     {candidate.cv_url}
                   </a>
                ) : (
                  <span className="text-stone-500 italic">Aucun lien CV fourni</span>
                )}
              </div>
            </div>

            <div className="space-y-6">
               <div className="bg-stone-50 p-4 rounded-xl border border-stone-100 h-full">
                <h3 className="text-sm font-bold text-stone-500 uppercase mb-3 flex items-center"><Heart className="w-4 h-4 mr-2"/> Passions & Bio</h3>
                <div className="prose prose-sm text-stone-700">
                   <p><span className="font-bold text-stone-900">Passions :</span> {(candidate.passions || []).join(', ')}</p>
                   <div className="mt-4">
                     <span className="font-bold text-stone-900 block mb-1">Projets / Motivation :</span>
                     <p className="bg-white p-3 rounded-lg border border-stone-200 italic">
                       "{(candidate.projets || []).join(', ')}"
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default CandidateDetailView;