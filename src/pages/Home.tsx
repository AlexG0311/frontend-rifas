import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0F071A] text-[#F5F3FF] flex flex-col">

      {/* Hero con imagen de fondo */}
      <header className="relative h-[70vh] md:h-[75vh] flex items-center justify-center overflow-hidden border-b border-[#2A1745]">
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/images/hero/portada.webp')" }}
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F071A]/85 via-[#0F071A]/75 to-[#0F071A]" aria-hidden />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#F5C542] text-xs sm:text-sm font-bold uppercase tracking-widest mb-4 backdrop-blur-sm">
            ✨ La mejor plataforma de rifas
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#F5F3FF] mb-4 tracking-tight drop-shadow-md">
            Participa, gana, celebra
          </h1>
          <p className="text-lg sm:text-xl text-[#F5F3FF]/80 max-w-2xl mx-auto leading-relaxed">
            La forma más emocionante de apoyar y ganar. Explora nuestras rifas y participa hoy.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/rifas"
              className="inline-block bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-8 py-3.5 font-bold shadow-lg shadow-[#8B5CF6]/35 transition-all hover:scale-105"
            >
              Ver rifas disponibles
            </Link>
          </div>
        </div>
      </header>


      {/* Sección Sobre nosotros */}
      <section id="nosotros" className="py-20 px-6 bg-[#0F071A]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* Foto */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-[#8B5CF6]/20 border border-[#2A1745] rotate-3 blur-sm" />

              <img
                src="/images/FotoAndres.jpeg"
                alt="Rifas Monterroza"
                className="relative w-full max-w-md rounded-3xl shadow-2xl border border-[#2A1745] object-cover"
              />
            </div>
          </div>

          {/* Contenido */}
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-[#F5C542]">
              Vive la emoción
            </span>

            <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-5 text-[#F5F3FF]">
              Tu próximo premio puede estar a un número de distancia
            </h2>

            <p className="text-[#F5F3FF]/75 text-lg leading-relaxed mb-4">
              Participar es fácil. Elige la rifa que más te guste,
              selecciona tus números o déjalos al azar y prepárate
              para vivir la emoción del sorteo.
            </p>

            <p className="text-[#F5F3FF]/65 leading-relaxed mb-8">
              Cada participación es una nueva oportunidad de ganar.
              Explora nuestras rifas, elige tu oportunidad y
              ¡que la suerte esté de tu lado!
            </p>

            {/* Beneficios */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">

              <div className="bg-[#180D2B] border border-[#2A1745] p-4 rounded-2xl">
                <div className="text-2xl mb-2 text-[#F5C542]">🎟️</div>
                <h3 className="font-bold text-[#F5F3FF]">Fácil de participar</h3>
                <p className="text-xs text-[#F5F3FF]/60 mt-1">
                  Elige tus números o déjalos al azar.
                </p>
              </div>

              <div className="bg-[#180D2B] border border-[#2A1745] p-4 rounded-2xl">
                <div className="text-2xl mb-2 text-[#F5C542]">🎁</div>
                <h3 className="font-bold text-[#F5F3FF]">Grandes premios</h3>
                <p className="text-xs text-[#F5F3FF]/60 mt-1">
                  Participa por increíbles premios.
                </p>
              </div>

              <div className="bg-[#180D2B] border border-[#2A1745] p-4 rounded-2xl">
                <div className="text-2xl mb-2 text-[#F5C542]">✨</div>
                <h3 className="font-bold text-[#F5F3FF]">Tu oportunidad</h3>
                <p className="text-xs text-[#F5F3FF]/60 mt-1">
                  Cada número puede ser el ganador.
                </p>
              </div>

            </div>

            <Link
              to="/rifas"
              className="inline-flex items-center gap-2 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-full px-7 py-3 font-bold shadow-lg shadow-[#8B5CF6]/30 hover:scale-105 transition-all"
            >
              Ver rifas disponibles
              <span>→</span>
            </Link>
          </div>

        </div>
      </section>

      {/* Footer con contacto y redes */}
      <footer id="contacto" className="mt-auto bg-[#180D2B] border-t border-[#2A1745] py-8 text-[#F5F3FF]">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-bold text-lg text-[#F5F3FF]">Contáctanos</h3>
            <p className="text-sm text-[#F5F3FF]/70">hola@ejemplo.com · +56 9 1234 5678</p>
          </div>

          <div className="text-center md:text-right">
            <p className="font-medium mb-2 text-[#F5F3FF]">Síguenos</p>
            <div className="flex items-center gap-4 justify-center md:justify-end text-sm">
              <a href="#" className="text-[#F5F3FF]/70 hover:text-[#F5C542] transition-colors">Twitter</a>
              <a href="#" className="text-[#F5F3FF]/70 hover:text-[#F5C542] transition-colors">Instagram</a>
              <a href="#" className="text-[#F5F3FF]/70 hover:text-[#F5C542] transition-colors">Facebook</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}