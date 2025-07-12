# Video-n8n: AI Video Creation Automation

An n8n-based workflow system to automate the 8-step AI video creation process, from screenplay to final production.

## 🎯 Project Overview

This project automates the complete video production workflow:

1. **Story Processing** - Final Draft screenplay parsing and analysis
2. **Image Generation** - Leonardo AI + Midjourney for cast and locations
3. **Voice Generation** - ElevenLabs AI for character voices and narration
4. **Music Curation** - Soundstripe + Suno.ai for soundtrack creation
5. **Rough Cut Assembly** - Adobe Premiere Pro automation
6. **Video Generation** - Kling/Runway ML for still-to-video conversion
7. **Performance Capture** - Runway Act One integration (manual)
8. **Final Production** - Automated post-production pipeline

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- Git
- GitHub CLI (for issue management)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/altsang/video-n8n.git
   cd video-n8n
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

4. **Start services**
   ```bash
   # Start n8n and database services
   npm run docker:up
   
   # Start the application
   npm run dev
   ```

5. **Access services**
   - n8n Interface: http://localhost:5678
   - Application API: http://localhost:3000
   - Health Check: http://localhost:3000/health

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Node.js with TypeScript
- **Workflow Engine**: Self-hosted n8n instance
- **Database**: PostgreSQL (for n8n and application data)
- **Cache/Queue**: Redis
- **Containerization**: Docker and Docker Compose
- **Testing**: Jest with TypeScript support

### Project Structure

```
video-n8n/
├── src/
│   ├── api/              # API client implementations
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Shared utilities
│   ├── config/           # Environment configuration
│   └── workflows/        # n8n workflow helpers
├── n8n-workflows/        # n8n workflow definitions
├── mcp-servers/          # Model Context Protocol servers
├── scripts/              # ExtendScript files for Premiere Pro
├── docker/               # Docker configurations
├── tests/                # Test files
└── assets/               # Generated content storage
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                   # Start development server
npm run build                # Build TypeScript to JavaScript
npm run start                # Start production server

# Testing
npm test                     # Run all tests
npm run test:unit           # Run unit tests only
npm run test:integration    # Run integration tests
npm run test:watch          # Run tests in watch mode

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix           # Fix ESLint errors
npm run format             # Format code with Prettier
npm run format:check       # Check code formatting

# Docker Operations
npm run docker:up          # Start all services
npm run docker:down        # Stop all services
npm run n8n:start          # Start n8n and database only

# MCP Server Development
npm run mcp:dev            # Start all MCP servers
npm run mcp:test           # Test MCP functionality
```

### API Integration Status

| Service | Status | API Type | Implementation |
|---------|--------|----------|----------------|
| ElevenLabs | ✅ Official | REST API | Epic 2 |
| Leonardo AI | ✅ Official | REST API | Epic 2 |
| Soundstripe | ✅ Official | REST API | Epic 2 |
| Runway ML | ⚠️ Limited | REST API | Epic 2 |
| Suno AI | ⚠️ Third-party | Various | Epic 3 |
| Kling AI | ⚠️ Third-party | Various | Epic 3 |
| Midjourney | ❌ ToS Issues | Unofficial | Epic 3 |
| Final Draft | ❌ No API | File parsing | Epic 4 |
| Premiere Pro | ❌ No API | ExtendScript | Epic 4 |

## 📊 Development Progress

### Current Status: Epic 1 - Foundation Complete ✅

**Completed:**
- [x] Project setup with TypeScript, ESLint, Prettier
- [x] Docker configuration for n8n, PostgreSQL, Redis
- [x] GitHub Actions CI/CD pipeline
- [x] Health monitoring and error handling
- [x] Environment configuration management
- [x] Testing framework setup

**Next: Epic 2 - API Integration Layer**
- [ ] ElevenLabs API client
- [ ] Leonardo AI integration  
- [ ] Soundstripe API client
- [ ] Runway ML API client

### Parallel Development

This project supports parallel development across multiple Claude Code sessions:

- **Session A**: Foundation & Infrastructure (Complete)
- **Session B**: Core API Development (Ready)
- **Session C**: Third-Party Integration (Ready) 
- **Session D**: File Processing & Automation (Ready)
- **Session E**: Workflow Development (Pending APIs)
- **Session F**: MCP & Quality Assurance (Pending workflows)

See [`claude-plan.md`](./claude-plan.md) for detailed coordination guidelines.

## 🔐 Environment Configuration

Copy `.env.example` to `.env` and configure:

### Required API Keys
```bash
ELEVENLABS_API_KEY=your_elevenlabs_key
LEONARDO_API_KEY=your_leonardo_key
SOUNDSTRIPE_API_KEY=your_soundstripe_key
RUNWAY_API_KEY=your_runway_key
```

### Database & Services
```bash
DATABASE_URL=postgresql://n8n:password@localhost:5432/n8n
REDIS_URL=redis://:password@localhost:6379
N8N_ENCRYPTION_KEY=your_32_character_encryption_key
```

## 🧪 Testing

The project includes comprehensive testing:

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test types
npm run test:unit
npm run test:integration
```

### Test Structure
- **Unit tests**: Individual function/class testing
- **Integration tests**: API and service integration
- **End-to-end tests**: Complete workflow testing

## 🚢 Deployment

### Docker Deployment
```bash
# Build production image
docker build -t video-n8n:latest .

# Run with Docker Compose
docker-compose --profile app up -d
```

### Health Monitoring
- Health check endpoint: `GET /health`
- Metrics and monitoring built-in
- Error tracking and alerting

## 📋 Project Management

### GitHub Issues
The project uses GitHub Issues for task management:
- **7 Epics**: Major feature sets
- **25 User Stories**: Individual implementation tasks
- **Labels**: Epic tracking, priority, and component organization

### Cost Monitoring
Built-in cost tracking for all API services:
- Daily/Weekly/Monthly budget limits
- Real-time usage monitoring
- Alert system for budget overruns

## 🤝 Contributing

1. Check the [GitHub Issues](https://github.com/altsang/video-n8n/issues) for open tasks
2. Follow the branch naming convention: `epic-{number}-{description}`
3. Ensure tests pass: `npm test`
4. Follow code quality standards: `npm run lint && npm run format:check`

## 📚 Documentation

- **Project Plan**: [`claude-plan.md`](./claude-plan.md) - Detailed implementation roadmap
- **Claude Guide**: [`CLAUDE.md`](./CLAUDE.md) - Development guidance for Claude Code
- **API Documentation**: Auto-generated from TypeScript interfaces
- **Workflow Documentation**: Embedded in n8n workflows

## ⚠️ Important Notes

- **ToS Compliance**: All third-party integrations respect service terms
- **Cost Monitoring**: Built-in budget controls prevent overruns  
- **Error Handling**: Comprehensive fallback mechanisms
- **Security**: API keys and sensitive data properly managed

---

## 🔗 Links

- [GitHub Repository](https://github.com/altsang/video-n8n)
- [GitHub Issues](https://github.com/altsang/video-n8n/issues)
- [n8n Documentation](https://docs.n8n.io/)

**Status**: 🟢 Foundation Complete - Ready for API Development