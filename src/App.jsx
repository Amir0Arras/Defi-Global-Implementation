
import React from 'react';
import { Helmet } from 'react-helmet';
import Hero from '@/components/Hero';
import VillageMap from '@/components/MainCards';
import QuizCard from '@/components/QuizCard';
import ContactButton from '@/components/ContactButton';
import Footer from '@/components/Footer';
import ForumSection from '@/components/ForumSection';
import NirdAssistant from '@/components/NirdAssistant';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>NIRD - Le Village Numérique</title>
        <meta name="description" content="Bienvenue dans le village NIRD ! Une alternative libre, éthique et durable pour l'école numérique." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-yellow-50 via-blue-50 to-pink-50 font-comic relative">
        <Hero />
        <VillageMap />
        <ForumSection />
        <QuizCard />
        <ContactButton />
        <Footer />
        <NirdAssistant />
        <Toaster />
      </div>
    </>
  );
}

export default App;
