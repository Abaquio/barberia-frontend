import { useNavigate } from "react-router-dom";
import Topbar from "@/components/topbar";
import BarberHero from "@/components/barber-hero";
import ServicesSection from "@/components/services-section";
import BarbersSection from "@/components/barbers-section";
import AboutSection from "@/components/about-section";
import InstagranFeed from "@/components/instagram-feed";
import ContactSection from "@/components/contact-section";

export default function Home() {
  const navigate = useNavigate();
  const handleAdminClick = () => navigate("/login");

  return (
    <main className="overflow-x-hidden">
      <Topbar onAdminClick={handleAdminClick} />
      <BarberHero />
      <BarbersSection />
      <AboutSection />
      <InstagranFeed />
      <ContactSection />
    </main>
  );
}
