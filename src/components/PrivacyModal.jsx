import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Shield, Server, Database, Lock } from 'lucide-react';

const PrivacyModal = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-blue-900 flex items-center gap-2">
            <Shield className="w-6 h-6" /> Politique de Confidentialité NIRD
          </DialogTitle>
          <DialogDescription>
            Transparence totale sur nos pratiques (Dernière mise à jour : Décembre 2025)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 text-sm text-gray-700">
          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500"/> Collecte des Données
            </h3>
            <p>
              Nous collectons uniquement les données strictement nécessaires au fonctionnement du service ("Minimisation des données") :
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Candidatures :</strong> Nom, Prénom, Email, CV. Ces données sont conservées dans Supabase (hébergé en UE/US avec clauses types).</li>
              <li><strong>Forum :</strong> Messages publics et pseudonymes.</li>
              <li><strong>Préférences :</strong> Stockage local du navigateur (pas de cookies tiers) pour mémoriser votre acceptation RGPD.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-green-500"/> Hébergement Responsable
            </h3>
            <p>
              Notre infrastructure utilise Supabase. Nous encourageons l'utilisation de centres de données alimentés par des énergies renouvelables.
              Le code frontend est optimisé pour réduire le transfert de données (Sobriété Numérique).
            </p>
          </section>

          <section>
            <h3 className="font-bold text-lg text-gray-900 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4 text-red-500"/> Vos Droits
            </h3>
            <p>
              Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données.
              Pour exercer ce droit, contactez-nous via le bouton Tchap ou par email à dpo@nird.fr.
            </p>
          </section>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-xs text-gray-500">
            Note : Ce site est une démonstration technique. Aucune donnée réelle sensible ne doit être soumise.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyModal;