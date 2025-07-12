# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AI Video Creation Automation Project

## Project Overview
This project aims to build an n8n-based workflow system to automate an AI video creator's 8-step production process, reducing manual work and streamlining the creation of video content from screenplay to final production.

## Current Workflow (Manual Process)

1. **Write Story** - Written in screenplay format using Final Draft to get a sense of timing
2. **Midjourney / Leonardo** - Create still images for cast and locations (hundreds of images, curated)
3. **Eleven Labs.ai** - Create all different voices, audition ~100 voices for curation
4. **Soundstripe / Suno.ai** - Curate or create music pieces (Suno.ai is faster)
5. **Adobe Premiere** - Create rough cut with ElevenLabs voices, still images, and music for timing
6. **Kling / Runway / Midjourney** - Convert still images into video footage
7. **Runway Act One** - Perform and convert performance to video footage (most time-consuming)
8. **Adobe Premiere** - Replace stills with video, polish, add sound effects, color correct

## API Research Results

### ✅ Services with Full API Support
- **ElevenLabs**: Complete API with voice generation, cloning, and management ($5-330/month)
- **Leonardo AI**: Production API with image generation and automation features
- **Soundstripe**: Enterprise API for music library integration
- **Runway ML**: Limited API access (Gen-3 Alpha Turbo) launched Sept 2024

### ⚠️ Services with Third-Party/Unofficial APIs
- **Suno AI**: Multiple third-party APIs available (gcui-art/suno-api, AI/ML API, SunoAPI.org)
- **Midjourney**: Unofficial automation bots and third-party services (violates ToS)
- **Kling AI**: Third-party APIs via PiAPI, AI/ML API, Segmind

### ❌ Services Requiring Alternative Integration
- **Final Draft**: No API - file-based workflow integration required
- **Adobe Premiere Pro**: ExtendScript/UXP automation (transitioning from ExtendScript to UXP)
- **Runway Act One**: Not yet available via API

## Architecture Strategy

### n8n Workflow System
- **Phase 1**: Content Generation Workflows (Story processing, Image/Voice/Music generation)
- **Phase 2**: Video Production Workflows (Rough cut assembly, Video generation, Performance capture)
- **Phase 3**: MCP Server Development (Custom integrations for non-API services)

### Integration Approach
- Direct API integration for supported services
- Third-party API wrappers for unofficial APIs (with ToS compliance monitoring)
- File-based automation for services without APIs
- Custom MCP servers for Claude Code integration

## Expected Automation Levels
- **High Automation (80-90%)**: Image generation, Voice generation, Music curation, Still-to-video conversion
- **Medium Automation (50-70%)**: Story processing, Rough cut assembly, Final production
- **Low Automation (20-30%)**: Performance capture (Runway Act One manual requirement)

## Development Environment
- Node.js/TypeScript project structure
- Self-hosted n8n instance with Docker
- Custom node development for specialized integrations
- MCP server development for Claude Code assistance

## Cost Considerations
- API usage monitoring and budget controls
- Cost optimization for batch processing
- Fallback mechanisms for expensive API calls

---

## TODO List

### Phase 1: Foundation & Setup
- [ ] Set up Node.js/TypeScript project structure with linting and testing
- [ ] Configure Docker-based n8n instance
- [ ] Set up development environment and CI/CD pipeline
- [ ] Install and configure required n8n community nodes

### Phase 2: Core API Integrations
- [ ] Implement ElevenLabs API client for voice generation and management
- [ ] Develop Leonardo AI API integration for image generation
- [ ] Create Soundstripe Enterprise API client for music library access
- [ ] Integrate Runway ML API for video generation (Gen-3 Alpha Turbo)

### Phase 3: Third-Party API Integration
- [ ] Research and implement Suno AI third-party API integration
- [ ] Develop Kling AI API client with cost monitoring
- [ ] Implement ToS-compliant Midjourney automation (if possible)
- [ ] Add error handling and fallback mechanisms for unofficial APIs

### Phase 4: File-Based Integration
- [ ] Create Final Draft file parser (.fdx format) for screenplay processing
- [ ] Develop Adobe Premiere Pro ExtendScript automation scripts
- [ ] Implement file monitoring and organization systems
- [ ] Create data extraction utilities for timing and dialogue

### Phase 5: n8n Workflow Development
- [ ] Build content generation workflow (story → assets)
- [ ] Create video production workflow (assets → rough cut)
- [ ] Implement batch processing and queue management
- [ ] Add progress tracking and notification systems

