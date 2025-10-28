"use client"; 

import { useRouter } from 'next/navigation';
import React from 'react';

// Estilo CSS para o botão 
const buttonStyle: React.CSSProperties = {
    position: 'absolute',
    top: '1rem',
    right: '1rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#555',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600'
};

export default function LogoutButton() {
    const router = useRouter(); 

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/usuarios/logout', {
                method: 'POST',
            });

            if (response.ok) {
                router.push('/login');
            } else {
                console.error('Falha no logout');
            }
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <button onClick={handleLogout} style={buttonStyle}>
            Logout
        </button>
    );
}