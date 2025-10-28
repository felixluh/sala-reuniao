import { redirect } from 'next/navigation';

export default function HomePage() {
  // Esta função redireciona o usuário para a sua página de login
  redirect('/login');
}