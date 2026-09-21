/* ====================================================================
   FLORES AMARILLAS — lógica del jardín
   JavaScript puro, sin librerías.

   Solo necesitas tocar el primer bloque para personalizar el regalo.
   ==================================================================== */

/* ==================================================================
   ===== CONFIGURACIÓN PERSONAL =====
   Cambia únicamente lo que está dentro de este bloque.
   ================================================================== */
const CONFIG = {

  // Su nombre. Déjalo vacío ("") si prefieres no ponerlo.
  nombre: "",

  // Mensaje principal
  mensaje:
    "Quería regalarte algo diferente este 21 de septiembre, " +
    "así que hice crecer unas pequeñas flores para ti. " +
    "Espero que este detalle te saque una sonrisa y te recuerde " +
    "lo especial que eres para mí.",

  // Frase final
  fraseFinal: "Feliz día de las flores amarillas.",

  // Texto bajo la fotografía (déjalo vacío para no mostrarlo)
  pieDeFoto: "21 de septiembre",

  // Textos del botón
  textoBoton: "Haz crecer una flor",
  textoJardinLleno: "El jardín está lleno",

  // Cuántas flores nacen solas al abrir la página
  floresIniciales: 7,

  // Cuántas flores puede hacer crecer ella con el botón como máximo.
  // (El jardín nunca deja que dos flores ocupen el mismo espacio, así
  // que el límite real también depende de cuántos espacios libres
  // quedan en el césped según el tamaño de la pantalla.)
  maxFloresExtra: 18,

  // Colores de los pétalos (se eligen al azar entre estos)
  tonosPetalo: ["#f5c542", "#ffd85f", "#eeb32c", "#ffe07a"],

  // Colores de las hojas
  tonosHoja: ["#5aa055", "#4b8f4c", "#67ae5e"],

  // Pétalos que caen de fondo y motas de luz (bájalos si notas lentitud)
  petalosAmbiente: 10,
  motasAmbiente: 8,

  // Densidad del césped (bájalos si notas lentitud en el teléfono)
  briznasAtras: 30,
  briznasFrente: 16,
};

/* ==================================================================
   ===== FIN DE LA CONFIGURACIÓN PERSONAL =====
   De aquí hacia abajo normalmente no hace falta cambiar nada.
   ================================================================== */


/* ------------------------------------------------------------------
   Utilidades
------------------------------------------------------------------ */
const $ = (sel) => document.querySelector(sel);
const azar = (min, max) => Math.random() * (max - min) + min;
const enteroAzar = (min, max) => Math.floor(azar(min, max + 1));
const elegir = (lista) => lista[Math.floor(Math.random() * lista.length)];

// Mezcla dos colores hexadecimales (0 = color A, 1 = color B)
function mezclar(a, b, f) {
  const n = (h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16));
  const [r1, g1, b1] = n(a);
  const [r2, g2, b2] = n(b);
  const c = (x, y) => Math.round(x + (y - x) * f).toString(16).padStart(2, "0");
  return "#" + c(r1, r2) + c(g1, g2) + c(b1, b2);
}

// ¿La persona pidió menos animaciones en su sistema?
const menosMovimiento =
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const jardin = $("#jardin");
const capaFlores = $("#flores");

// Duración total del crecimiento de una flor, en segundos.
// (brote 0 · tallo 0,55 · hojas 1,5 · capullo 2,2 · pétalos 2,75 · centro 3,5)
const DURACION_CRECIMIENTO = 5.3;


/* ------------------------------------------------------------------
   1. Texto del mensaje
------------------------------------------------------------------ */
function escribirTextos() {
  const saludo = $("#saludo");
  const texto = $("#texto");
  const frase = $("#frase");
  const pie = $("#pie-foto");

  if (CONFIG.nombre.trim() !== "") {
    saludo.textContent = "Para " + CONFIG.nombre;
  }
  texto.textContent = CONFIG.mensaje;
  frase.textContent = CONFIG.fraseFinal;
  pie.textContent = CONFIG.pieDeFoto;

  $("#btn-flor-texto").textContent = CONFIG.textoBoton;
}


