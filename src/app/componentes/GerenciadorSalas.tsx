"use client";

import React, { useState, useEffect } from 'react';
import { IRoom } from '@/models/Room'; 
import styles from './ReservarSala.module.css';

export default function GerenciadorSalas() {
    const [rooms, setRooms] = useState<IRoom[]>([]);

    // Estados para o formulário
    const [name, setName] = useState('');
    const [capacity, setCapacity] = useState(1);
    const [features, setFeatures] = useState(''); 
    const [editingId, setEditingId] = useState<string | null>(null); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // BUSCAR as salas 
    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/rooms'); 
            if (!response.ok) throw new Error('Falha ao buscar salas');

            const data: IRoom[] = await response.json();
            setRooms(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    //Limpar o formulário 
    const resetForm = () => {
        setName('');
        setCapacity(1);
        setFeatures('');
        setEditingId(null);
    };

    // CRIAR (POST) ou ATUALIZAR (PUT) 
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const listaRecursos = features.split(',').map(r => r.trim()).filter(r => r);

        // Nomes do seu model
        const roomData = {
            name: name,
            capacity: capacity,
            features: listaRecursos
        };

        // Decide se é POST (criar) ou PUT (editar)
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `/api/rooms/${editingId}` : '/api/rooms';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Falha na operação');
            }

            setSuccess(`Sala ${editingId ? 'atualizada' : 'criada'} com sucesso!`);
            resetForm();
            fetchRooms(); // Atualiza a lista

        } catch (err: any) {
            setError(err.message);
        }
    };

    // DELETAR 
    const handleDelete = async (roomId: string) => {
        if (confirm('Tem certeza que deseja deletar esta sala?')) {
            try {
                const response = await fetch(`/api/rooms/${roomId}`, { 
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Falha ao deletar sala');
                }

                setSuccess('Sala deletada com sucesso!');
                fetchRooms(); // Atualiza a lista

            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    // Carregar dados para EDIÇÃO
    const handleEdit = (room: IRoom) => {
        setEditingId(String(room._id)); 
        setName(room.nome);       
        setCapacity(room.capacidade);
        setFeatures(room.recursos.join(', ')); 
    };

    return (
        <section className={styles.card}>
            <h2>Gerenciar Salas</h2>

            <form onSubmit={handleSubmit}>
                <h3>{editingId ? 'Editar Sala' : 'Nova Sala'}</h3>

                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome da Sala:</label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="capacity">Capacidade:</label>
                    <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(parseInt(e.target.value))} min="1" required />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="features">Recursos (separados por vírgula):</label>
                    <input id="features" type="text" value={features} onChange={(e) => setFeatures(e.target.value)} placeholder="ex: projetor, quadro-branco" />
                </div>

                <button type="submit" className={styles.button}>
                    {editingId ? 'Atualizar Sala' : 'Criar Sala'}
                </button>
                {editingId && (
                    <button type="button" onClick={resetForm} style={{ width: '100%', height: '43px', backgroundColor: '#477fb3', border: '1px solid #eee', color: 'white', fontSize: '1rem', fontWeight: '600', borderRadius: '4px', cursor: 'pointer' }}>
                        Cancelar Edição
                    </button>
                )}

                {success && <p className={styles.success}>{success}</p>}
                {error && <p className={styles.error}>{error}</p>}
            </form>

            <hr style={{ margin: '2rem 0' }} />

            <h3>Salas Cadastradas</h3>
            {loading && <p>Carregando salas...</p>}
            <ul>
                {rooms.map((room) => (
                    <li key={String(room._id)} style={{ borderBottom: '1px solid #eee', padding: '1rem 0', }}>
                        <strong>{room.nome}</strong> (Cap: {room.capacidade})

                        <p style={{ margin: '0.25rem 0' }}>Recursos: {room.recursos.join(', ') || 'Nenhum'}</p>

                        <div>
                            <button onClick={() => handleEdit(room)} style={{ marginRight: '0.5rem',}}>
                                Editar
                            </button>
                            <button onClick={() => handleDelete(String(room._id))} style={{ backgroundColor: 'darkred', color: 'white', border: 'none' }}>
                                Deletar
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}