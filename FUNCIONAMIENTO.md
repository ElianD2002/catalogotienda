# Guía de Funcionamiento del Sistema — Chicharronera Tío Jaime 🐷🔥

Este documento describe la arquitectura, flujo de datos, componentes clave y el flujo de desarrollo de la página de aterrizaje (landing page) de la **Chicharronera Tío Jaime** en Olanchito, Yoro, Honduras.

---

## 1. Arquitectura General y Tecnologías

El sitio web está diseñado con un enfoque moderno de rendimiento extremo, optimización SEO y facilidad de edición para el usuario administrador. Las tecnologías principales son:

*   **Astro (v6):** Framework de frontend web enfocado en la velocidad. Utiliza renderizado estático por defecto (generando HTML puro sin sobrecarga de JavaScript innecesario), lo que asegura tiempos de carga ultrarrápidos en dispositivos móviles.
*   **Tina CMS (v3):** Sistema de Gestión de Contenidos (CMS) Git-based. Los administradores editan los datos en una interfaz visual amigable y los cambios se guardan directamente como archivos JSON estructurados en el repositorio Git.
*   **Tailwind CSS (v4) con `@tailwindcss/vite`:** Framework de diseño y estilos. Permite un diseño altamente responsivo y rápido de construir. Incorpora una paleta de colores personalizada de tonos cálidos y de fuego (`warm` y `fire`) configurada en el tema base.
*   **Vite:** Herramienta de compilación integrada que empaqueta y optimiza los recursos de forma ultraeficiente.

---

## 2. Flujo de Datos del Sistema

El flujo de información desde la edición del contenido hasta que el usuario final lo visualiza funciona de la siguiente manera:

```mermaid
graph TD
    A[Administrador en Tina Admin UI] -- Edita texto/productos/precios --> B[Tina CMS Local/Cloud]
    B -- Guarda cambios automáticamente en --> C[content/landing/menu.json]
    C -- Proceso de Compilación de Astro --> D[Astro Compilador (HTML Estático)]
    D -- Sirve el sitio optimizado a --> E[Usuario Final (Navegador)]
    E -- Click en Pedir --> F[WhatsApp API con mensaje predefinido]
```

1.  **Edición:** El administrador accede a la ruta `/admin` en su navegador.
2.  **Persistencia:** Al guardar cambios en la interfaz del CMS, Tina escribe la información directamente en el archivo centralizado `content/landing/menu.json`.
3.  **Compilación (Build):** Astro lee el archivo JSON en tiempo de compilación para generar un sitio estático estricto.
4.  **Entrega:** El servidor web sirve archivos HTML, CSS e imágenes ultraligeros.

---

## 3. Estructura del Proyecto

A continuación se detalla la función de cada carpeta y archivo clave en el espacio de trabajo:

```text
chicharronera-landing/
├── content/
│   └── landing/
│       └── menu.json          # Archivo JSON que almacena todo el contenido dinámico del sitio
├── public/
│   ├── images/                # Carpeta de imágenes cargadas (Logo, fotos de comida, etc.)
│   └── admin/                 # Assets autogenerados por Tina CMS para el panel de administración
├── src/
│   ├── pages/
│   │   └── index.astro        # Página principal (Landing Page) que lee el JSON y renderiza el HTML
│   └── styles/
│       └── global.css         # Estilos globales y configuración del tema Tailwind CSS v4
├── tina/
│   ├── config.ts              # Configuración de esquemas, campos y validaciones de Tina CMS
│   └── __generated__/         # Archivos internos autogenerados por el compilador de Tina
├── package.json               # Dependencias del proyecto y scripts de ejecución
└── tsconfig.json              # Configuración del entorno TypeScript
```

---

## 4. Modelado y Gestión de Datos (Tina CMS)

El esquema de datos definido en `tina/config.ts` estructura el contenido de la landing page en los siguientes bloques principales dentro del archivo `menu.json`:

