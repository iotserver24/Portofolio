# Working Code Examples

This file contains practical code snippets showing how the portfolio website functions under the hood.

## 1. Application Bootstrap (main.jsx)

```javascript
import React from 'react'
import ReactDOM from 'ReactDOM/client'
import App from './App.jsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Initialize AOS for scroll animations
AOS.init({
  duration: 1000,      // Animation duration
  delay: 100,          // Delay between animations
  once: true,          // Animation happens only once
  offset: 100,         // Distance from element to trigger
})

// Create root and render app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## 2. Router Configuration (App.jsx)

```javascript
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

// Page imports
import Home from './pages/Home'
import About from './pages/About'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'

// Wrapper for page transitions
const PageWrapper = ({ children }) => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <div key={location.pathname}>
        {children}
      </div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </PageWrapper>
    </BrowserRouter>
  )
}

export default App
```

## 3. Firebase Configuration and Integration

### firebase.js - Firebase Setup
```javascript
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const analytics = getAnalytics(app)

// Firestore helper functions
export const fetchProjects = async () => {
  const projectsCollection = collection(db, 'projects')
  const snapshot = await getDocs(projectsCollection)
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
}

export const saveContactMessage = async (messageData) => {
  const messagesCollection = collection(db, 'messages')
  return await addDoc(messagesCollection, {
    ...messageData,
    timestamp: serverTimestamp()
  })
}
```

### Using Firebase in Components
```javascript
// Portfolio.jsx - Fetching projects
import { useState, useEffect } from 'react'
import { fetchProjects } from '../firebase'

export default function Portfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getProjects = async () => {
      try {
        const projectData = await fetchProjects()
        setProjects(projectData)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    getProjects()
  }, [])

  if (loading) return <LoadingScreen />

  return (
    <div className="projects-grid">
      {projects.map(project => (
        <CardProject key={project.id} project={project} />
      ))}
    </div>
  )
}
```

## 4. Component Examples

### CardProject - Project Card Component
```javascript
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function CardProject({ project }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <motion.div
        className="project-card"
        whileHover={{ y: -5 }}
        onClick={() => setIsOpen(true)}
      >
        <div className="card-image">
          <img src={`/projects/${project.image}`} alt={project.title} />
        </div>
        <div className="card-content">
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="tech-stack">
            {project.techStack.map((tech, index) => (
              <TechStackIcon key={index} tech={tech} />
            ))}
          </div>
        </div>
      </motion.div>

      {isOpen && (
        <ProjectDetail
          project={project}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
```

### InputField - Reusable Form Component
```javascript
import { forwardRef } from 'react'

const InputField = forwardRef(function InputField(
  { label, type = 'text', error, ...props },
  ref
) {
  return (
    <div className="input-group">
      <label className="input-label">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        className={`input-field ${error ? 'error' : ''}`}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
})

export default InputField
```

## 5. Animation Examples

### AOS Usage in Components
```jsx
// In any component
<div className="section">
  <h2 data-aos="fade-up" data-aos-duration="800">
    Animated Title
  </h2>
  <p data-aos="fade-up" data-aos-delay="200">
    Content that animates after title
  </p>
  <div data-aos="zoom-in" data-aos-delay="400">
    <img src="/image.jpg" alt="Animated Image" />
  </div>
</div>
```

### Framer Motion Page Transitions
```javascript
// For page transitions
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
}

// Usage in page components
<motion.div
  initial="initial"
  animate="animate"
  exit="exit"
  variants={pageTransition}
>
  <h1>Page Title</h1>
  <p>Page content</p>
</motion.div>
```

## 6. State Management Examples

### Form Handling with Validation
```javascript
import { useState } from 'react'
import InputField from './InputField'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formErrors = validateForm()

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await saveContactMessage(formData)
      // Show success message
      // Reset form
      setFormData({ name: '', email: '', message: '' })
    } catch (error) {
      // Show error message
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <InputField
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <InputField
        label="Message"
        name="message"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        as="textarea"
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="submit-button"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
```

## 7. Custom Hooks Examples

### useFadeIn Hook
```javascript
import { useEffect, useRef, useState } from 'react'

export function useFadeIn(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
        observer.unobserve(entry.target)
      }
    }, options)

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [options])

  return [ref, isVisible]
}

// Usage
function Component() {
  const [ref, isVisible] = useFadeIn({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`fade-in ${isVisible ? 'visible' : ''}`}
    >
      Content
    </div>
  )
}
```

### useMediaQuery Hook
```javascript
import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)

    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

// Usage
function ResponsiveComponent() {
  const isSmall = useMediaQuery('(max-width: 640px)')

  return (
    <div className={isSmall ? 'mobile-layout' : 'desktop-layout'}>
      {isSmall ? 'Mobile view' : 'Desktop view'}
    </div>
  )
}
```

## 8. Utility Functions

### Tech Stack Icon Mapper
```javascript
export const techStackIcons = {
  React: '/tech-stack/react.svg',
  JavaScript: '/tech-stack/javascript.svg',
  Node: '/tech-stack/node.svg',
  MongoDB: '/tech-stack/mongodb.svg',
  // Add more as needed
}

export function getTechIcon(techName) {
  return techStackIcons[techName] || '/tech-stack/default.svg'
}
```

### Date Formatter
```javascript
export function formatDate(timestamp) {
  const date = timestamp.toDate()
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
```

## 9. Error Handling Examples

### Error Boundary
```javascript
import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <p>Please refresh the page and try again.</p>
        </div>
      )
    }

    return this.props.children
  }
}

// Usage
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

## 10. Performance Optimization Example

### Lazy Loading Components
```javascript
import { lazy, Suspense } from 'react'

// Lazy load heavy components
const AdminPanel = lazy(() => import('./AdminPanel'))
const ProjectDetail = lazy(() => import('./ProjectDetail'))

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Suspense>
  )
}
```

These examples demonstrate the core patterns and techniques used in the portfolio website. Feel free to adapt them for your specific needs while maintaining the established patterns for consistency.