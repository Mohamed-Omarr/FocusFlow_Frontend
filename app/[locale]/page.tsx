import { Footer } from "../component/landing/Footer";
import { VideoSection } from "../component/landing/VideoSection";
import { Features } from "../component/landing/Features";
import { Hero } from "../component/landing/Hero";
import { Header } from "../component/landing/Header";
function LandingPage() {
  return (
    <main>
      <div className="structure-layout-style ">
        <Header />
        <Hero />
        <Features />
        <VideoSection />
      </div>
      <Footer />
    </main>
  );
}

export default LandingPage;
