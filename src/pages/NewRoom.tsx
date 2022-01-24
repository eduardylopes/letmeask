import { Link, useHistory } from 'react-router-dom'
import { FormEvent, useState } from 'react';

import { Button } from "../components/Button";

import '../styles/auth.scss'
import illustrationImg from '../assets/images/illustration.svg'
import logoImg from '../assets/images/logo.svg'

import { ref, set, push } from 'firebase/database';
import { database } from '../services/firebase';
import { useAuth } from '../hooks/useAuth';


export function NewRoom() {
  const { user } = useAuth()
  const [newRoom, setNewRoom] = useState('')
  const history = useHistory()

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() == '') {
      return
    }

    const roomRef = push(ref(database, '/rooms'))

    const firebaseRoom = await set(roomRef, {
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/admin/rooms/${roomRef.key}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask Logotipo" />
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
              type="text" 
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>Quer entrar em uma sala existente? <Link to="/" >clique aqui</Link></p>
        </div>
      </main>
    </div>
  );
}