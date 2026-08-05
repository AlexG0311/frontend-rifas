import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">

      {/* Hero con imagen de fondo */}
      <header className="relative h-[70vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Fondo: cambia la URL por tu imagen en public/images/hero.jpg */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/images/hero/portada.jpg')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-black/45" aria-hidden />

        <div className="relative z-10 text-center px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-3">Participa, gana, celebra</h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">La forma más emocionante de apoyar y ganar. Explora nuestras rifas y participa hoy.</p>
          <div className="mt-6">
            <Link to="/rifas" className="inline-block bg-white text-black rounded-full px-6 py-2 font-semibold shadow">Ver rifas</Link>
          </div>
        </div>
      </header>

      {/* Sección Nosotros */}
      <section id="nosotros" className="py-16 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-3">Sobre nosotros</h2>
        <p className="text-base text-base-content/70 max-w-3xl mx-auto">Somos una comunidad que organiza rifas transparentes y con propósito. Cada participación apoya iniciativas locales y te da la oportunidad de ganar grandes premios.</p>
      </section>

      {/* Footer con contacto y redes */}
      <footer id="contacto" className="mt-auto bg-base-200 border-t border-base-300 py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg">Contáctanos</h3>
            <p className="text-sm text-base-content/70">hola@ejemplo.com · +56 9 1234 5678</p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-medium mb-2">Síguenos</p>
            <div className="flex items-center gap-3 justify-center md:justify-end">
              <a href="#" className="text-base-content/70 hover:text-base-content">Twitter</a>
              <a href="#" className="text-base-content/70 hover:text-base-content">Instagram</a>
              <a href="#" className="text-base-content/70 hover:text-base-content">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}