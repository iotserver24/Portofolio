import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";

// Separate ShowMore/ShowLess button component
const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300 
      hover:text-white 
      text-sm 
      font-medium 
      transition-all 
      duration-300 
      ease-in-out
      flex 
      items-center 
      gap-2
      bg-white/5 
      hover:bg-white/10
      rounded-md
      border 
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform 
          duration-300 
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

ToggleButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isShowingMore: PropTypes.bool.isRequired
};

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const techStacks = [
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "nodedotjs.svg", language: "Node.js" },
  { icon: "python.svg", language: "Python" },
  { icon: "cplusplus.svg", language: "C++" },
  { icon: "react.svg", language: "React" },
  { icon: "expo.svg", language: "Expo" },
  { icon: "nextdotjs.svg", language: "Next.js" },
  { icon: "nuxt.svg", language: "Nuxt.js" },
  { icon: "express.svg", language: "Express.js" },
  { icon: "railway.svg", language: "Railway" },
  { icon: "cloudflare.svg", language: "Cloudflare" },
  { icon: "cloudflarepages.svg", language: "Cloudflare Pages" },
  { icon: "cloudflareworkers.svg", language: "Cloudflare Workers" },
  { icon: "razorpay.svg", language: "Razorpay" },
  { icon: "brevo.svg", language: "Brevo" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "pwa.svg", language: "PWA" },
  { icon: "createreactapp.svg", language: "Create React App" }
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const projectsData = [
        {
          id: 6,
          Title: "Coderfy",
          Description: "A platform to build a complete Next.js codebase with AI for free. Still in progress.",
          Img: "/public/projects/coderfy.png",
          Link: "https://coderfy.megavault.in",
          Github: "Private",
          TechStack: ["Next.js", "AI", "Web"],
          Features: [
            "Generate full Next.js codebases using AI",
            "Completely free to use",
            "Ongoing development with new features being added"
          ]
        },
        {
          id: 1,
          Title: "MegaVault (Legacy Version)",
          Description: "A cloud storage solution offering unlimited storage with various plans, featuring encrypted storage, sharable links, video streaming capabilities, and a user-friendly interface.",
          Img: "/projects/megavault.png",
          Link: "https://megavault.in",
          Github: "Private",
          TechStack: ["Node.js", "Express.js", "Railway.app", "Pyrogram", "Razorpay", "Brevo", "Cloudflare Workers", "HTML/CSS", "JavaScript"],
          Features: [
            "Encrypted cloud storage with individual file download links",
            "Payment-based file upload unlocks",
            "Email-based alerts and subscription confirmations",
            "Premium storage options",
            "Developer utilities: Webhooks, file upload APIs",
            "Minimalist UI with fast response"
          ]
        },
        {
          id: 2,
          Title: "Sub.MegaVault",
          Description: "An evolved version of MegaVault, focusing on structured and scalable cloud storage with tiered plans, enhanced security, and improved user experience.",
          Img: "/projects/sub-megavault.png",
          Link: "https://sub.megavault.in",
          Github: "Private",
          TechStack: ["Custom UI", "JavaScript", "Enterprise-grade encryption", "Advanced access controls"],
          Features: [
            "Secure file storage with enterprise-grade encryption",
            "Customizable permissions and secure sharing links",
            "Real-time synchronization across devices",
            "Detailed storage analytics",
            "Automatic cloud backup and recovery",
            "Industry-leading security standards"
          ]
        },
        {
          id: 3,
          Title: "Video-Gen",
          Description: "A Text Match Cut Video Generator that allows users to create videos by inputting text, with customizable settings for video format, resolution, and styles.",
          Img: "/projects/video-gen.png",
          Link: "https://video-gen.megavault.in",
          Github: "https://github.com/iotserver24/match-cut-ai",
          TechStack: ["JavaScript", "TailwindCSS", "FFmpeg", "Railway", "CDN"],
          Features: [
            "Accepts scripts or raw text as input",
            "Custom duration, FPS, resolution options",
            "Style presets: cinematic, retro, glitch, clean, modern",
            "Background music and voiceover (coming soon)",
            "API support for batch rendering",
            "Progress tracking and download status updates"
          ]
        },
        {
          id: 4,
          Title: "Pollin-Coder",
          Description: "An AI-powered code generator that helps users build applications by turning their ideas into code, utilizing OpenAI's GPT-4.1.",
          Img: "/projects/pollin-coder.png",
          Link: "https://pollin-coder.megavault.in",
          Github: "Private",
          TechStack: ["OpenAI GPT-4.1", "ReactJS", "Tailwind UI", "Pollinations API"],
          Features: [
            "Input your app idea in plain English",
            "Choose tech stack or let the AI decide",
            "Code split into multiple files (modular)",
            "Live preview and export functionality",
            "Project Gallery showcasing previous outputs"
          ]
        },
        {
          id: 5,
          Title: "AniSurge",
          Description: "A free anime streaming app with a public chat feature that allows users to chat with AI characters powered by Pollinations AI.",
          Img: "/projects/anisurge.png",
          Link: "https://anisurge.me",
          Github: "Private",
          TechStack: ["Custom UI", "JavaScript", "Pollinations AI", "Android"],
          Features: [
            "Watch anime in HD quality for free",
            "Create an account to sync your watch history",
            "SUB & DUB available",
            "Comments & Discussion",
            "Continue Watching feature",
            "My Anime List",
            "Offline Downloads",
            "Watch History"
          ]
        },
        
      ];

      setProjects(projectsData);
      localStorage.setItem("projects", JSON.stringify(projectsData));
    } catch (error) {
      console.error("Error setting projects:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          <span style={{
            color: '#6366f1',
            backgroundImage: 'linear-gradient(45deg, #6366f1 10%, #a855f7 93%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Portfolio Showcase
          </span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Explore my journey through projects and technical expertise. 
          Each section represents a milestone in my continuous learning path.
        </p>
      </div>

      <Box sx={{ bgcolor: 'transparent', width: '100%' }}>
        <AppBar position="static" sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#8B5CF6',
              },
              '& .MuiTab-root': {
                color: '#94A3B8',
                '&.Mui-selected': {
                  color: '#F8FAFC',
                },
              },
            }}
          >
            <Tab label="Projects" {...a11yProps(0)} />
            <Tab label="Tech Stack" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Title={project.Title}
                      Description={project.Description}
                      Link={project.Link}
                      id={project.id}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
            <div className="flex justify-center mt-8">
              <ToggleButton onClick={toggleShowMore} isShowingMore={showAllProjects} />
              </div>
            )}
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                  </div>
                ))}
              </div>
            </div>
          </TabPanel>
      </Box>
    </div>
  );
}