/* ------------------------------------------------------------------
   2. ===== CÉSPED =====
   Dos capas de briznas: una detrás de las flores y otra delante.
   Cada brizna tiene su altura, grosor, inclinación, tono y ritmo,
   así que la hierba nunca se mueve toda a la vez.
------------------------------------------------------------------ */
function briznaDeHierba(frente) {
  const b = document.createElement("span");
  b.className = "brizna";

  // Las de delante son más altas y más oscuras: dan sensación de cercanía
  const alto = frente ? azar(42, 96) : azar(28, 78);
  const claro = frente ? azar(0, 0.35) : azar(0.25, 1);

  b.style.setProperty("--x", azar(-2, 102).toFixed(2) + "%");
  b.style.setProperty("--alto", alto.toFixed(1) + "%");
  b.style.setProperty("--ancho", azar(2, 4.6).toFixed(1) + "px");
  b.style.setProperty("--inc", azar(-16, 16).toFixed(1) + "deg");
  b.style.setProperty("--amp", azar(1.8, 5.5).toFixed(1) + "deg");
  b.style.setProperty("--dur", azar(4.5, 9.5).toFixed(2) + "s");
  b.style.setProperty("--del", azar(-6, 0).toFixed(2) + "s");
  b.style.setProperty("--c1", frente ? "#0c2618" : "#143a24");
  b.style.setProperty("--c2", mezclar("#2c6b3c", "#7ab86a", claro));
  return b;
}

function hojitaSuelta(frente) {
  const h = document.createElement("span");
  h.className = "hojita";
  h.style.setProperty("--x", azar(0, 100).toFixed(2) + "%");
  h.style.setProperty("--y", azar(0, 14).toFixed(1) + "%");
  h.style.setProperty("--ancho", azar(14, 30).toFixed(0) + "px");
  h.style.setProperty("--alto", azar(6, 12).toFixed(0) + "px");
  h.style.setProperty("--inc", azar(-22, 22).toFixed(1) + "deg");
  h.style.setProperty("--amp", azar(1, 3).toFixed(1) + "deg");
  h.style.setProperty("--dur", azar(7, 12).toFixed(2) + "s");
  h.style.setProperty("--del", azar(-8, 0).toFixed(2) + "s");
  h.style.setProperty("--c1", frente ? "#16402790" : mezclar("#2c6b3c", "#5aa055", azar(0, 1)));
  return h;
}

function crearCesped() {
  // En pantallas estrechas se siembra algo menos de hierba
  const densidad = window.innerWidth < 420 ? 0.75 : 1;

  const capas = [
    { nodo: $("#cesped-atras"),  cantidad: Math.round(CONFIG.briznasAtras * densidad),  frente: false, hojitas: 7 },
    { nodo: $("#cesped-frente"), cantidad: Math.round(CONFIG.briznasFrente * densidad), frente: true,  hojitas: 4 },
  ];

  capas.forEach((capa) => {
    if (!capa.nodo) return;
    const trozos = document.createDocumentFragment();
    for (let i = 0; i < capa.cantidad; i++) trozos.appendChild(briznaDeHierba(capa.frente));
    for (let i = 0; i < capa.hojitas; i++) trozos.appendChild(hojitaSuelta(capa.frente));
    capa.nodo.appendChild(trozos);
  });
}


/* ------------------------------------------------------------------
   3. ===== FLORES =====
   Cada flor es un SVG con: brote, tallo, dos hojas con nervadura,
   capullo, cáliz, dos coronas de pétalos (una detrás y otra delante)
   y un centro con estambres y semillas.
   Las animaciones de cada pieza están en style.css.
------------------------------------------------------------------ */

// Formas base (viewBox 0 0 140 268, centro de la flor en 70,105)
const D_TALLO   = "M70 262 C 62 208 78 160 70 112";
const D_HOJA_I  = "M70 198 C 40 196 22 176 24 150 C 48 152 64 172 70 198 Z";
const D_VENA_I  = "M70 198 C 52 188 36 170 26 152";
const D_HOJA_D  = "M70 166 C 100 164 118 144 116 118 C 92 120 76 140 70 166 Z";
const D_VENA_D  = "M70 166 C 88 156 104 138 114 120";
const D_PETALO  = "M70 105 C 60 93 54 72 60 52 C 63 42 68 40 70 47 C 72 40 77 42 80 52 C 86 72 80 93 70 105 Z";
const D_CAPULLO = "M70 138 C 52 134 42 118 46 102 C 50 88 62 80 70 80 C 78 80 90 88 94 102 C 98 118 88 134 70 138 Z";
const D_CALIZ   = "M70 131 C 57 130 47 121 47 110 C 56 121 84 121 93 110 C 93 121 83 130 70 131 Z";

