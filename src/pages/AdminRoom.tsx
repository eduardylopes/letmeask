import { Toaster } from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom'
import { AiOutlineDelete } from 'react-icons/ai'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import "../styles/room.scss"
import { database } from '../services/firebase';
import { ref, remove, update } from 'firebase/database';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
    const questionRef = ref(database, `rooms/${roomId}`)
    await update(questionRef, {
      endedAt: new Date()
    })

    history.push('/')
  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm('Você tem certeza que deseja excluir esta pergunta?')) {
      const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
      const removeQuestion = await remove(questionRef)
    }
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask Logo" />
          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutlined
              onClick={handleEndRoom}
            >Encerrar sala</Button>
          </div>
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && 
            <span>{questions.length} pergunta(s)</span>
          }
        </div>
        <div className="question-list">
          { questions.map(question => {
            return (
              <Question 
                key={question.id}
                content={question.content} 
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                <AiOutlineDelete className="like-icon" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}