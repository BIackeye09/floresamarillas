# Flores amarillas 🌼

Un pequeño jardín digital que crece solo, muestra una foto y un mensaje,
y deja que ella haga crecer más flores tocando un botón.

Hecho con HTML, CSS y JavaScript puro. Sin frameworks, sin backend.

---

## 1. Estructura

```
proyecto-flores-amarillas/
│
├── index.html          estructura de la página
├── style.css           todo el diseño y las animaciones
├── script.js           textos, flores y la interacción
├── README.md           esta guía
│
└── assets/
    ├── foto.jpg        la fotografía (reemplázala por la tuya)
    └── music/
        └── musica.mp3  la canción (opcional)
```

| Archivo | Qué hace |
|---|---|
| `index.html` | El esqueleto: capas del fondo, el jardín, la tarjeta de la foto, el mensaje, el botón y el reproductor. |
| `style.css` | Colores, tipografía, diseño para celular y **todas** las animaciones (crecimiento de la flor, viento, pétalos que caen, apariciones). |
| `script.js` | Tus textos, la construcción de las flores en SVG, el botón "Haz crecer una flor", las partículas al tocar y la música. |

---

## 2. Personalizar (lo único que necesitas tocar)

### Tu fotografía
Reemplaza `assets/foto.jpg` por la foto de ella, **con ese mismo nombre**.
No hay que tocar ningún código.

- Se recomienda una foto vertical (la tarjeta usa proporción 4:5).
- Se recorta centrada, sin filtros ni deformaciones.
- Si tu foto es `.png` o `.jpeg`, renómbrala a `foto.jpg` (funciona igual).

### Las posiciones de las flores
No necesitas tocar nada: el jardín calcula solo cuántos "espacios" caben en
el césped según el ancho de la pantalla (menos en un teléfono angosto, más
en una computadora) y reparte ahí las flores, sin que ninguna quede encima
de otra. El botón "Haz crecer una flor" siempre busca un espacio libre.

### El mensaje
Abre `script.js` y busca el bloque:

```js
// ===== CONFIGURACIÓN PERSONAL =====
const CONFIG = {
  nombre: "",                 // su nombre, o "" para no mostrarlo
  mensaje: "...",             // el texto principal
  fraseFinal: "Feliz día de las flores amarillas.",
  pieDeFoto: "21 de septiembre",
  textoBoton: "Haz crecer una flor",
  textoJardinLleno: "El jardín está lleno",
  floresIniciales: 7,         // flores que nacen solas (máximo 9)
  maxFloresExtra: 18,         // flores que puede sembrar ella
  tonosPetalo: [...],
  tonosHoja: [...],
  petalosAmbiente: 10,
  motasAmbiente: 8,
  briznasAtras: 30,           // densidad del césped
  briznasFrente: 16,
};
```

### Los colores
Abre `style.css`, arriba del todo:

```css
/* ===== CONFIGURACIÓN PERSONAL: COLORES ===== */
:root {
  --verde-noche: #0d2318;
  --amarillo: #f5c542;
  ...
}
```

### La música
Coloca tu canción en `assets/music/musica.mp3`.
Si el archivo no existe, el botón de música se oculta solo y la página sigue
funcionando perfectamente. **Nunca** suena automáticamente: los navegadores de
celular lo bloquean, así que ella debe tocar el botón de arriba a la derecha.

---

## 3. Abrir el proyecto en Visual Studio Code

1. Crea una carpeta llamada `proyecto-flores-amarillas` donde prefieras
   (por ejemplo en Documentos).
2. En VS Code: **Archivo → Abrir carpeta…** y elige esa carpeta.
3. Crea los archivos con el icono de "Nuevo archivo" del panel lateral:
   `index.html`, `style.css`, `script.js`.
4. Crea la carpeta `assets` con el icono de "Nueva carpeta", y dentro otra
   llamada `music`.
5. Arrastra tu foto dentro de `assets` y renómbrala `foto.jpg`.
   Arrastra tu canción dentro de `assets/music` y renómbrala `musica.mp3`.

### Ejecutarlo en tu computadora

**Opción A (recomendada): extensión Live Server**