let numeroDeFlor = 0;

/**
 * Devuelve el SVG de una flor, con pequeñas diferencias en cada una
 * (número de pétalos, apertura, inclinación de la cabeza y color).
 * @param {number} retraso  segundo en el que esta flor empieza a crecer
 */
function svgFlor(retraso) {
  const id = ++numeroDeFlor;

  const base   = elegir(CONFIG.tonosPetalo);
  const claro  = mezclar(base, "#fff6d0", 0.55);
  const hondo  = mezclar(base, "#9c6708", 0.45);
  const hoja   = elegir(CONFIG.tonosHoja);

  // Variaciones de forma: ninguna flor es clon de otra
  const nAtras   = enteroAzar(6, 8);
  const nFrente  = enteroAzar(9, 12);
  const escAtras = azar(1.12, 1.24);
  const escBase  = azar(0.9, 1.04);
  const giroAtras  = azar(0, 60);
  const giroFrente = azar(0, 40);
  const inclinacionCabeza = azar(-9, 9);

  // Los pétalos se abren en cascada; cada uno empieza un poco después
  let paso = 0;
  const filaDePetalos = (cuantos, giro, escalaFila, clase, inicio) => {
    let html = "";
    for (let i = 0; i < cuantos; i++) {
      const rot = giro + (360 / cuantos) * i + azar(-3, 3);
      const esc = escalaFila * azar(0.94, 1.06);
      const cuando = (retraso + inicio + paso * 0.07).toFixed(3);
      paso++;
      html +=
        `<path class="petalo ${clase}" d="${D_PETALO}" fill="url(#${clase}-${id})" ` +
        `style="--rot:${rot.toFixed(1)}deg;--esc:${esc.toFixed(3)};--inicio-petalo:${cuando}s"/>`;
    }
    return html;
  };

  const petalosAtras  = filaDePetalos(nAtras,  giroAtras,  escAtras, "pa", 2.75);
  const petalosFrente = filaDePetalos(nFrente, giroFrente, escBase,  "pf", 3.05);

  // Semillas del centro en espiral (como una flor real)
  let semillas = "";
  for (let i = 0; i < 13; i++) {
    const a = i * 2.3999;
    const r = 4.6 * Math.sqrt(i);
    semillas +=
      `<circle cx="${(70 + Math.cos(a) * r).toFixed(1)}" cy="${(105 + Math.sin(a) * r).toFixed(1)}" r="1.7"/>`;
  }

  return `
<svg viewBox="0 0 140 268" xmlns="http://www.w3.org/2000/svg" focusable="false">
  <defs>
    <linearGradient id="pf-${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="${hondo}"/>
      <stop offset="45%"  stop-color="${base}"/>
      <stop offset="100%" stop-color="${claro}"/>
    </linearGradient>
    <linearGradient id="pa-${id}" x1="0" y1="1" x2="0" y2="0">
      <stop offset="0%"   stop-color="${mezclar(hondo, "#7d4e05", 0.35)}"/>
      <stop offset="60%"  stop-color="${mezclar(base, hondo, 0.4)}"/>
      <stop offset="100%" stop-color="${mezclar(base, claro, 0.3)}"/>
    </linearGradient>
    <radialGradient id="c-${id}" cx="38%" cy="32%" r="72%">
      <stop offset="0%"   stop-color="#d89c22"/>
      <stop offset="58%"  stop-color="#a86d0e"/>
      <stop offset="100%" stop-color="#6f4106"/>
    </radialGradient>
  </defs>

  <!-- 1. brote -->
  <g class="brote">
    <path d="M70 262 C 64 252 66 242 72 238 C 76 246 75 256 70 262 Z" fill="${hoja}"/>
    <circle cx="70" cy="258" r="5.5" fill="${mezclar(hoja, "#2b6b3c", 0.45)}"/>
  </g>

  <!-- 2. tallo -->
  <path class="tallo" pathLength="100" d="${D_TALLO}"/>

  <!-- 3. hojas -->
  <g class="hoja hoja-izq">
    <path d="${D_HOJA_I}" fill="${hoja}"/>
    <path class="hoja-vena" d="${D_VENA_I}"/>
  </g>
  <g class="hoja hoja-der">
    <path d="${D_HOJA_D}" fill="${mezclar(hoja, "#2f6b3e", 0.25)}"/>
    <path class="hoja-vena" d="${D_VENA_D}"/>
  </g>

  <!-- 4 a 6. cabeza de la flor -->
  <g transform="rotate(${inclinacionCabeza.toFixed(1)} 70 118)">
    <g class="cabeza">
      <path class="capullo" d="${D_CAPULLO}" fill="${mezclar(hoja, "#2a6438", 0.4)}"/>
      <path class="caliz" d="${D_CALIZ}"/>
      <g class="corola-atras">${petalosAtras}</g>
      <g class="corola-frente">${petalosFrente}</g>
      <g class="centro-disco">
        <circle class="corona" cx="70" cy="105" r="26"/>
        <circle cx="70" cy="105" r="23" fill="url(#c-${id})"/>
        <circle cx="70" cy="105" r="23" fill="none" stroke="${hondo}" stroke-width="2" opacity="0.5"/>
        <g class="semillas" fill="#5f3705">${semillas}</g>
      </g>
    </g>
  </g>
</svg>`;
}