### Variables Generales
*   **Título del Hero:** Nombre principal del negocio (Ej. `"Chicharronera Tio Jaime"`).
*   **Subtítulo del Hero:** Descripción comercial o eslogan.
*   **WhatsApp:** Número telefónico de contacto en formato internacional (Ej. `50499308743`).
*   **Redes Sociales:** Enlaces directos a Facebook e Instagram.
*   **Descripción SEO:** Meta-descripción para optimizar el posicionamiento en motores de búsqueda como Google.

### Colección de Puntos de Venta (Ubicaciones)
Permite listar múltiples locales o puntos de distribución físicos. Cada ubicación tiene:
*   `nombre`: Nombre del punto de venta.
*   `direccion`: Dirección física legible.
*   `mapsUrl`: Enlace directo a Google Maps para facilitar la navegación GPS.

### Catálogo de Productos
Colección de alimentos u otros elementos a la venta. Cada producto contiene:
*   `nombre`: Nombre del platillo o producto.
*   `precio`: Texto libre con el precio y unidad (Ej. `"Lps. 240 / libra"`).
*   `imagen`: Ruta a la imagen del producto (ej. `/images/chicharron.webp`).
*   `disponible_hoy` (Sí/No): Interruptor para mostrar u ocultar el producto en el menú del día.
*   `categoria`: Indica si el producto pertenece a:
    *   `Fijo (Siempre hay)`: Productos cotidianos disponibles en cualquier momento (sección *Siempre Fresco*).
    *   `Actividad (Asados/Eventual)`: Platillos especiales de fines de semana o eventos (sección *¡Solo por Hoy!*).

---

## 5. Lógica del Frontend (`src/pages/index.astro`)

La landing page se construye dinámicamente usando componentes nativos de Astro e incluye varias características interactivas clave:

### Clasificación Dinámica
Astro filtra los productos del catálogo JSON en dos arreglos:
1.  **Asados de Hoy:** Productos cuya categoría es `Actividad (Asados/Eventual)` y que tienen el interruptor `disponible_hoy` activo. Si no hay productos activos en esta lista, se muestra automáticamente un banner animado de *"Hoy no tenemos asados disponibles"* invitando a los clientes a consultar vía WhatsApp.
2.  **Siempre Fresco:** Productos estables de categoría `Fijo (Siempre hay)` que están activos como `disponible_hoy`.

### Enlaces Inteligentes de Compra (WhatsApp)
Cada tarjeta de producto cuenta con un botón **"Pedir"**. Este botón calcula dinámicamente un enlace que redirige al usuario al chat de WhatsApp con el número del negocio, incluyendo un mensaje automatizado y personalizado:
```text
https://wa.me/[Teléfono]?text=Hola!%20Me%20interesa%20pedir:%20[Nombre%20del%20Producto].%20Esta%20disponible?
```

### Visualizador de Imágenes Inteligente (Lightbox)
Para evitar la carga lenta de galerías complejas en dispositivos móviles, se implementó un sistema de Lightbox ultraligero escrito en Vanilla JavaScript:
*   **Comportamiento:** Al pulsar la miniatura de cualquier producto, se abre una ventana modal a pantalla completa con fondo oscurecido y desenfoque (`backdrop-blur`).
*   **Accesibilidad y Usabilidad:**
    *   Muestra el nombre del platillo en la parte inferior.
    *   Permite cerrar haciendo clic fuera de la imagen o tocando el botón de cierre.
    *   Permite cerrar pulsando la tecla `Escape` en computadoras.
    *   Previene el desplazamiento de la página de fondo (`overflow: hidden`) mientras está abierto.

---

## 6. Flujo de Desarrollo Local

Si deseas correr el proyecto localmente para realizar pruebas o modificar el diseño, sigue estos pasos:

### 1. Iniciar Servidor de Desarrollo
Ejecuta el siguiente comando en la terminal:
```bash
npm run dev
```
Este comando arranca simultáneamente:
*   El servidor de desarrollo local de Astro en [http://localhost:4321](http://localhost:4321).
*   El servidor local de Tina CMS en [http://localhost:4321/admin](http://localhost:4321/admin).

### 2. Guardar Cambios en Producción
Para compilar una versión estática optimizada para producción lista para subir a tu hosting:
```bash
npm run build
```
Esto generará los archivos finales en la carpeta `/dist`.
