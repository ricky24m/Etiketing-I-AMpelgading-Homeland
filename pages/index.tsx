import React from 'react';
import Head from 'next/head';
import Navbar from '../components/Navbar';
import HeroSection from '../components/sections/HeroSection';
import GallerySection from '../components/sections/GallerySection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import ContactSection from '../components/sections/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>I&apos;AMpel GADING Homeland - Destinasi Wisata Alam Terbaik</title>
        <meta name="description" content="Destinasi wisata alam terbaik di ketinggian 1350 mdpl dengan camping, jeep adventure, dan outbound" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <HeroSection />
          <GallerySection />
          <TestimonialsSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
  