/**
 * Crea una flor y la planta en el césped, dentro de un "espacio" (slot)
 * ya calculado por generarEspacios(). El slot fija la posición horizontal
 * y una pequeña profundidad (adelante/atrás); el resto (tamaño, brisa)
 * conserva variación natural.
 * @param {{x:number, profundidad:number}} slot
 * @param {number} retraso  segundos antes de empezar a crecer
 */
function plantarFlor(slot, retraso) {
  const flor = document.createElement("div");
  flor.className = "flor";

  // Tamaño: grande, con una variación natural leve y un empuje
  // según la profundidad del espacio (más cerca = un poco más grande).
  let escala = azar(0.92, 1.08) + slot.profundidad * 0.09;
  escala = Math.min(1.22, Math.max(0.8, escala));

  // Diferencias de brisa: amplitud, velocidad y desfase propios
  const balanceo = azar(1.1, 3.2);
  const velCorta = azar(4.5, 8.5);
  const velLarga = azar(11, 19);
  const velCabeza = azar(6.5, 11);
  const desfase = azar(0, 3.5);

  flor.style.setProperty("--x", slot.x.toFixed(2) + "%");
  flor.style.setProperty("--y", (slot.profundidad * -1.6).toFixed(2) + "%");
  flor.style.setProperty("--escala", escala.toFixed(3));
  flor.style.setProperty("--r", retraso.toFixed(2) + "s");
  flor.style.setProperty("--balanceo", balanceo.toFixed(2) + "deg");
  flor.style.setProperty("--vel", velCorta.toFixed(2) + "s");
  flor.style.setProperty("--vel-larga", velLarga.toFixed(2) + "s");
  flor.style.setProperty("--vel-cabeza", velCabeza.toFixed(2) + "s");
  // La brisa arranca cuando la flor ya terminó de abrirse
  flor.style.setProperty(
    "--viento-inicio",
    (retraso + DURACION_CRECIMIENTO + desfase).toFixed(2) + "s"
  );
  // Las flores "de adelante" quedan por encima: da sensación de profundidad
  flor.style.zIndex = String(Math.round((escala + slot.profundidad) * 10) + 10);

  const brisa = document.createElement("div");
  brisa.className = "flor-brisa";
  const envoltura = document.createElement("div");
  envoltura.className = "flor-sway";
  envoltura.innerHTML = svgFlor(retraso);

  brisa.appendChild(envoltura);
  flor.appendChild(brisa);
  capaFlores.appendChild(flor);
  return flor;
}


/* ------------------------------------------------------------------
   4. ===== ESPACIOS DEL CÉSPED =====
   En vez de posiciones al azar (que podían pisarse entre sí), el
   jardín reparte un número de "espacios" fijos y bien separados a
   lo largo del césped: izquierda, centro-izquierda, centro...
   El número de espacios se adapta al ancho de pantalla para que las
   flores puedan seguir siendo grandes sin encimarse.
------------------------------------------------------------------ */
let espacios = [];              // { x, profundidad, ocupado }

