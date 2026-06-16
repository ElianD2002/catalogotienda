import { defineConfig } from "tinacms";

export default defineConfig({
  // ── Configuración local (sin Tina Cloud) ──
  clientId: "local",
  token: "local",

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },

  media: {
    tina: {
      mediaRoot: "images",
      publicFolder: "public",
    },
  },

  schema: {
    collections: [
      {
        name: "landing",
        label: "Landing Page",
        path: "content/landing",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "tituloHero",
            label: "Título del Hero",
            required: true,
          },
          {
            type: "string",
            name: "subtituloHero",
            label: "Subtítulo del Hero",
            required: true,
          },
          {
            type: "string",
            name: "whatsapp",
            label: "Número de WhatsApp (con código de país, ej: 50499998888)",
            required: true,
          },
          {
            type: "string",
            name: "facebook",
            label: "Enlace de Facebook",
          },
          {
            type: "string",
            name: "instagram",
            label: "Enlace de Instagram",
          },
          {
            type: "string",
            name: "seoDescription",
            label: "Descripción SEO (para Google)",
            ui: {
              component: "textarea",
            },
          },
          {
            type: "object",
            name: "puntosVenta",
            label: "Sucursales / Tiendas",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.nombre || "Nueva Sucursal",
              }),
            },
            fields: [
              {
                type: "string",
                name: "nombre",
                label: "Nombre de la Sucursal",
                required: true,
              },
              {
                type: "string",
                name: "direccion",
                label: "Dirección de la Sucursal",
                required: true,
              },
              {
                type: "string",
                name: "mapsUrl",
                label: "Enlace de Google Maps",
                required: true,
              },
            ],
          },
          {
            type: "object",
            name: "productos",
            label: "Productos del Catálogo",
            list: true,
            ui: {
              itemProps: (item) => ({
                label: item?.nombre
                  ? `${item.nombre} — ${item.disponible_hoy ? "✅" : "❌"}`
                  : "Nuevo Producto",
              }),
            },
            fields: [
              {
                type: "string",
                name: "nombre",
                label: "Nombre del Producto",
                required: true,
              },
              {
                type: "string",
                name: "precio",
                label: "Precio del Artículo (ej: Lps. 350 o $15.00)",
                required: true,
              },
              {
                type: "image",
                name: "imagen",
                label: "Imagen del Producto",
              },
              {
                type: "boolean",
                name: "disponible_hoy",
                label: "¿Disponible en Tienda?",
                ui: {
                  component: "toggle",
                },
              },
              {
                type: "string",
                name: "categoria",
                label: "Categoría del Producto",
                required: true,
                options: [
                  {
                    value: "🔥 ¡Lo Más Vendido!",
                    label: "🔥 ¡Lo Más Vendido! (Tendencia / Novedad)",
                  },
                  {
                    value: "✨ Catálogo Completo",
                    label: "✨ Catálogo Completo (Stock Permanente)",
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
