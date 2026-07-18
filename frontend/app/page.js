import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import Offers from "@/components/home/Offers";
import BestSellers from "@/components/home/BestSellers";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import SafetyNote from "@/components/home/SafetyNote";
import Testimonials from "@/components/home/Testimonials";
import Gallery from "@/components/home/Gallery";
import WhatsAppCTA from "@/components/home/WhatsAppCTA";
import FeaturedCollections from "@/components/home/FeaturedCollections";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <FeaturedCollections />
      <Categories />
      <Offers />
      <BestSellers />
      <WhyChooseUs />
      <SafetyNote />
      <Testimonials />
      <Gallery />
      <WhatsAppCTA />
    </main>
  );
}