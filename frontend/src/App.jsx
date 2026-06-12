import { useState, useEffect } from 'react'
import keycloak from './keycloak'

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [secureData, setSecureData] = useState(null)

  useEffect(() => {
    // 1. When the app loads, initialize Keycloak
    keycloak.init({ onLoad: 'login-required' }).then((auth) => {
      setAuthenticated(auth)
    })
  }, [])

  // 2. The function to call FastAPI
  const fetchSecureData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/secure', {
        headers: {
          // This is where we attach the JWT to the HTTP Header!
          Authorization: `Bearer ${keycloak.token}` 
        }
      });
      
      if (response.status === 401) {
        setSecureData("FastAPI Bouncer: Get out! Invalid token.");
      } else {
        const data = await response.json();
        setSecureData(data.message);
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  // 3. What the user actually sees on screen
  if (!authenticated) {
    return <div>Loading Keycloak Login...</div>
  }

  return (
    <div style={{ padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>Enterprise Dashboard</h1>
      <p>Welcome! Keycloak verified your identity.</p>
      
      <button 
        onClick={fetchSecureData} 
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        Knock on FastAPI's Secure Door
      </button>

      {secureData && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e0f7fa', borderRadius: '5px' }}>
          <strong>Server Response:</strong> {secureData}
        </div>
      )}

      <br /><br />
      <button onClick={() => keycloak.logout()}>Logout</button>
    </div>
  )
}

export default App