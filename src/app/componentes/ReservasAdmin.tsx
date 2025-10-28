"use client";

import React, { useState, useEffect } from 'react';
import styles from './MinhasReservas.module.css'; 

const getHojeFormatado = () => {
    return new Date().toISOString().split('T')[0];
};

// formatar Data e Hora
const formatarDataHora = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: 'UTC' 
    });
};

export default function GerenciadorReservasAdmin() {
    const [reservas, setReservas] = useState<any[]>([]);
    const [data, setData] = useState(getHojeFormatado());

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Função para BUSCAR TODAS as reservas de um dia 
    const fetchTodasReservas = async (dataSelecionada: string) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // A API é a mesma que o usuário usa para ver disponibilidade
            const response = await fetch(`/api/reservas?data=${dataSelecionada}`);
            if (!response.ok) throw new Error('Falha ao buscar reservas');

            const data = await response.json();
            setReservas(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Efeito para buscar ao carregar e ao mudar a data 
    useEffect(() => {
        fetchTodasReservas(data);
    }, [data]); // Roda toda vez que o admin mudar a data

    // Função para CANCELAR 
    const handleCancelar = async (reservaId: string) => {
        if (!confirm('ADMIN: Tem certeza que deseja cancelar esta reserva?')) {
            return;
        }

        try {
            setLoading(true);
            // A API é a mesma, o middleware vai ver que é Admin e permitir
            const response = await fetch(`/api/reservas/${reservaId}`, {
                method: 'DELETE',
            });

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || 'Falha ao cancelar');

            setSuccess('Reserva cancelada pelo Admin!');
            fetchTodasReservas(data); // Atualiza a lista do dia

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className={styles.card} style={{ marginTop: '2rem' }}>
            <h2>Gerenciar Reservas</h2>

            <div style={{ margin: '1rem 0' }}>
                <label htmlFor="dataAdmin" style={{ marginRight: '1rem' }}>Ver reservas do dia:</label>
                <input
                    id="dataAdmin"
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
            </div>

            {loading && <p>Carregando reservas...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            {reservas.length === 0 && !loading && (
                <p>Nenhuma reserva encontrada para este dia.</p>
            )}

            <ul className={styles.list}>
                {reservas.map((res) => (
                    <li key={res._id} className={styles.listItem}>
                        <div className={styles.info}>
                            <p><strong>Usuário: {res.usuario.nome}</strong> ({res.usuario.email})</p>
                            <p><strong>Sala: {res.room.name}</strong></p>
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