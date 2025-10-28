"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './cadastro.module.css';

export default function CadastroPage() {
    // Estados para o formulário de cadastro
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const router = useRouter();

    // Função que será chamada ao clicar no botão "Cadastrar"
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await fetch('/api/usuarios/cadastro', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: name,       
                    email: email,
                    senha: password,  
                    funcao: 'user'    
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message || 'Cadastro realizado com sucesso! Redirecionando para login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            } else {
                setError(data.message || 'Falha ao registrar.');
            }
        } catch (err) {
            setError('Não foi possível conectar ao servidor.');
            console.error('Erro de Registro:', err);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.registerForm} onSubmit={handleRegister}>
                <h1>Cadastro</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}
                {success && <p className={styles.successMessage}>{success}</p>}

                <div className={styles.formGroup}>
                    <label htmlFor="name">Nome Completo:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="password">Senha:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className={styles.submitBtn} type="submit">Cadastrar</button>

                <p style={{ marginTop: '1.5rem' }}>
                    Já possui uma conta? <Link href="/login">Faça Login</Link>
                </p>
            </form>
        </div>
    );
}