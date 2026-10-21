import Hero from '@/components/site/home/Hero';
import LevelsSection from '@/components/site/home/LevelsSection';
import CoursesSection from '@/components/site/home/CoursesSection';
import ResourcesSection from '@/components/site/home/ResourcesSection';
import TeachersSection from '@/components/site/home/TeachersSection';
import EventsSection from '@/components/site/home/EventsSection';
import VoicesSection from '@/components/site/home/VoicesSection';
import FaqSection from '@/components/site/home/FaqSection';
import ContactSection from '@/components/site/home/ContactSection';
import AboutStrip from '@/components/site/home/AboutStrip';

export default function Home() {
  return (
    <>
      <Hero />
      <AboutStrip />
      <LevelsSection />
      <CoursesSection />
      <ResourcesSection />
      <TeachersSection />
      <EventsSection />
      <VoicesSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}