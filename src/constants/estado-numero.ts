
export const ESTADO_NUM_CONFIG = {
  DISPONIBLE: {
    label: "Disponible",
    className:
      "bg-base-100 border border-success text-base-content hover:bg-success hover:text-success-content hover:border-success hover:scale-110 cursor-pointer",
  },

  RESERVADO: {
    label: "Reservado",
    className:
      "bg-warning/20 border border-warning text-warning cursor-not-allowed",
  },

  VENDIDO: {
    label: "Vendido",
    className:
      "bg-error/20 border border-error text-error line-through cursor-not-allowed",
  },

  SELECCIONADO: {
    label: "Seleccionado",
    className:
      "bg-info border border-info text-info-content shadow-lg scale-105 ring-2 ring-info/50 hover:bg-info hover:brightness-110 cursor-pointer",
},
} as const;