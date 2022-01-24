import { Toaster } from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom'
import { AiOutlineCheckCircle, AiOutlineDelete, AiOutlineMessage } from 'react-icons/ai'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useRoom } from '../hooks/useRoom';

import "../styles/room.scss"
import { database } from '../services/firebase';
import { child, get, ref, remove, update } from 'firebase/database';
import { BiExit } from 'react-icons/bi';

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  const history = useHistory()
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  function handleGoHome() {
    history.push('/')
  }

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
      await remove(questionRef)
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    const isAnsweredRef = ref(database, `rooms/${roomId}/questions/${questionId}/isAnswered`)
    const isAnsweredPromisse = await get(isAnsweredRef)

    await update(questionRef, {
      isAnswered: !isAnsweredPromisse.val()
    })
  }

  async function handleHighlightQuestion(questionId: string) {
    const questionRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    const isHighlightedRef = ref(database, `rooms/${roomId}/questions/${questionId}/isHighlighted`)
    const isHighlightedPromisse = await get(isHighlightedRef)

    await update(questionRef, {
      isHighlighted: !isHighlightedPromisse.val()
    })
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <button className="logo" onClick={handleGoHome}>
            <img src={logoImg} alt="Letmeask Logo" />
          </button>
          <div>
            <RoomCode code={roomId} />
            <Button 
              isOutlined
              onClick={handleEndRoom}
            >
              <BiExit className='exit-button'/>
              <span className='exit-description'>Encerrar sala</span>
            </Button>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                
                <button
                  type="button"
                  onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  aria-label="Marcar pergunta como respondida"
                >
                <AiOutlineCheckCircle className={`menu-icons ${question.isAnswered ? 'icon-highlighted' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleHighlightQuestion(question.id)}
                  aria-label="Dar destaque a pergunta"
                >
                <AiOutlineMessage className={`menu-icons ${question.isHighlighted ? 'icon-highlighted' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  aria-label="Remover pergunta"
                >
                <AiOutlineDelete className="menu-icons" />
                </button>

              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}