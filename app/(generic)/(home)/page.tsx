import AboutUs from "./components/AboutUs";
import BookingProcess from "./components/BookingProcess";
import ContactUs from "./components/ContactUs";
import FlashSale from "./components/FlashSale";
import Hero from "./components/Hero";
import Offers from "./components/Offers";
import OurFeatures from "./components/OurFeatures";
import Testimonials from "./components/Testimonials";

export default function Home() {
  return (
    <div className="bg-background min-h-dvh">
      <Hero />
      <OurFeatures />
      <BookingProcess />
      <AboutUs />
      <FlashSale />
      <Testimonials />
      <ContactUs />
      <Offers />
    </div>
  );
}