function calcularCantidadDeEspacios() {
  const ancho = window.innerWidth;
  // Ancho aproximado que ocupa una flor grande, como % del jardín
  const anchoFlor = ancho < 400 ? 18 : ancho < 600 ? 15 : ancho < 900 ? 12 : 8;
  const margen = 8;             // % libre en cada extremo
  const disponible = 100 - margen * 2;
  const cantidad = Math.floor(disponible / anchoFlor) + 1;
  return Math.max(4, Math.min(cantidad, 14));
}

function generarEspacios() {
  const cantidad = calcularCantidadDeEspacios();
  const margen = 8;
  const paso = cantidad > 1 ? (100 - margen * 2) / (cantidad - 1) : 0;

  const lista = [];
  for (let i = 0; i < cantidad; i++) {
    const xBase = cantidad > 1 ? margen + paso * i : 50;
    // Una pequeña variación fija (no aleatoria) para que no se vea en fila
    // perfectamente robótica, sin invadir el espacio del vecino.
    const jitter = Math.sin(i * 2.6) * paso * 0.1;
    // Profundidad "adelante / atrás", también fija y determinística,
    // para que la separación entre flores sea siempre estable.
    const profundidad = Math.sin(i * 2.399963); // ángulo dorado: reparto natural

    lista.push({
      x: Math.min(96, Math.max(4, xBase + jitter)),
      profundidad,
      ocupado: false,
    });
  }
  return lista;
}


/* ------------------------------------------------------------------
   5. Jardín inicial
   Todas las flores iniciales crecen juntas y de forma coordinada:
   solo hay unas pocas décimas de segundo de diferencia entre ellas.
------------------------------------------------------------------ */
function sembrarJardinInicial() {
  espacios = generarEspacios();

  const cuantas = Math.min(CONFIG.floresIniciales, espacios.length);

  for (let i = 0; i < cuantas; i++) {
    espacios[i].ocupado = true;
    // Variación mínima (décimas de segundo), no segundos: el jardín
    // crece como grupo, no una flor completa antes que la siguiente.
    const retraso = menosMovimiento ? 0 : 0.6 + i * 0.14 + azar(-0.04, 0.04);
    plantarFlor(espacios[i], Math.max(0, retraso));
  }
}


/* ------------------------------------------------------------------
   6. Botón "Haz crecer una flor"
   Cada flor nueva busca un espacio libre del césped. Si no queda
   ninguno, se avisa que el jardín está lleno.
------------------------------------------------------------------ */
let floresExtra = 0;

function espaciosLibres() {
  return espacios.reduce((acc, e, i) => {
    if (!e.ocupado) acc.push(i);
    return acc;
  }, []);
}

function actualizarContador() {
  const ocupados = espacios.filter((e) => e.ocupado).length;
  $("#contador").textContent =
    ocupados === 1 ? "1 flor en el jardín" : ocupados + " flores en el jardín";
}

function hacerCrecerFlor() {
  const boton = $("#btn-flor");
  const libres = espaciosLibres();

  if (floresExtra >= CONFIG.maxFloresExtra || libres.length === 0) {
    boton.disabled = true;
    $("#btn-flor-texto").textContent = CONFIG.textoJardinLleno;
    return;
  }

  floresExtra++;

  // Elige un espacio libre al azar, nunca uno ya ocupado
  const idx = libres[Math.floor(Math.random() * libres.length)];
  const slot = espacios[idx];
  slot.ocupado = true;

  plantarFlor(slot, 0);
  const x = slot.x;

  // Respuesta visual del botón
  boton.classList.remove("sembrando");
  void boton.offsetWidth;            // reinicia la animación
  boton.classList.add("sembrando");

  // Partículas saliendo del césped, escalonadas para que no salgan en bloque
  if (!menosMovimiento) {
    const caja = jardin.getBoundingClientRect();
    const px = caja.left + (caja.width * x) / 100;
    const py = caja.bottom - caja.height * 0.11;
    for (let i = 0; i < 7; i++) {
      setTimeout(() => lanzarChispa(px + azar(-10, 10), py), i * 70);
    }
  }

  actualizarContador();

  // ¿Se llenó el jardín? (por número máximo o porque ya no hay espacios)
  if (floresExtra >= CONFIG.maxFloresExtra || espaciosLibres().length === 0) {
    boton.disabled = true;
    $("#btn-flor-texto").textContent = CONFIG.textoJardinLleno;
  }
}


