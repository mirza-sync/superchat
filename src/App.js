import './App.css';
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import ChatRoom from './components/ChatRoom';

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

const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
  }

  return (
    <button onClick={signInWithGoogle}>Sign in with Google</button>
  )
}

function App() {
  const [user, loading, error] = useAuthState(auth)

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
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

export default App;
