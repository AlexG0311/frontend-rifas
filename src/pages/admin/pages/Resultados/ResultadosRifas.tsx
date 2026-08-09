import React, { useEffect, useState } from 'react';
import { useRifas } from '../Rifas/hooks/useRifas';
import { useLoterias } from '../Rifas/hooks/useLoterias';
import {
  useRegistrarSorteoRifa,
  useDeclararGanador,
  useGanadorRifa,
  useResultadoRifa,
} from './hooks/useResultados';
import type { RegistrarSorteoPayload} from '../../types/resultado.type';
import { AlertBanner } from './components/AlertBanner';
import { RifaSelector } from './components/RifaSelector';
import { SorteoRegistrationCard } from './components/SorteoRegistrationCard';
import { ResultadoOficialCard } from './components/ResultadoOficialCard';
import { GanadorCard } from './components/GanadorCard';
import {
  getInitialSorteoForm,
  type SorteoFormData,
} from './components/resultadosRifas.types';


const formatDateToInputValue = (value: string | Date | undefined): string => {
  if (!value) return '';
  // Si es un string en formato ISO ("2026-08-16T00:00:00.000Z"), extraemos directo la fecha
  if (typeof value === 'string' && value.includes('T')) {
    return value.split('T')[0]; // Retorna exactamente "2026-08-16"
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  // Usamos métodos UTC en lugar de los métodos locales
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeResultValue = (value?: string | number | null): string => {
  if (value === null || value === undefined || value === '') return '';
  return String(value);
};

const getResultadoPreview = (rifa: { resultado_loteria?: { numeroGanador?: string | number | null; serie?: string | number | null } | null; resultado_rifa?: { serie?: string | number | null } | null } | undefined) => ({
  
  
  numeroGanador: normalizeResultValue(rifa?.resultado_loteria?.numeroGanador) || 
                 normalizeResultValue(rifa?.resultado_rifa?.serie) || '',


  serie: normalizeResultValue(rifa?.resultado_loteria?.serie) || 
         normalizeResultValue(rifa?.resultado_rifa?.serie) || '',
});

export default function ResultadosRifas() {
  const [selectedRifaUuid, setSelectedRifaUuid] = useState<string>('');
  const [sorteoForm, setSorteoForm] = useState<SorteoFormData>(getInitialSorteoForm());
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { rifas, isLoading: rifasLoading } = useRifas(); // crear uno aparte.
  const { loterias, isLoading: loteriasLoading } = useLoterias();
  const { registrar, resultado: sorteoResult, isLoading: sorteoLoading, error: sorteoError, reset: resetSorteo } = useRegistrarSorteoRifa();
  const { declarar, ganador: ganadorDeclarado, isLoading: ganadorLoading, error: ganadorError,sinGanador, reset: resetGanador } = useDeclararGanador();
  const { resultado: resultadoOficial, isLoading: resultadoLoading, loadResultado } = useResultadoRifa(selectedRifaUuid);
  const { ganador: ganadorPublico, isLoading: ganadorPubLoading, loadGanador } = useGanadorRifa(selectedRifaUuid);

  const selectedRifa = rifas.find((r) => r.uuidPublico === selectedRifaUuid);

  useEffect(() => {
    if (!selectedRifa) return;

    const resultadoPreview = getResultadoPreview(selectedRifa);
    const idLoteria = selectedRifa.idLoteria ?? selectedRifa.loteria?.idLoteria ?? 0;

    setSorteoForm((prev) => ({
      ...prev,
      idLoteria,
      fechaSorteo: formatDateToInputValue(selectedRifa.fechaSorteo),
      numeroGanador: prev.numeroGanador || normalizeResultValue(resultadoPreview.numeroGanador) || normalizeResultValue(resultadoOficial?.numeroGanador) || normalizeResultValue(resultadoOficial?.loteria?.numeroGanador) || '',
      serie: prev.serie || normalizeResultValue(resultadoPreview.serie) || normalizeResultValue(resultadoOficial?.serie) || normalizeResultValue(resultadoOficial?.loteria?.serie) || '',
    }));
  }, [selectedRifa, resultadoOficial?.numeroGanador, resultadoOficial?.serie, resultadoOficial?.loteria?.numeroGanador, resultadoOficial?.loteria?.serie]);

  const handleSelectRifa = (uuid: string) => {
    const selected = rifas.find((r) => r.uuidPublico === uuid);
    console.log('Rifa seleccionada:', selected);

    const idLoteria = selected?.idLoteria ?? selected?.loteria?.idLoteria ?? 0;

    setSelectedRifaUuid(uuid);
    setSorteoForm({
      ...getInitialSorteoForm(),
      idLoteria,
      fechaSorteo: formatDateToInputValue(selected?.fechaSorteo),
    });



    setFormError(null);
    setSuccessMessage(null);
    resetSorteo();
    resetGanador();
  
  };

  const handleSorteoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSorteoForm((prev) => ({
      ...prev,
      [name]: name === 'idLoteria' ? Number(value) : value,
    }));
  };


  const handleRegistrarSorteo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRifaUuid) {
      setFormError('Selecciona una rifa primero');
      return;
    }
    const idLoteria = sorteoForm.idLoteria || selectedRifa?.idLoteria || selectedRifa?.loteria?.idLoteria || 0;

    if (!idLoteria) {
      setFormError('Selecciona una lotería');
      return;
    }
    if (!sorteoForm.numeroManual.trim()) {
      setFormError('El número manual es requerido');
      return;
    }

    setFormError(null);
    setSuccessMessage(null);

    const payload: RegistrarSorteoPayload = {
      idLoteria,
      fechaSorteo: sorteoForm.fechaSorteo,
      numeroGanador: sorteoForm.numeroGanador,
      ...(sorteoForm.serie.trim() && { serie: sorteoForm.serie }),
      ...(sorteoForm.numeroManual.trim() && { numeroManual: sorteoForm.numeroManual }),
    };

    const result = await registrar(selectedRifaUuid, payload);
    if (result) {
      setSuccessMessage(
        result.rifaSorteada
          ? 'Sorteo registrado — la rifa fue marcada como SORTEADA'
          : 'Sorteo registrado correctamente'
      );
      loadResultado();
    }
  };

  const handleDeclararGanador = async () => {
    if (!selectedRifaUuid) return;
    if (!window.confirm('¿Estás seguro de declarar el ganador de esta rifa?')) return;

    setSuccessMessage(null);

    const result = await declarar(selectedRifaUuid);
    if (result) {
      setSuccessMessage(`¡Ganador declarado! ${result.cliente.nombre} con el número ${result.numeroGanador}`);
      loadGanador();
    }
  };

  const currentError = formError || sorteoError || ganadorError;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Resultados por Rifa
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Gestiona el ciclo completo de sorteo de una rifa: registrar resultado, declarar ganador y gestionar la entrega del premio.
          </p>
        </div>

        {currentError && <AlertBanner type="error" message={currentError} />}
        {successMessage && <AlertBanner type="success" message={successMessage} />}

        <RifaSelector
          rifas={rifas}
          rifasLoading={rifasLoading}
          selectedRifaUuid={selectedRifaUuid} // obtenemo la id de la rifa
          selectedRifa={selectedRifa} // traemos la rifa seleccionada
          onSelectRifa={handleSelectRifa} // cambia el valor dependiendo la seleccion de la rifa
        />

        {selectedRifaUuid && (
          <>
            <SorteoRegistrationCard
              form={sorteoForm}
              onChange={handleSorteoChange}
              onSubmit={handleRegistrarSorteo}
              loterias={loterias}
              loteriasLoading={loteriasLoading}
              sorteoLoading={sorteoLoading}
              sorteoResult={sorteoResult}
              selectedRifa={selectedRifa}
              resultadoOficial={resultadoOficial}
            />

            <ResultadoOficialCard
              resultado={resultadoOficial}
              resultadoLoading={resultadoLoading}
              onRefresh={() => loadResultado()}
            />

           <GanadorCard
              ganadorPublico={ganadorPublico}
              ganadorDeclarado={ganadorDeclarado}
              ganadorPubLoading={ganadorPubLoading}
              ganadorLoading={ganadorLoading}
              onDeclararGanador={handleDeclararGanador}
              sinGanador={sinGanador}
            />

      
          </>
        )}
      </div>
    </div>
  );
}
