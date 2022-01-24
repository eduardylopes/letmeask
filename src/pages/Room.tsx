import { ref, push, set, remove } from 'firebase/database';
import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useParams } from 'react-router-dom'
import { BiLike } from 'react-icons/bi'

import logoImg from '../assets/images/logo.svg'
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';

import "../styles/room.scss"


type RoomParams = {
  id: string;
}

export function Room() {
  const history = useHistory()

  const { user } = useAuth();
  const params = useParams<RoomParams>();
  const [newQuestion, setNewQuestion] = useState('');
  const roomId = params.id;
  const { title, questions } = useRoom(roomId)

  async function handleSendQuestion(event: FormEvent) {
    event.preventDefault();

    if (newQuestion.trim() == '') {
      return;
    }

    if (!user) {
      throw new Error('You must be logged in')
    }

    const question = {
      content: newQuestion,
      author: {
        name: user.name,
        avatar: user.avatar,
      },
      isHighlighted: false,
      isAnswered: false
    }

    const questionRef = ref(database, `rooms/${roomId}/questions`)
    const questionId =  await push(questionRef)
    await set(questionId, question)
    setNewQuestion('')

  }

  async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
    if (likeId) {
      const newLikeRef = await ref(database, `rooms/${roomId}/questions/${questionId}/likes/${likeId}`)
      remove(newLikeRef)

    } else {
      const newLikeRef = await ref(database, `rooms/${roomId}/questions/${questionId}/likes`)
      const newLikeId = await push(newLikeRef)
      await set(newLikeId, {
        authorId: user?.id
      })
    }
  }

  function handleGoHome() {
    history.push('/')
  }

  return (
    <div id="page-room">
      <Toaster />
      <header>
        <div className="content">
          <button onClick={handleGoHome}>
           <img src={logoImg} alt="Letmeask Logo" />
          </button>
          <RoomCode code={roomId} />
        </div>
      </header>
      <main className="content">
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && 
            <span>{questions.length} pergunta(s)</span>
          }
        </div>

        <form onSubmit={handleSendQuestion}>
          <textarea 
            placeholder="O que você quer perguntar?"
            onChange={event => setNewQuestion(event.target.value)}
            value={newQuestion}
          />

          <div className="form-footer">
            { user ? (
              <div className="user-info">
                <img src={user.avatar} alt={user.name} />
                <span>{user.name}</span>
              </div>
            ) : (
              <span>Para enviar uma pergunta, <button>faça seu login.</button></span>
            ) }
            <Button type="submit" disabled={!user}>Enviar pergunta</Button>
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
                    className={`like-button ${question.likeId && 'liked'}`}
                    type="button"
                    aria-label="Marcar como gostei"
                    onClick={() => handleLikeQuestion(question.id, question.likeId)}
                  >
                    { question.likeCount > 0 && 
                      <span>{question.likeCount}</span>
                    }
                    <BiLike className="like-icon" />
                  </button>
                </Question>
              )
            })}
          </div>
        </form>
      </main>
    </div>
  );
}