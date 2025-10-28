"use client";

import React from 'react';
import GerenciadorSalas from './GerenciadorSalas';
import LogoutButton from './Logout';
import styles from './UserDashboard.module.css';
import GerenciadorReservasAdmin from './ReservasAdmin'; 

export default function AdminDashboard() {
  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <LogoutButton />

      <h1>Painel do Administrador</h1>
      <hr style={{ margin: '2rem 0' }} />

      <GerenciadorSalas />

      <GerenciadorReservasAdmin />
    </div>
  );
}