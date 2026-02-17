# Six Sigma Training Platform

[![Tests](https://img.shields.io/badge/tests-1073%2B%20passing-brightgreen)](https://github.com/DocDamage/blackbelt/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb)](https://react.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A comprehensive, interactive Six Sigma training platform designed to take learners from White Belt to Master Black Belt. Features AI-powered learning, interactive simulations, industry-specific tracks, and statistical software integrations.

![Six Sigma Training Platform](docs/screenshots/dashboard.png)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Installation](#installation)
  - [Web Application](#web-application)
  - [Desktop Application](#desktop-application)
- [Usage](#usage)
- [Feature Details](#feature-details)
- [Technical Stack](#technical-stack)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Six Sigma Training Platform is a full-featured learning management system that provides:

- **5 Belt Levels**: White, Yellow, Green, Black, and Master Black Belt curricula
- **21 Feature Modules**: Comprehensive tools for learning, assessment, and application
- **Industry-Specific Content**: Tailored tracks for Healthcare, Manufacturing, Service, IT, and Finance
- **AI-Powered Assistance**: Chatbot with 100+ knowledge base entries
- **Statistical Tools**: Interactive simulations and software integrations
- **Offline Support**: PWA capabilities for learning without internet

## Key Features

### Learning & Retention

| Feature | Description | Status |
|---------|-------------|--------|
| **Spaced Repetition** | SM-2 algorithm for optimal retention | ✅ Complete |
| **Community Notes** | Peer-generated study annotations | ✅ Complete |
| **AI Learning Path** | Adaptive recommendations engine | ✅ Complete |
| **Smart Study Scheduler** | 11 topics, session optimizer | ✅ Complete |

### Assessment & Certification

| Feature | Description | Status |
|---------|-------------|--------|
| **Mock Certification Exams** | ASQ CSSBB format with 150+ questions | ✅ Complete |
| **Skills Gap Analysis** | Personalized knowledge assessment | ✅ Complete |
| **Project Portfolio** | DMAIC project tracking & showcase | ✅ Complete |

### AI & Assistance

| Feature | Description | Status |
|---------|-------------|--------|
| **Comprehensive Chatbot** | AI assistant with extensive knowledge base | ✅ Complete |
| **AI Mentor** | Chat-based guidance with knowledge base | ✅ Complete |
| **Document Generator** | Excel and Word export capabilities | ✅ Complete |

### Interactive Tools

| Feature | Description | Status |
|---------|-------------|--------|
| **Control Chart Builder** | 7 chart types with Western Electric rules | ✅ Complete |
| **DOE Planner** | Full/fractional factorial designs with ANOVA | ✅ Complete |
| **Process Mapping Tool** | Flowchart builder with value-added analysis | ✅ Complete |

### Industry Tracks

| Industry | Modules | Use Cases |
|----------|---------|-----------|
| **Healthcare** | 8 modules | Patient flow, medical errors, compliance |
| **Manufacturing** | 8 modules | Defect reduction, OEE, predictive maintenance |
| **Service** | 8 modules | Call centers, service delivery, NPS |
| **IT/Software** | 8 modules | Bug reduction, deployment, DevOps |
| **Finance** | 8 modules | Loan processing, fraud detection, trading |

### Software Integrations

Export your data to popular statistical software:

| Software | Export Format | Features |
|----------|--------------|----------|
| **Excel** | .xlsx with XML | Formulas, VBA macros, templates |
| **Minitab** | .mtb | Session commands, capability analysis |
| **Python** | .py, .ipynb | Scripts + Jupyter notebooks |
| **SPSS** | .sps | Syntax files, statistical procedures |
| **JMP** | .jsl | JSL scripts, process capability |

### Collaboration & Offline

| Feature | Description | Status |
|---------|-------------|--------|
| **Study Groups** | Collaborative learning platform | ✅ Complete |
| **Mentorship Matching** | Smart algorithm with mock mentors | ✅ Complete |
| **Offline PWA** | Download manager & offline sync | ✅ Complete |

## Installation

### Web Application

```bash
# Clone the repository
git clone https://github.com/DocDamage/blackbelt.git
cd blackbelt

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Desktop Application

Build a standalone desktop app for Windows, macOS, or Linux:

```bash
# Windows (Setup + Portable)
npm run electron:build:win

# macOS (DMG)
npm run electron:build:mac

# Linux (AppImage + DEB)
npm run electron:build:linux

# Or use the one-click build script
build-installer.bat
```

Output location: `release/`
- **Setup**: `SixSigma-Training-Setup-1.0.0.exe`
- **Portable**: `SixSigma-Training-Portable-1.0.0.exe`

## Usage

### Getting Started

1. **Create an Account**: Sign up to track your progress
2. **Select Your Belt**: Start at your current level or begin with White Belt
3. **Follow the Curriculum**: Complete modules in sequence
4. **Take Quizzes**: Test your knowledge after each module
5. **Use the Chatbot**: Ask questions and get instant answers

### Using the Chatbot

The comprehensive chatbot provides instant access to:

- **Six Sigma Tools**: Control charts, hypothesis testing, regression
- **DMAIC Methodology**: Phase-by-phase guidance
- **Global Compliance**: REACH, RoHS, Prop 65, TSCA, EU MDR, and more
- **Industry Playbooks**: Medical, Automotive, Aerospace, Pharma, Food, Electronics
- **Calculators**: Cpk, Sample Size, Gage R&R, Sigma/DPMO, COPQ, ANOVA
- **Quality Software**: Sage 100, IQMS/DELMIAWorks knowledge
- **Case Studies**: Real-world DMAIC projects with ROI metrics

### Interactive Simulations

Access hands-on tools from the dashboard:

1. **Control Chart Builder**: Upload data or use sample datasets
2. **DOE Planner**: Design experiments with automatic ANOVA
3. **Process Mapping**: Create value stream maps with cycle time analysis

### Industry Tracks

Switch to your industry context:

1. Navigate to **Industry Tracks**
2. Select your industry (Healthcare, Manufacturing, etc.)
3. Browse industry-specific examples and case studies
4. Apply Six Sigma concepts to your domain

### Software Export

Export analysis to statistical software:

1. Prepare your dataset in the simulations
2. Click **Export** and select your software
3. Download the generated file
4. Open in your preferred statistical package

## Feature Details

### Phase 1: Learning Enhancement

#### Spaced Repetition
- SM-2 algorithm implementation
- Automatic scheduling based on performance
- Review notifications
- Long-term retention optimization

#### Community Notes
- Add annotations to lessons
- View peer notes
- Vote on helpful content
- Moderation system

#### Skills Gap Analysis
- Pre-assessment quizzes
- Personalized learning paths
- Progress tracking
- Competency mapping

### Phase 2: Assessment & Planning

#### Mock Certification Exams
- ASQ CSSBB format
- 150+ practice questions
- Timed exam simulation
- Performance analytics
- Detailed explanations

#### Project Portfolio
- DMAIC project templates
- Project timeline tracking
- Document storage
- Showcase completed projects

#### Smart Study Scheduler
- 11 Six Sigma topics
- 60-minute session optimization
- Calendar integration
- Reminder system

### Phase 3: AI-Powered Learning

#### AI Learning Path
- Adaptive recommendations
- Performance-based adjustments
- Goal-oriented planning
- Progress predictions

#### AI Mentor
- Chat-based guidance
- Knowledge base integration
- Socratic questioning
- 24/7 availability

### Phase 4: Collaboration & Offline

#### Study Groups
- Create or join groups
- Shared resources
- Discussion forums
- Group challenges

#### Mentorship Matching
- Smart mentor matching
- Booking system
- Video call integration
- Progress sharing

#### Offline PWA
- Download lessons for offline
- Sync when reconnected
- Offline quiz taking
- Progress preservation

### Phase 5: Advanced Features

#### Comprehensive Chatbot

**Knowledge Areas:**
- Six Sigma fundamentals
- DMAIC methodology
- Statistical tools (15+)
- AI/ML Quality (Computer Vision, Digital Twins, MLOps)
- Global Compliance (50+ regulations)
- Industry playbooks (6 industries)
- Supplier compliance
- SDS & Labeling
- Audit checklists
- Case studies with ROI
- ESG & Sustainability
- Calculators (7 interactive)
- Quality software systems

**Features:**
- Rate limiting (10 messages/minute)
- Browser compatibility checks
- Document generation (Excel/Word)
- Context-aware responses

#### Interactive Simulations

**Control Chart Builder:**
- I-MR, X-bar R, X-bar S, p, np, c, u charts
- Western Electric rules
- Automatic limit calculation
- Export capabilities

**DOE Planner:**
- Full factorial designs
- Fractional factorial designs
- ANOVA analysis
- Response surface methodology

**Process Mapping:**
- Flowchart builder
- Value-added analysis
- Cycle time calculation
- Bottleneck identification

#### Industry Tracks

35,000+ words of industry-specific content across:

- **Healthcare**: Patient flow, medical errors, HIPAA compliance
- **Manufacturing**: Defect reduction, OEE, TPM
- **Service**: Call centers, FCR, NPS, customer effort
- **IT/Software**: Bug reduction, deployment frequency, MTTR
- **Finance**: Loan processing, fraud detection, trading errors

Each track includes:
- Industry introduction
- Key metrics and KPIs
- DMAIC examples
- Case studies
- Implementation guides

#### Software Integrations

Export capabilities for 5 statistical platforms:

**Excel:**
- XML-based workbooks
- Formula preservation
- VBA macro generation
- Template creation

**Minitab:**
- Session commands
- Capability analysis
- Control chart commands
- Macro generation

**Python:**
- Analysis scripts
- Jupyter notebooks
- pandas/scipy implementations
- Visualization code

**SPSS:**
- Syntax files
- Statistical procedures
- Chart templates
- Macro support

**JMP:**
- JSL scripts
- Process capability
- Control charts
- Add-in support

## Technical Stack

### Frontend
- **Framework**: React 18.3 with TypeScript 5.6
- **Build Tool**: Vite 6.0
- **Routing**: React Router v7
- **State Management**: React Context + Hooks
- **Styling**: CSS with CSS Variables
- **Charts**: Chart.js 4.4
- **Testing**: Vitest + React Testing Library
- **E2E Testing**: Playwright

### Desktop
- **Framework**: Electron 40.4
- **Builder**: electron-builder 26.7
- **Targets**: Windows (NSIS, Portable), macOS (DMG), Linux (AppImage, DEB)

### Backend (Optional)
- **Framework**: Python FastAPI
- **Database**: SQLite
- **Analysis**: pandas, scipy, statsmodels

### Development Tools
- **Linting**: ESLint 9
- **Formatting**: Prettier (via ESLint)
- **Git Hooks**: Husky + lint-staged
- **CI/CD**: GitHub Actions

## Development

### Prerequisites
- Node.js 20.x+
- npm 10.x+
- Python 3.11+ (for backend)

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run all tests (unit + e2e)
npm run test:all

# Build for production
npm run build

# Preview production build
npm run preview
```

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run test:e2e` | Run E2E tests |
| `npm run lint` | Run ESLint |
| `npm run electron:dev` | Run Electron in development |
| `npm run electron:build:win` | Build Windows installer |
| `npm run installer` | Alias for Windows build |

### Project Structure

```
src/
├── components/          # React components
│   ├── common/         # Shared components
│   ├── features/       # Feature components
│   └── layout/         # Layout components
├── features/           # Feature modules
│   ├── comprehensive-chatbot/
│   ├── interactive-simulations/
│   ├── industry-tracks/
│   ├── software-integrations/
│   └── ...
├── content/            # Belt training content
│   ├── whiteBelt/
│   ├── yellowBelt/
│   ├── greenBelt/
│   ├── blackBelt/
│   └── masterBlackBelt/
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API clients
├── utils/              # Utilities (db, constants, logger)
└── test/               # Test setup
electron/               # Electron main process
analysis_api/           # Python backend (optional)
docs/                   # Documentation
```

## Testing

The project has comprehensive test coverage:

- **Unit Tests**: 1073+ tests across 55 files
- **E2E Tests**: Playwright tests for critical paths
- **Coverage**: 95%+ code coverage

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E with UI
npm run test:e2e:ui

# Run all tests
npm run test:all
```

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `npm run test:all`
5. Commit: `git commit -m "feat: Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

### Code Standards

- TypeScript strict mode
- ESLint for code quality
- Pre-commit hooks for linting and testing
- All tests must pass
- Code review required

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support

For support, please:
1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/DocDamage/blackbelt/issues)
3. Create a new issue if needed

## Roadmap

- [x] Phase 1: Learning Enhancement
- [x] Phase 2: Assessment & Planning
- [x] Phase 3: AI-Powered Learning
- [x] Phase 4: Collaboration & Offline
- [x] Phase 5: Advanced Features
- [ ] Future: Mobile App
- [ ] Future: Advanced Analytics Dashboard
- [ ] Future: Certification Integration

---

Built with ❤️ for Six Sigma practitioners worldwide.
