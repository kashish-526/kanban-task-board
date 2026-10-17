import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// NOTE: <StrictMode> is not used on purpose. In dev it renders every component
// twice, which would make the render counters in the stats panel show double values.
createRoot(document.getElementById('root')).render(<App />)
