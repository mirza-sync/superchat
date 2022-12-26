import './App.css';
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { addDoc, collection, getFirestore, limit, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyA8LH5sMT-UhFk7aIBUp_S3bH4IxB8pypI",
  authDomain: "superchat-90289.firebaseapp.com",
  projectId: "superchat-90289",
  storageBucket: "superchat-90289.appspot.com",
  messagingSenderId: "608476507437",
  appId: "1:608476507437:web:5ac54814101f62827bf7a4",
  measurementId: "G-VCZVRL3HF8",
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app);

function App() {
  const [user, authLoad, authError] = useAuthState(auth)

  if (authLoad) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }

  if (authError) {
    return (
      <div>
        <p>Error: {authError}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>Super Chat</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

const SignOut = () => {
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

const ChatRoom = () => {
  const messagesRef = collection(db, "messages")
  const [messages, loading, error] = useCollection(query(messagesRef, orderBy('createdAt'), limit(25)))
  const [formValue, setFormValue] = useState('')

  const sendMessage = async (e) => {
    const { uid, photoURL } = auth.currentUser

    e.preventDefault()
    try {
      await addDoc(messagesRef, {
        text: formValue,
        createdAt: serverTimestamp(),
        uid,
        photoURL,
      })
    } catch (error) {
      console.log('Failed to send message: ', error)
    }
    setFormValue('')
  }

  if (error) {
    console.log('Error', error)
  }

  if (loading) {
    return 'Loading...'
  }

  return (
    <>
      {
        messages ? (
          messages.docs.map((doc) => (
            <div key={doc.id}>
              <ChatMessage uid={doc.id} message={doc.data()} />
            </div>
          ))
        ) : (
          'No message found'
        )
      }
      <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type='submit'>Send</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const { uid, message } = props

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received'

  return (
    <div className={`message ${messageClass}`}>
      <img
        src={message.photoURL || 'https://picsum.photos/seed/picsum/200/200'} alt='user'
        referrerPolicy='no-referrer'
      />
      <p>{message.text}</p>
    </div>
  )
}

export default App;
