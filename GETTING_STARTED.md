# Getting Started Guide

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account (for backend)
- Git for version control

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd portfolio-website
```

2. **Install dependencies**
```bash
npm install
```

3. **Firebase Setup**
   - Create a new project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Create two collections:
     - `projects` (for portfolio projects)
     - `messages` (for contact form submissions)
   - Get your Firebase configuration credentials

4. **Environment Configuration**
   Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Running the Application

### Development Mode
```bash
npm run dev
```
- Starts Vite development server
- Hot Module Replacement (HMR) enabled
- Available at `http://localhost:5173`

### Production Build
```bash
npm run build
```
- Creates optimized build in `/dist` folder
- Ready for deployment

### Preview Production Build
```bash
npm run preview
```
- Serves the production build locally for testing

## Project Structure Deep Dive

### Key Files and Their Purpose

#### `main.jsx`
```javascript
// Application entry point
// Initializes React app and global styles
// Imports and applies AOS (Animate On Scroll)
```

#### `App.jsx`
```javascript
// Main routing configuration
// Defines all page routes
// Handles 404 cases
```

#### `firebase.js` (or similar config file)
```javascript
// Firebase initialization
// Export Firebase services
// Connection to Firestore
```

### Component Categories

#### 1. Page Components (`/src/pages/`)
- **WelcomeScreen** - Initial loading animation
- **Home** - Landing page with hero section
- **About** - Personal information and skills
- **Portfolio** - Projects showcase with Firebase data
- **Contact** - Contact form with Firebase integration
- **Donate** - Payment integration page
- **ThankYou** - Post-contact confirmation
- **NotFound** - 404 error page

#### 2. Reusable Components (`/src/components/`)
- **Navbar** - Navigation with mobile menu
- **CardProject** - Individual project card
- **ProjectDetail** - Modal for project details
- **InputField** - Form input component
- **TechStackIcon** - Technology icon display
- **Background** - Animated background
- **SocialLinks** - Social media icons

## Working with Firebase

### Adding Projects to Portfolio

1. **Via Firebase Console**
   - Go to Firestore Database
   - Select `projects` collection
   - Add new document with fields:
     ```json
     {
       "title": "Project Name",
       "description": "Project description",
       "image": "image-name.jpg",
       "techStack": ["React", "Node.js", "MongoDB"],
       "liveUrl": "https://demo-url.com",
       "githubUrl": "https://github.com/user/repo",
       "featured": true
     }
     ```

2. **Via Code**
```javascript
import { collection, addDoc } from "firebase/firestore";

const addProject = async (projectData) => {
  const docRef = await addDoc(collection(db, "projects"), projectData);
  console.log("Project added with ID: ", docRef.id);
};
```

### Fetching Projects
```javascript
// In Portfolio.jsx
const [projects, setProjects] = useState([]);

useEffect(() => {
  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setProjects(projectList);
  };

  fetchProjects();
}, []);
```

## Customization Guide

### 1. Changing Theme Colors
Edit `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-secondary-color',
      }
    }
  }
}
```

### 2. Adding New Pages
1. Create component in `/src/pages/NewPage.jsx`
2. Add route in `App.jsx`:
```javascript
<Route path="/new-page" element={<NewPage />} />
```
3. Add navigation link in `Navbar.jsx`

### 3. Customizing Animations

#### AOS Configuration
```javascript
// In main.jsx
AOS.init({
  duration: 1000,
  delay: 100,
  easing: 'ease-in-out'
});
```

#### Framer Motion Variants
```javascript
const variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
>
  Content here
</motion.div>
```

## Deployment

### To Firebase Hosting
```bash
# Build for production
npm run build

# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy
```

### To Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# For custom domains
vercel --prod
```

## Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Check `.env.local` file
   - Verify Firebase project settings
   - Ensure Firestore rules allow reads/writes

2. **Build Errors**
   - Check for missing imports
   - Verify all environment variables
   - Check console for specific error messages

3. **Animation Not Working**
   - Ensure AOS is initialized
   - Check if `data-aos` attributes are correct
   - Verify CSS/JS files are loading

4. **Images Not Showing**
   - Check image paths in `/public` folder
   - Verify file names match exactly
   - Check build output includes images

### Performance Tips

1. **Optimize Images**
   - Compress images before adding
   - Use WebP format when possible
   - Lazy load images below fold

2. **Reduce Bundle Size**
   - Use code splitting
   - Remove unused dependencies
   - Optimize imports

3. **Firestore Best Practices**
   - Use batch operations for multiple writes
   - Implement offline support
   - Use indexes for complex queries

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes and test
4. Commit changes: `git commit -m 'Add feature'`
5. Push to branch: `git push origin feature-name`
6. Submit pull request

## Best Practices

### Code Organization
1. Keep components small and focused
2. Use descriptive names
3. Separate concerns (UI, logic, data)
4. Reuse components when possible

### Performance
1. Use React.memo for expensive components
2. Implement lazy loading
3. Optimize re-renders with useCallback/useMemo
4. Monitor bundle size

### Security
1. Never expose secret keys in frontend
2. Validate all user inputs
3. Use HTTPS in production
4. Implement proper Firebase security rules

## Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

This guide should help you understand, customize, and maintain the portfolio website effectively. Remember to always test changes locally before deploying to production.