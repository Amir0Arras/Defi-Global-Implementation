import React, { Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import VillageMap from '@/components/MainCards';
import Footer from '@/components/Footer';
import NirdAssistant from '@/components/NirdAssistant';
import ContactButton from '@/components/ContactButton';
import PrivacyBanner from '@/components/PrivacyBanner';
import { Toaster } from '@/components/ui/toaster';
import { Loader2 } from 'lucide-react';

// Lazy Loading des composants lourds pour la sobriété numérique
const TeamSection = lazy(() => import('@/components/TeamSection'));
const QuizCard = lazy(() => import('@/components/QuizCard'));
const ForumSection = lazy(() => import('@/components/ForumSection'));
const AvisSection = lazy(() => import('@/components/AvisSection')); // NEW
const AdminPanel = lazy(() => import('@/components/AdminPanel'));

// Composant de chargement léger
const SectionLoader = () => (
  <div className="py-20 flex justify-center items-center text-blue-600" aria-label="Chargement de la section">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

function App() {
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'fr' }}>
        <title>NIRD - Le Village Numérique Responsable</title>
        <meta name="description" content="Alternative libre, éthique et durable pour l'école numérique. Solution basée sur Linux pour réduire l'empreinte carbone." />
        <meta name="author" content="NIRD - Numérique Inclusif Responsable Durable" />
        <meta name="theme-color" content="#3b82f6" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fr_FR" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-blue-50 to-pink-50 font-comic relative selection:bg-blue-200">
        <main role="main">
          <Hero />
          <VillageMap />
          
          <Suspense fallback={<SectionLoader />}>
            <TeamSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <AvisSection />
          </Suspense>

          <Suspense fallback={<SectionLoader />}>
            <ForumSection />
          </Suspense>
          
          <Suspense fallback={<SectionLoader />}>
            <QuizCard />
          </Suspense>
          
          <ContactButton />
          
          <Suspense fallback={null}>
            <AdminPanel />
          </Suspense>
        </main>

        <Footer />
        <NirdAssistant />
        <PrivacyBanner />
        <Toaster />
      </div>
    </>
  );
}

export default App;