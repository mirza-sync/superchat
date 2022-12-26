import './App.css';
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import { collection, getFirestore } from 'firebase/firestore';

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
      <header className="App-header">
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
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

const ChatRoom = () => {
  // const querySnapshot = await getDocs(collection(db, "message"));
  const [messages, loading, error] = useCollection(collection(db, "message"))

  if (error) {
    console.log('Error', error)
  }

  if (loading) {
    return 'Loading...'
  }

  if (messages) {
    return (
      messages.docs.map((doc) => (
        <ChatMessage uid={doc.id} message={doc.data()} />
      ))
    )
  } else {
    return 'No message found'
  }
}

export default App;
