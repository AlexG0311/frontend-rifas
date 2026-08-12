import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 flex flex-col">

      {/* Hero con imagen de fondo */}
      <header className="relative h-[70vh] md:h-[75vh] flex items-center justify-center overflow-hidden">
        {/* Fondo: cambia la URL por tu imagen en public/images/hero.jpg */}
        <div
          className="absolute inset-0 bg-center bg-cover"
          style={{ backgroundImage: "url('/images/hero/portada.png')" }}
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


          {/* Sección Sobre nosotros */}
    <section id="nosotros" className="py-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* Foto */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 rotate-3" />

            <img
              src="/images/FotoAndres.jpeg"
              alt="Rifas Monterroza"
              className="relative w-full max-w-md rounded-3xl shadow-2xl object-cover"
            />
          </div>
        </div>

        {/* Contenido */}
        <div>
          <span className="text-sm font-bold uppercase tracking-widest text-primary">
            Vive la emoción
          </span>

          <h2 className="text-3xl md:text-4xl font-extrabold mt-2 mb-5">
            Tu próximo premio puede estar a un número de distancia
          </h2>

          <p className="text-base-content/70 text-lg leading-relaxed mb-4">
            Participar es fácil. Elige la rifa que más te guste,
            selecciona tus números o déjalos al azar y prepárate
            para vivir la emoción del sorteo.
          </p>

          <p className="text-base-content/70 leading-relaxed mb-8">
            Cada participación es una nueva oportunidad de ganar.
            Explora nuestras rifas, elige tu oportunidad y
            ¡que la suerte esté de tu lado!
          </p>

          {/* Beneficios */}
          <div className="grid sm:grid-cols-3 gap-4 mb-8">

            <div>
              <div className="text-2xl mb-2">🎟️</div>
              <h3 className="font-bold">Fácil de participar</h3>
              <p className="text-sm text-base-content/60">
                Elige tus números o déjalos al azar.
              </p>
            </div>

            <div>
              <div className="text-2xl mb-2">🎁</div>
              <h3 className="font-bold">Grandes premios</h3>
              <p className="text-sm text-base-content/60">
                Participa por increíbles premios.
              </p>
            </div>

            <div>
              <div className="text-2xl mb-2">✨</div>
              <h3 className="font-bold">Tu oportunidad</h3>
              <p className="text-sm text-base-content/60">
                Cada número puede ser el ganador.
              </p>
            </div>

          </div>

          <Link
            to="/rifas"
            className="inline-flex items-center gap-2 bg-primary text-primary-content rounded-full px-7 py-3 font-bold shadow-lg hover:scale-105 transition"
          >
            Ver rifas disponibles
            <span>→</span>
          </Link>
        </div>

      </div>
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