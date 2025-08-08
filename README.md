# NEXUS - Digital Investigation Agency 🕵️‍♂️

An immersive FBI-style digital forensics investigation game built with Nuxt 3. **This is a demonstration build** showcasing the core investigation mechanics and laptop simulation features. Not all features or missions are available in this version.

## 🎯 What is NEXUS?

**NEXUS** is a web-based investigation simulation where you play as a digital detective working for the Digital Investigation Agency (DIA). Using professional-grade tools and methodologies, investigate cyber crimes, analyze digital evidence, and uncover conspiracies in realistic scenarios.

### Core Features
- 🖥️ **Full Laptop Simulation**: Realistic desktop environment with draggable, resizable windows
- 📧 **SecureMail**: Professional email client for analyzing suspicious communications
- 💬 **CipherChat**: Encrypted messaging application for tracking conversations
- 📁 **File Reader**: Advanced document and evidence management system
- � **CryptoCracker**: Sophisticated cipher decryption and cryptographic analysis tool
- 🕵️ **Evidence Locker**: Digital forensics collection and organization system
- 💼 **Job Description**: Mission briefing and case details application
- ⚙️ **Settings**: System configuration and preferences management

### Available Investigations
- **"The Internal Leak"**: Corporate espionage investigation at Nexus-Corp Industries defense contractor - investigate a $47M data breach involving classified defense technology

## 🛠️ Tech Stack

- **Framework**: Nuxt 4 with TypeScript and Vue 3 Composition API
- **Styling**: SCSS with custom variables and responsive design  
- **State Management**: Pinia stores for game state and laptop simulation
- **Typography**: Inter (UI) + JetBrains Mono (code/terminal)
- **Backend**: Node.js with MongoDB for user authentication and progress tracking
- **Email**: Nodemailer with Gmail integration for account verification
- **Security**: JWT authentication with bcrypt password hashing

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- MongoDB (for authentication and progress tracking)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/rol2005hun/opnexus.git
   cd opnexus
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with your configuration:
   ```env
   # Database
   MONGODB_URI=your_mongodb_connection_string
   
   # JWT
   JWT_SECRET=your_jwt_secret_key
   
   **NEXUS - Digital Investigation Agency** is developed by rol2005hun as an educational and entertainment project showcasing modern web development techniques and digital forensics concepts.  

   **Demo Version Notice:**
   This repository contains a demonstration build of NEXUS. The demo is intended to showcase the main gameplay mechanics, user interface, and investigation workflow. Some features, missions, and advanced tools may be limited or unavailable in this version.
   GMAIL_USER=your_gmail_address
   GMAIL_APP_PASSWORD=your_gmail_app_password
   
   # Discord Logging (optional)
   DISCORD_WEBHOOK_URL=your_discord_webhook_url
   ```
