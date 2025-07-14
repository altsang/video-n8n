# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# AI Video Creation Automation Project

## Project Overview
This project aims to build an n8n-based workflow system to automate an AI video creator's 8-step production process, reducing manual work and streamlining the creation of video content from screenplay to final production.

## Current Workflow (Manual Process)

Based on the workflow diagram, the process follows a script-driven, parallel pipeline approach:

### Central Input
1. **Script** - Written in screenplay format using Final Draft (single source of truth for all content)

### Parallel Content Generation
**Visual Pipeline:**
- **Images**: Generate characters and locations using Midjourney/Leonardo AI
- **Curation**: Manual selection of characters & locations from generated assets
- **Animation**: Convert still images to video using Kling AI/Runway/Midjourney

**Audio Pipeline:**
- **Sound**: Create music using Suno AI, source sound effects from Sound Stripe
- **Voices**: Generate dialogue using Eleven Labs based on script
- **Curation**: Manual selection of all audio elements (music, SFX, voices)

### Final Assembly
- **Edit - Premiere**: Import all curated assets and assemble final video with timing, polish, color correction

### Key Workflow Characteristics
- **Script-Driven**: All content generation is driven by parsing the screenplay
- **Parallel Processing**: Visual and audio pipelines run concurrently
- **Human Curation Points**: Manual approval/selection of generated assets
- **Asset Convergence**: All elements feed into Premiere for final assembly

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
- **Phase 1**: Script-Driven Foundation (Central script parsing, metadata extraction, project orchestration)
- **Phase 2**: Parallel Content Pipelines (Visual: images→animation, Audio: voices→music→SFX)
- **Phase 3**: Asset Management & Curation (Human approval workflows, organized file systems)
- **Phase 4**: Final Assembly Integration (Premiere Pro automation, timeline assembly)

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

### Phase 2: Script-Driven Foundation
- [ ] Implement Final Draft file parser (.fdx format) for screenplay processing
- [ ] Create script analysis system (character extraction, location identification, dialogue parsing)
- [ ] Build project metadata database for tracking assets through pipelines
- [ ] Develop script-driven content generation triggers for both visual and audio pipelines

### Phase 3: Parallel Content Pipelines
- [ ] Implement ElevenLabs API client for voice generation and management
- [ ] Develop Leonardo AI API integration for character/location image generation
- [ ] Create Soundstripe Enterprise API client for music library access
- [ ] Research and implement Suno AI third-party API integration for music creation
- [ ] Develop Kling AI/Runway ML API clients for image-to-video conversion
- [ ] Build parallel workflow orchestration (visual and audio pipelines)

### Phase 4: Asset Management & Curation
- [ ] Create asset organization system (project → pipeline → type → status)
- [ ] Build web-based curation interface for human approval workflows
- [ ] Implement progress tracking dashboard across both pipelines
- [ ] Develop notification system for curation queue management
- [ ] Add file monitoring and automated asset organization

### Phase 5: Final Assembly Integration
- [ ] Develop Adobe Premiere Pro ExtendScript automation scripts
- [ ] Create curated asset import system for Premiere Pro
- [ ] Build automated timeline assembly based on script timing
- [ ] Implement final production workflow (polish, color correction, sound mixing)

### Phase 6: MCP Server Development
- [ ] Develop Script Processing MCP server for Final Draft integration
- [ ] Create Asset Management MCP server for curation workflow assistance
- [ ] Build Premiere Pro MCP server for timeline automation assistance
- [ ] Develop Workflow Orchestration MCP server for pipeline coordination
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
- **Script Processing Workflow**: Parse Final Draft files, extract characters/locations/dialogue/scenes
- **Visual Pipeline Workflow**: Character/location generation → curation → animation
- **Audio Pipeline Workflow**: Voice generation → music/SFX selection → curation
- **Asset Management System**: File organization, approval workflows, progress tracking
- **Final Assembly Workflow**: Premiere Pro integration, timeline automation, final production
- **Error Handling**: Circuit breakers, retry logic, and fallback mechanisms

#### MCP Server Integration
Custom MCP servers provide Claude Code with specialized tools:
- **Script Processing Server**: Final Draft parsing, character/location extraction, scene analysis
- **Asset Management Server**: File organization, curation workflow management, progress tracking
- **Premiere Pro Server**: Project analysis, ExtendScript generation, timeline automation
- **Workflow Orchestration Server**: n8n workflow management, pipeline coordination, cost optimization

### File Processing Patterns
- **Final Draft (.fdx)**: XML parsing for screenplay structure, character/location/dialogue extraction
- **Generated Assets**: Organized by project → pipeline → asset type → curation status
- **Premiere Pro Projects**: ExtendScript/UXP automation for importing curated assets and timeline assembly
- **Parallel Processing**: Visual and audio pipelines run concurrently with synchronized progress tracking
- **Curation Workflows**: Human approval points with web interface for asset selection

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

---

## Development Workflow Preferences

### Git and PR Management
- **PR Merge Strategy**: Always use `gh pr merge --rebase --delete-branch` to maintain clean linear commit history
- **Branch Protection**: Follow the comprehensive CI/CD pipeline with 6 parallel quality gates
- **Commit Messages**: Keep individual commits descriptive and focused
- **Branch Naming**: Use `epic-N-description` format for feature branches

### CI/CD Pipeline Requirements
- All 6 quality gates must pass: PR Info, Code Quality, Security, Tests, Build, Dependencies
- Never claim checks are passing unless GitHub pipeline confirms completion
- Address all ESLint, TypeScript, and test coverage requirements
- Ensure Docker builds and health checks work correctly

### Quality Standards
- Code coverage thresholds: 50% statements/functions/lines, 40% branches (Epic 1)
- No console.log statements (use logger utility instead)
- TypeScript strict mode compilation without errors
- Prettier formatting and ESLint compliance required
- Security scanning with CodeQL and npm audit

## Notes
- Maintain ToS compliance for all third-party integrations
- Implement robust error handling due to reliance on external APIs
- Consider manual intervention points for critical workflow steps
- Monitor API costs and usage to stay within budget constraints
- Follow the GitHub Issues roadmap for development priorities