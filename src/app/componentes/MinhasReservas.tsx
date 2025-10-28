"use client";

import React, { useState, useEffect } from "react";
import styles from './MinhasReservas.module.css';

interface MinhaReserva {
  _id: string;
  dataInicio: string;
  dataFim: string;
  room: {
    _id: string;
    nome: string; 
  };
}

const formatarDataHora = (data: string) => {
  return new Date(data).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC", 
  });
};

interface MinhasReservasProps {
  refreshTrigger: number;
}

export default function MinhasReservas({ refreshTrigger }: MinhasReservasProps) {
  const [reservas, setReservas] = useState<MinhaReserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchMinhasReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch("/api/reservas/minhas");
      if (!response.ok) throw new Error("Falha ao buscar suas reservas");

      const data: MinhaReserva[] = await response.json();
      setReservas(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMinhasReservas();
  }, [refreshTrigger]);

  const handleCancelar = async (reservaId: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`/api/reservas/${reservaId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Falha ao cancelar");

      setSuccess("Reserva cancelada com sucesso!");
      fetchMinhasReservas();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.card}>
      <h2>Minhas Reservas</h2>
      {loading && <p>Carregando...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}

      {reservas.length === 0 && !loading && (
        <p>Você não possui reservas ainda</p>
      )}
      <ul className={styles.list}>
        {reservas.map((res) => (
          <li
            key={res._id.toString()} 
            className={styles.listItem}
          >
            <div className={styles.info}>
              <strong>Sala: {res.room.nome}</strong> 
              <p>De: {formatarDataHora(res.dataInicio)}</p>
              <p>Até: {formatarDataHora(res.dataFim)}</p>
            </div>
            <button
              onClick={() => handleCancelar(res._id.toString())} 
              disabled={loading}
              className={styles.cancelButton}
            >
              Cancelar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}