/* ------------------------------------------------------------------
   7. Partículas al tocar la pantalla
------------------------------------------------------------------ */
function lanzarOnda(x, y) {
  const onda = document.createElement("span");
  onda.className = "onda";
  onda.style.left = x + "px";
  onda.style.top = y + "px";
  document.body.appendChild(onda);
  onda.addEventListener("animationend", () => onda.remove());
}

function lanzarChispa(x, y) {
  const chispa = document.createElement("span");
  chispa.className = "chispa";
  chispa.style.left = x + "px";
  chispa.style.top = y + "px";
  chispa.style.setProperty("--dx", azar(-60, 60).toFixed(0) + "px");
  chispa.style.setProperty("--dy", azar(-120, -50).toFixed(0) + "px");
  chispa.style.setProperty("--giro", azar(-240, 240).toFixed(0) + "deg");
  chispa.style.setProperty("--dur", azar(1.2, 2).toFixed(2) + "s");
  chispa.style.background = "linear-gradient(140deg, #ffe489, " + elegir(CONFIG.tonosPetalo) + ")";
  document.body.appendChild(chispa);
  chispa.addEventListener("animationend", () => chispa.remove());
}

function activarToquesEnElJardin() {
  if (menosMovimiento) return;
  let ultimoToque = 0;

  document.addEventListener(
    "pointerdown",
    (e) => {
      // No interferir con los botones ni con la tarjeta de la foto
      if (e.target.closest("button, a, .tarjeta, .mensaje, .frase")) return;

      const ahora = Date.now();
      if (ahora - ultimoToque < 160) return;   // no saturar
      ultimoToque = ahora;

      lanzarOnda(e.clientX, e.clientY);
      if (Math.random() > 0.35) lanzarChispa(e.clientX, e.clientY);
    },
    { passive: true }
  );
}


/* ------------------------------------------------------------------
   8. Ambiente: pétalos que caen y motas de luz
------------------------------------------------------------------ */
function crearAmbiente() {
  if (menosMovimiento) return;
  const ambiente = $("#ambiente");
  const trozos = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.petalosAmbiente; i++) {
    const p = document.createElement("span");
    p.className = "petalo-cae";
    p.style.setProperty("--x", azar(0, 100).toFixed(1) + "%");
    p.style.setProperty("--tam", azar(7, 13).toFixed(1) + "px");
    p.style.setProperty("--dur", azar(16, 30).toFixed(1) + "s");
    p.style.setProperty("--del", azar(0, 20).toFixed(1) + "s");
    p.style.setProperty("--deriva", azar(-14, 14).toFixed(1) + "vw");
    trozos.appendChild(p);
  }

  for (let i = 0; i < CONFIG.motasAmbiente; i++) {
    const m = document.createElement("span");
    m.className = "mota";
    m.style.setProperty("--x", azar(0, 100).toFixed(1) + "%");
    m.style.setProperty("--tam", azar(3, 6).toFixed(1) + "px");
    m.style.setProperty("--dur", azar(14, 24).toFixed(1) + "s");
    m.style.setProperty("--del", azar(0, 16).toFixed(1) + "s");
    m.style.setProperty("--deriva", azar(-8, 8).toFixed(1) + "vw");
    trozos.appendChild(m);
  }

  ambiente.appendChild(trozos);
}


/* ------------------------------------------------------------------
   9. Fotografía
   La ruta está en index.html (foto.jpg, en la raíz del proyecto).
   Si el archivo no existe, la tarjeta se mantiene con un fondo suave
   y sin errores.
------------------------------------------------------------------ */
function prepararFoto() {
  const foto = $("#foto");
  foto.addEventListener("error", () => {
    foto.style.display = "none";
    console.info("No se encontró foto.jpg en la raíz del proyecto.");
  });
}


/* ------------------------------------------------------------------
   10. Arranque
------------------------------------------------------------------ */
function iniciar() {
  escribirTextos();
  prepararFoto();
  crearAmbiente();
  crearCesped();
  sembrarJardinInicial();
  actualizarContador();
  activarToquesEnElJardin();

  $("#btn-flor").addEventListener("click", hacerCrecerFlor);

  // La clase .listo dispara la aparición de la foto, el texto y el botón,
  // sincronizada con el crecimiento de las flores.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => document.body.classList.add("listo"));
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
