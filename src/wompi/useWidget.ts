import { useEffect, type RefObject } from "react";
import type { WidgetWompiParams } from "../services/wompi.service";

interface UseWidgetParams {
  wompiContainerRef: RefObject<HTMLDivElement | null>;
  datosPago: WidgetWompiParams;
}

export const useWidget = ({ wompiContainerRef, datosPago }: UseWidgetParams) => {
  useEffect(() => {
    if (!wompiContainerRef.current) return;
    if (!datosPago.reference || !datosPago.signature) return;

    wompiContainerRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://checkout.wompi.co/widget.js";
    script.setAttribute("data-render", "button");
    script.setAttribute("data-public-key", datosPago.publicKey);
    script.setAttribute("data-currency", datosPago.currency);
    script.setAttribute("data-amount-in-cents", String(datosPago.amountInCents));
    script.setAttribute("data-reference", datosPago.reference);
    script.setAttribute("data-signature:integrity", datosPago.signature);
    script.setAttribute("data-redirect-url", datosPago.redirectUrl);

    if (datosPago.customerData) {
      script.setAttribute("data-customer-data:email", datosPago.customerData.email);
      script.setAttribute("data-customer-data:full-name", datosPago.customerData.fullName);
      if (datosPago.customerData.phoneNumber && datosPago.customerData.phoneNumberPrefix) {
        script.setAttribute("data-customer-data:phone-number", datosPago.customerData.phoneNumber);
        script.setAttribute("data-customer-data:phone-number-prefix", datosPago.customerData.phoneNumberPrefix);
      }
      if (datosPago.customerData.legalId) {
        script.setAttribute("data-customer-data:legal-id", datosPago.customerData.legalId);
      }
      if (datosPago.customerData.legalIdType) {
        script.setAttribute("data-customer-data:legal-id-type", datosPago.customerData.legalIdType);
      }
    }

    wompiContainerRef.current.appendChild(script);

    return () => {
      if (wompiContainerRef.current) {
        wompiContainerRef.current.innerHTML = "";
      }
    };
  }, [wompiContainerRef, datosPago]);
};