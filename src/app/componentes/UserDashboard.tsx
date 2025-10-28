"use client";

import React, { useState } from 'react';
import ReservarSala from './Reservar';
import MinhasReservas from './MinhasReservas';
import styles from './UserDashboard.module.css';
import LogoutButton from './Logout';

export default function UserDashboard() {

  const [refreshKey, setRefreshKey] = useState(0);

  const handleReservaSucesso = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className={styles.container} style={{ position: 'relative' }}>
      <LogoutButton />
      <h1>Reserva de Salas</h1>
      <div className={styles.layout}>
        <ReservarSala onReservaSucesso={handleReservaSucesso} />
      </div>
      <MinhasReservas refreshTrigger={refreshKey} />
    </div>
  );
}