4. **Start development server**
   npm run dev
   ```

   > This is a demonstration of the NEXUS investigation platform. The demo showcases core gameplay mechanics and the laptop simulation environment.

## 🎮 How to Play

1. **Create Account** or log in to track your investigation progress
2. **Select an Investigation** from the mission dashboard
3. **Open the Laptop** to access the simulated desktop environment
4. **Use Investigation Tools** to analyze evidence:
   - 📧 **SecureMail**: Review suspicious email communications and attachments
   - 💬 **CipherChat**: Decrypt and analyze chat conversations
   - 📁 **File Reader**: Examine documents and digital files
   - 🔓 **CryptoCracker**: Decode encrypted messages using various cipher techniques
   - 🕵️ **Evidence Locker**: Collect and organize your findings
   - 💼 **Job Description**: Review mission briefing and objectives
5. **Solve the Case** by connecting the digital evidence and identifying the perpetrator

## 🎨 Design Philosophy

- **FBI-Inspired Interface**: Realistic government investigation tools and aesthetics
- **Dark Professional Theme**: Investigation agency styling with blue accents (#007acc)
- **Immersive Simulation**: Full desktop environment experience with window management
- **Responsive Design**: Works seamlessly across different screen sizes
- **Smooth Interactions**: Enhanced user experience with animations and transitions
- **Accessibility**: Semantic HTML and proper contrast ratios

## 🏗️ Project Structure

Last updated: 2025.08.08

```
operation-nexus/
├── app/                          # Main application directory
│   ├── components/               # Vue components
│   │   ├── apps/                # Laptop applications
│   │   │   ├── CipherChat/      # Encrypted messaging app
│   │   │   ├── CryptoCracker.vue # Cipher decryption tool
│   │   │   ├── EvidenceLocker/  # Evidence collection system
│   │   │   ├── FileReader.vue   # Document viewer
│   │   │   ├── JobDescription.vue # Mission briefing
│   │   │   ├── SecureMail.vue   # Email client
│   │   │   └── Settings.vue     # System settings
│   │   ├── LaptopScreen.vue     # Main laptop interface
│   │   ├── Window.vue           # Window management system
│   │   └── ...                  # Other UI components
│   ├── stores/                  # Pinia state management
│   │   ├── auth.ts             # Authentication store
│   │   ├── game.ts             # Game state and mission data
│   │   ├── laptop.ts           # Laptop simulation store
│   │   └── nexus.ts            # Core application store
│   ├── utils/                   # Utility functions
│   │   ├── appRegistry.ts      # Application registry
│   │   └── registerMission.ts  # Mission loading system
│   └── pages/                   # Nuxt pages
├── missions/                    # Investigation scenarios
│   ├── the-internal-leak/       # Corporate espionage case
│   │   ├── characters.ts        # People involved
│   │   ├── emails.ts           # Email evidence
│   │   ├── chats.ts            # Chat conversations
│   │   ├── files.ts            # Document evidence
│   │   ├── cryptos.ts          # Encrypted messages
│   │   ├── evidences.ts        # Collectible evidence list
│   │   ├── objectives.ts       # Mission goals
│   │   ├── timeline.ts         # Event chronology
│   │   ├── metadata.ts         # Mission information
│   │   ├── settings.ts         # Environment settings
│   │   ├── apps.ts             # Available applications
│   │   └── index.ts            # Mission export
│   └── README.md               # Mission creation guide
├── server/                      # Backend API routes
│   ├── api/                    # API endpoints
│   │   ├── auth/               # Authentication routes
│   │   ├── user/               # User management
│   │   └── models/             # Database models
│   └── utils/                  # Server utilities
├── shared/                      # Shared TypeScript types
│   └── types/                  # Interface definitions
└── public/                     # Static assets
```

## � Development

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run generate   # Generate static site
npm run preview    # Preview production build
```

### Creating New Missions
See `missions/README.md` for comprehensive mission creation guide including:
- Required file structure (12 files)
- TypeScript interfaces
- Evidence system architecture
- Registration process
- Best practices and examples

## 🔮 Roadmap

### Upcoming Features
- 📚 **Additional Missions**: Banking fraud, cyber espionage, identity theft cases
- 🏆 **Achievement System**: Progress tracking and case completion rewards
- 📊 **Analytics Dashboard**: Investigation performance statistics and case history
- 🎵 **Audio Integration**: Ambient sounds and notification effects
- 🌍 **Multi-language Support**: International accessibility
- 💼 **Advanced Forensics**: Network analysis, malware detection, digital signatures
- 🔒 **Premium Content**: Complex enterprise-level investigation scenarios
- 📱 **Mobile Support**: Touch-optimized interface for tablets

### Technical Improvements
- Real-time collaboration on investigations
- Advanced encryption simulation
- AI-powered hint system
- Cloud save synchronization
- Performance optimizations

## 🤝 Contributing

We welcome contributions to improve NEXUS! Here's how you can help:

### Mission Creation
- Create new investigation scenarios following the mission creation guide
- Add realistic evidence, characters, and storylines
- Test mission completability and balance

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Bug Reports
- Use GitHub Issues to report bugs
- Include steps to reproduce
- Provide browser/environment details

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPLv3) - see the [LICENSE](LICENSE) file for details.

## 🏢 About

**NEXUS - Digital Investigation Agency** is developed by rol2005hun as an educational and entertainment project showcasing modern web development techniques and digital forensics concepts.

### Acknowledgments
- Inspired by real digital forensics tools and methodologies
- Built with modern web technologies and best practices
- Designed to promote cybersecurity awareness and education

---

**Current Version**: 0.1.0-demo
**Built with**: Nuxt 4, Vue 3, TypeScript, MongoDB
**Repository**: [github.com/rol2005hun/opnexus](https://github.com/rol2005hun/opnexus)

> Start your investigation today and uncover the truth behind digital crimes! 🕵️‍♂️