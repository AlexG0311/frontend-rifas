import { useEffect, type RefObject } from "react";

interface UseWidgetParams {
  wompiContainerRef: RefObject<HTMLDivElement | null>;
  totalPrecio: number;
  referencia: string;
  firmaIntegridad: string;
}

export const useWidget = ({
  wompiContainerRef,
  totalPrecio,
  referencia,
  firmaIntegridad,
}: UseWidgetParams) => {



  useEffect(() => {
    if (!wompiContainerRef.current) return;
    if (!referencia || !firmaIntegridad) return; // evita inyectar el script con datos incompletos

    wompiContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", "pub_test_X0zDA9xoKdePzhd8a0x9HAez7HgGO2fH");
    script.setAttribute("data-currency", "COP");
    script.setAttribute("data-amount-in-cents", String(Math.round(totalPrecio * 100)));
    script.setAttribute("data-reference", referencia);
    script.setAttribute("data-signature:integrity", firmaIntegridad);

    wompiContainerRef.current.appendChild(script);

    return () => {
      if (wompiContainerRef.current) {
        wompiContainerRef.current.innerHTML = "";
      }
    };
  }, [wompiContainerRef, totalPrecio, referencia, firmaIntegridad]);
};