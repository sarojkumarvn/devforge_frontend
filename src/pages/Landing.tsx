import Features from '../components/Features'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Testimonials from '../components/Testimonials'

export default function Landing() {
  return (
    <main className="relative overflow-x-hidden">
      <Hero />
      <Features />
      <Testimonials />
      <Footer />
    </main>
  )
}