1. En VS Code, ve al panel de Extensiones (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Busca **Live Server** (de Ritwick Dey) e instálala.
3. Clic derecho sobre `index.html` → **Open with Live Server**.
4. Se abre el navegador en `http://127.0.0.1:5500`. Cada vez que guardes,
   la página se recarga sola.

**Opción B: sin extensiones**
Doble clic en `index.html`. Funciona, aunque algunos navegadores restringen
el audio en archivos abiertos así (`file://`). Para probar la música, usa
Live Server.

### Extensiones útiles
- **Live Server** — servidor local con recarga automática (la más importante).
- **Prettier** — ordena el código al guardar.
- **Auto Rename Tag** — renombra la etiqueta de cierre automáticamente.
- **Color Highlight** — muestra los colores del CSS en el editor.

### Probarlo desde tu teléfono en la misma red WiFi

1. Con Live Server corriendo, averigua la IP de tu computadora:
   - Windows: abre la terminal y escribe `ipconfig` → busca "Dirección IPv4"
     (algo como `192.168.1.35`).
   - macOS / Linux: `ifconfig | grep inet` o mira Preferencias → Red.
2. Conecta el teléfono a la **misma red WiFi**.
3. En el navegador del teléfono abre: `http://192.168.1.35:5500`
   (tu IP + `:5500`).
4. Si no carga: revisa que el firewall de Windows permita VS Code, y que el
   teléfono no esté en datos móviles.

### Problemas de rutas (lo más común)
- Las rutas son **relativas**: `assets/foto.jpg`, sin `/` al inicio.
  Si escribes `/assets/foto.jpg` fallará en GitHub Pages.
- En GitHub Pages las mayúsculas importan: `Foto.JPG` ≠ `foto.jpg`.
- Si la foto no aparece, abre la consola del navegador (`F12` → Consola) y
  mira si dice 404: casi siempre es el nombre del archivo.

---

## 4. Publicarlo en GitHub Pages

1. **Crear el repositorio.** Entra a github.com → botón **New** →
   nombre: `flores-amarillas` → **Public** → **Create repository**.
   No marques "Add a README" (ya tienes uno).

2. **Subirlo desde VS Code.**
   - Abre el panel **Control de código fuente** (icono de ramas, `Ctrl+Shift+G`).
   - Clic en **Inicializar repositorio**.
   - Escribe un mensaje, por ejemplo `Primer commit`, y pulsa **Commit**.
   - Pulsa **Publicar rama** y elige tu repositorio de GitHub.
     (Si VS Code te lo pide, inicia sesión con tu cuenta de GitHub.)

   Si prefieres la terminal (`Ctrl+ñ` en VS Code):
   ```bash
   git init
   git add .
   git commit -m "Primer commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/flores-amarillas.git
   git push -u origin main
   ```

3. **Activar GitHub Pages.** En el repositorio: **Settings** → **Pages** →
   en *Source* elige **Deploy from a branch** → rama `main`, carpeta `/ (root)`
   → **Save**.

4. **Obtener el enlace.** En 1–2 minutos aparecerá arriba:
   `https://TU-USUARIO.github.io/flores-amarillas/`
   Ese es el enlace que le envías.

5. **Probarlo.** Ábrelo en tu teléfono antes de enviárselo. Si ves la versión
   vieja, recarga con la caché limpia o espera un minuto más.

6. **Cambios posteriores:** guarda, haz **Commit** y **Sync/Push**.
   La página se actualiza sola.

### Alternativas
- **Netlify Drop** (netlify.com/drop): arrastras la carpeta al navegador y te
  da un enlace al instante. Sin cuenta, sin Git. Lo más rápido.
- **Vercel**: importas el repositorio de GitHub y publica solo.

Todo funciona como sitio estático: no necesitas ningún servidor.

---

## 5. Cómo está pensada la experiencia

| Segundo | Qué ocurre |
|---|---|
| 0 – 1 | El fondo, el césped y las luces aparecen. |
| 0,7 – 8,4 | Nacen las flores una por una: brote → tallo → hojas → capullo → pétalos → centro. |
| desde ~6 | Cada flor empieza su brisa, con amplitud y ritmo propios. |
| 8,8 | Aparece la fotografía. |
| 10,2 | Aparece el mensaje. |
| 11,6 | Aparece "Feliz día de las flores amarillas". |
| 12,7 | Aparece el botón "Haz crecer una flor". |

Si el teléfono tiene activada la reducción de movimiento, todo aparece con
fundidos suaves y sin animaciones largas.
