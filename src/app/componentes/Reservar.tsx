"use client";

import React, { useState, useEffect } from 'react';
import { IRoom } from '@/models/Room';
import { IReserva } from '@/models/Reserva';
import './ReservarSala.module.css';

const getHojeFormatado = () => {
  return new Date().toISOString().split('T')[0];
};
const formatarHora = (data: Date) => {
  return new Date(data).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC'
  });
}
interface ReservarSalaProps {
  onReservaSucesso: () => void; 
}

export default function ReservarSala({ onReservaSucesso }: ReservarSalaProps) {
  const [salaSelecionada, setSalaSelecionada] = useState('');
  const [data, setData] = useState(getHojeFormatado());
  const [horaInicio, setHoraInicio] = useState('09:00');
  const [horaFim, setHoraFim] = useState('10:00');
  const [salas, setSalas] = useState<IRoom[]>([]);
  const [reservasDoDia, setReservasDoDia] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSalas = async () => {
    try {
      const response = await fetch("/api/rooms");
      const data: IRoom[] = await response.json();
      setSalas(data);
      if (data.length > 0) {
        const firstId = String(data[0]._id ?? '');
        setSalaSelecionada(firstId);
      }
    } catch (err) {
      setError('Falha ao carregar salas.');
    }
  };

  const fetchReservasDoDia = async (dataSelecionada: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/reservas?data=${dataSelecionada}`);
      const data: IReserva[] = await response.json();
      setReservasDoDia(data);
    } catch (err) {
      setError('Falha ao carregar reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalas();
  }, []);
  useEffect(() => {
    fetchReservasDoDia(data);
  }, [data]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const dataInicioISO = `${data}T${horaInicio}:00`;
    const dataFimISO = `${data}T${horaFim}:00`;

    try {
      const response = await fetch('/api/reservas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sala: salaSelecionada,
          dataInicio: dataInicioISO,
          dataFim: dataFimISO,
        }),
      });
      const resData = await response.json();
      if (response.status === 409) { throw new Error(resData.message); }
      if (!response.ok) { throw new Error(resData.message || 'Erro ao criar reserva.'); }

      setSuccess('Reserva criada com sucesso!');
      fetchReservasDoDia(data);
      onReservaSucesso();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="booking-container">
      <section className="form-section">
        <h2>Fazer uma Reserva:</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="sala">Sala:</label>
            <select
              id="sala"
              value={salaSelecionada}
              onChange={(e) => setSalaSelecionada(e.target.value)}
              required
            >
              {salas.map((s) => (
                <option key={String(s._id)} value={String(s._id)}>
                  {s.nome} (Cap: {s.capacidade})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="data">Data:</label>
            <input id="data" type="date" value={data} onChange={(e) => setData(e.target.value)} required />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="horaInicio">Hora Início:</label>
              <input id="horaInicio" type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="horaFim">Hora Fim:</label>
              <input id="horaFim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} required />
            </div>
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Reservando...' : 'Reservar Sala'}
          </button>

          {success && <p className="message success">{success}</p>}
          {error && <p className="message error">{error}</p>}
        </form>
      </section>

      <section className="availability-section">
        <h3>Disponibilidade para {new Date(data + 'T00:00:00').toLocaleDateString('pt-BR')}</h3>

        {loading && <p className="message info">Carregando horários...</p>}

        {reservasDoDia.length === 0 && !loading && (
          <p className="message info">Todas as salas estão livres neste dia!</p>
        )}

        <ul className="availability-list">
          {reservasDoDia.map((res) => (
            <li key={res._id.toString()} className="booking-item">
              <strong className="room-name">{res.room.nome}</strong>
              <span className="booking-details"> 
                Ocupada das <strong>{formatarHora(res.dataInicio)}</strong> às <strong>{formatarHora(res.dataFim)}</strong> por {res.usuario.nome}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}