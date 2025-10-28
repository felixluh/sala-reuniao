"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
    // Estados para guardar os dados do formulário
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    // Função que será chamada ao clicar no botão "Entrar"
    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        console.log('--- Iniciando tentativa de login ---');

        try {
            const response = await fetch('/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha: password }),
            });

            const data = await response.json();

            // Este log é crucial! Ele vai nos mostrar o status e a resposta.
            console.log('API RESPONDEU:', { status: response.status, data: data });

            if (!response.ok) {
                // Se a resposta não for 'ok', vamos logar o erro e lançá-lo
                console.error('API retornou um erro:', data.message);
                throw new Error(data.message || 'Falha no login.');
            }

            // Se chegou aqui, o login foi um sucesso
            console.log('Login bem-sucedido! Redirecionando...');
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            router.push('/dashboard');

        } catch (err: any) {
            // Se qualquer erro acontecer no bloco 'try', ele será capturado e logado aqui
            console.error('ERRO CAPTURADO NO CATCH:', err);
            setError(err.message);
        }
    };

    return (
        <div className={styles.container}>
            <form className={styles.loginForm} onSubmit={handleSubmit}>
                <h1>Login</h1>
                {error && <p className={styles.errorMessage}>{error}</p>}

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

                <button className={styles.submitBtn} type="submit">Entrar</button>

                <p style={{ marginTop: '1.5rem' }}>
                    Ainda não possui conta? <Link href="/cadastro">Cadastre-se</Link>
                </p>
            </form>
        </div>
    );
}