### Phase 6: MCP Server Development
- [ ] Develop custom MCP server for Final Draft integration
- [ ] Create MCP server for Premiere Pro automation assistance
- [ ] Build workflow orchestration MCP server for Claude Code
- [ ] Test MCP integration with Claude Code

### Phase 7: Quality Assurance
- [ ] Implement comprehensive error handling and logging
- [ ] Add cost monitoring and budget controls
- [ ] Create performance testing and optimization
- [ ] Develop fallback mechanisms for API failures

### Phase 8: Testing & Deployment
- [ ] End-to-end workflow testing
- [ ] Performance benchmarking and optimization
- [ ] Documentation and user guides
- [ ] Production deployment and monitoring setup

---

## Development Environment Setup

### Repository Structure
This is currently a planning repository. The actual codebase will be organized as follows:
- `src/` - TypeScript source code for API integrations and utilities
- `n8n-workflows/` - n8n workflow definitions and custom nodes
- `mcp-servers/` - Model Context Protocol server implementations
- `scripts/` - ExtendScript files for Adobe Premiere Pro automation
- `docs/` - Additional documentation and API specifications
- `docker/` - Docker configurations for n8n and supporting services

### Technology Stack
- **Runtime**: Node.js with TypeScript
- **Workflow Engine**: Self-hosted n8n instance
- **Database**: PostgreSQL (for n8n and application data)
- **Containerization**: Docker and Docker Compose
- **MCP Protocol**: Custom servers for Claude Code integration
- **Testing**: Jest for unit tests, Playwright for integration tests

### Common Development Commands
Once the project is initialized, these commands will be available:

```bash
# Environment setup
npm install                    # Install dependencies
npm run setup                 # Initial project setup
docker-compose up -d          # Start n8n and supporting services

# Development
npm run dev                   # Start development servers
npm run build                # Build TypeScript to JavaScript
npm run lint                  # Run ESLint
npm run test                  # Run all tests
npm run test:unit            # Run unit tests only
npm run test:integration     # Run integration tests

# n8n Operations
npm run n8n:start            # Start n8n instance
npm run n8n:import           # Import workflow definitions
npm run n8n:export           # Export current workflows

# MCP Server Development
npm run mcp:dev              # Start MCP servers in development mode
npm run mcp:test             # Test MCP server functionality
```

### Architecture Overview

#### Core Integration Strategy
The system uses a three-tiered integration approach:
1. **Direct API Integration**: Services with official APIs (ElevenLabs, Leonardo AI, Soundstripe, Runway ML)
2. **Third-Party API Wrappers**: Unofficial APIs with ToS compliance monitoring (Suno AI, Kling AI)
3. **File-Based Automation**: Services without APIs (Final Draft, Adobe Premiere Pro)

#### n8n Workflow Architecture
- **Content Generation Workflows**: Orchestrate story processing, image/voice/music generation
- **Video Production Workflows**: Handle rough cut assembly, video generation, and final production
- **Batch Processing System**: Queue management for concurrent project processing
- **Error Handling**: Circuit breakers, retry logic, and fallback mechanisms

#### MCP Server Integration
Custom MCP servers provide Claude Code with specialized tools:
- **Final Draft Server**: Screenplay parsing, character analysis, timing estimation
- **Premiere Pro Server**: Project analysis, ExtendScript generation, workflow optimization
- **Workflow Orchestration Server**: n8n workflow management, performance monitoring, cost optimization

### File Processing Patterns
- **Final Draft (.fdx)**: XML parsing for screenplay structure extraction
- **Premiere Pro Projects**: ExtendScript/UXP automation for timeline manipulation
- **Media Assets**: Automated organization with consistent naming conventions
- **Batch Operations**: Queue-based processing with progress tracking

### API Integration Guidelines
- All API clients implement retry logic with exponential backoff
- Cost monitoring tracks usage across all services
- Rate limiting prevents quota exhaustion
- Error handling includes fallback to manual processes for critical failures
- ToS compliance monitoring for third-party APIs

### GitHub Issues Integration
Project planning uses GitHub Issues with the following structure:
- **Epics**: Large feature sets or project phases (7 total)
- **User Stories**: Individual implementation tasks (25 total)
- **Labels**: `epic`, `user-story`, `api-integration`, `n8n-workflow`, `mcp-server`

Current development follows the GitHub Issues roadmap from Epic 1 (Foundation) through Epic 7 (Quality Assurance).

## Notes
- Maintain ToS compliance for all third-party integrations
- Implement robust error handling due to reliance on external APIs
- Consider manual intervention points for critical workflow steps
- Monitor API costs and usage to stay within budget constraints
- Follow the GitHub Issues roadmap for development priorities