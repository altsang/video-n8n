# AI Video Creation Automation Plan with n8n

## Executive Summary

Create an n8n-based workflow system to automate your 8-step AI video creation process, with a hybrid approach using both official APIs and custom MCP servers for services without APIs.

## API Integration Assessment

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

- **Final Draft**: No API - file-based workflow integration
- **Adobe Premiere Pro**: ExtendScript/UXP automation (transitioning to UXP)
- **Runway Act One**: Not yet available via API

## n8n Workflow Architecture

### Phase 1: Content Generation Workflows

1. **Story Processing**: File monitor → text extraction → formatting
2. **Image Generation**: Leonardo AI + third-party Midjourney automation
3. **Voice Generation**: ElevenLabs API for multiple voice creation and auditioning
4. **Music Curation**: Soundstripe API + Suno third-party API integration

### Phase 2: Video Production Workflows

5. **Rough Cut Assembly**: File-based integration with Premiere Pro via ExtendScript
6. **Video Generation**: Kling, Runway APIs for still-to-video conversion
7. **Performance Capture**: Manual step (Act One not API-ready)
8. **Final Production**: Enhanced Premiere Pro automation

### Phase 3: MCP Server Development

- Custom MCP servers for non-API services to integrate with Claude Code
- File system monitoring for Premiere Pro project automation
- Batch processing coordination across all tools

## Implementation Strategy

### Week 1-2: Foundation

- Set up n8n instance with required nodes
- Integrate ElevenLabs and Leonardo AI APIs
- Create basic content generation workflows

### Week 3-4: Advanced Integration

- Implement third-party API connections (Suno, Kling)
- Develop custom nodes for Premiere Pro automation
- Create file-based Final Draft integration

### Week 5-6: MCP Integration

- Build custom MCP servers for missing APIs
- Integrate with Claude Code for intelligent workflow management
- Create monitoring and batch processing systems

### Week 7-8: Testing & Optimization

- End-to-end workflow testing
- Performance optimization
- Error handling and fallback mechanisms

## Risk Mitigation

- Terms of Service compliance monitoring for unofficial APIs
- Fallback manual processes for critical steps
- Cost monitoring and budget controls for API usage
- Regular backup and version control for all workflows

## Expected Automation Level

- **High Automation (80-90%)**: Steps 2, 3, 4, 6
- **Medium Automation (50-70%)**: Steps 1, 5, 8
- **Low Automation (20-30%)**: Step 7 (Act One manual requirement)

---

## Current Project Status (Updated: 2025-01-12)

### 🟢 Completed
- [x] **Project Planning & Research**: Comprehensive API research and architecture design
- [x] **GitHub Repository Setup**: Repository created with proper structure
- [x] **GitHub Issues Creation**: 7 Epics and 25 User Stories created
- [x] **Documentation**: CLAUDE.md updated with development guidance
- [x] **Planning Documentation**: Complete project roadmap established

### 🟡 In Progress
- [ ] **Epic 1: Project Foundation & Infrastructure** (Issues #1-3)
  - Ready to start Issue #2: Project Setup and Environment Configuration
  - Ready to start Issue #3: n8n Instance Setup and Configuration

### 📋 Development Priority Queue
1. **Issue #2**: Project Setup and Environment Configuration (3-5 days)
2. **Issue #3**: n8n Instance Setup and Configuration (2-3 days)
3. **Issue #5**: ElevenLabs API Integration (5-7 days)
4. **Issue #6**: Leonardo AI API Integration (5-7 days)

---

## Parallel Development Strategy

### Session Assignment Framework

#### 🎯 **Session A: Foundation & Infrastructure**
**Primary Responsibility**: Epic 1 (Issues #1-3)
- Project setup with TypeScript, Docker, CI/CD
- n8n instance configuration and testing
- Development environment standardization

#### 🎯 **Session B: Core API Development**
**Primary Responsibility**: Epic 2 (Issues #4-8)
- ElevenLabs API client implementation
- Leonardo AI integration development
- Soundstripe and Runway ML API clients

#### 🎯 **Session C: Third-Party Integration**
**Primary Responsibility**: Epic 3 (Issues #9-12)
- Suno AI third-party API integration
- Kling AI API client development
- Midjourney automation research and ToS compliance

#### 🎯 **Session D: File Processing & Automation**
**Primary Responsibility**: Epic 4 (Issues #13-15)
- Final Draft .fdx file parser
- Adobe Premiere Pro ExtendScript development
- File monitoring and organization systems

#### 🎯 **Session E: Workflow Development**
**Primary Responsibility**: Epic 5 (Issues #16-19)
- n8n workflow design and implementation
- Batch processing system
- Queue management and monitoring

#### 🎯 **Session F: MCP & Quality Assurance**
**Primary Responsibility**: Epics 6-7 (Issues #20-27)
- Custom MCP server development
- Error handling and monitoring
- Performance testing and optimization

### Dependency Management

#### ✅ **Can Start Immediately (No Dependencies)**
- Issue #2: Project Setup and Environment Configuration
- Issue #14: Final Draft File Processing (research phase)
- Issue #10: Suno AI Third-Party API Integration (research phase)

#### ⏳ **Requires Foundation (After Issue #2)**
- Issue #3: n8n Instance Setup and Configuration
- Issue #5: ElevenLabs API Integration
- Issue #6: Leonardo AI API Integration
- Issue #7: Soundstripe API Integration
- Issue #8: Runway ML API Integration

#### 🔗 **Requires Multiple Dependencies**
- Issue #17: Content Generation Workflow (requires Issues #5, #6, #14)
- Issue #18: Video Production Workflow (requires Issues #8, #11, #15)
- Issue #19: Batch Processing (requires Issues #17, #18)

### Integration Points & Coordination

#### 🔄 **Code Integration Strategy**
```bash
# Branch Strategy for Parallel Development
main                    # Production-ready code
├── epic-1-foundation   # Session A work
├── epic-2-api-core     # Session B work  
├── epic-3-third-party  # Session C work
├── epic-4-file-proc    # Session D work
├── epic-5-workflows    # Session E work
└── epic-6-7-quality    # Session F work
```

#### 📋 **Progress Tracking Protocol**
Each session should update their progress by:
1. **GitHub Issue Updates**: Check off completed tasks in issue descriptions
2. **Branch Status**: Push progress to assigned branch daily
3. **Documentation Updates**: Update relevant sections in CLAUDE.md
4. **Integration Notes**: Document any cross-epic dependencies discovered

#### 🔧 **Technical Integration Requirements**
- **Shared TypeScript Interfaces**: Define in `src/types/` for cross-session consistency
- **Common Utilities**: Place in `src/utils/` for reuse across components
- **Environment Configuration**: Centralized in `.env.example` and `src/config/`
- **Testing Standards**: Jest configuration and shared test utilities

### Session Coordination Framework

#### 📅 **Development Phases**
**Phase 1 (Week 1-2): Foundation**
- Session A: Complete Epic 1
- Sessions B-F: Research and planning for their epics

**Phase 2 (Week 3-4): Core Development**
- Sessions A-B: Active development
- Sessions C-D: Begin implementation
- Sessions E-F: Detailed planning

**Phase 3 (Week 5-6): Integration**
- All sessions: Active development
- Focus on integration testing between components

**Phase 4 (Week 7-8): Quality & Deployment**
- Sessions A-E: Integration and testing
- Session F: Quality assurance and optimization

#### 🚀 **Quick Start Commands for New Sessions**
```bash
# Session Initialization
git clone https://github.com/altsang/video-n8n.git
cd video-n8n
git checkout -b epic-{X}-{description}

# Review assigned issues
gh issue list --assignee @me

# Check dependencies
cat CLAUDE.md  # Review architecture and requirements
cat claude-plan.md  # Review current status and assignments
```

#### 📊 **State Management**
**Current Environment Variables Needed:**
- `ELEVENLABS_API_KEY`: Voice generation API
- `LEONARDO_API_KEY`: Image generation API  
- `SOUNDSTRIPE_API_KEY`: Music library access
- `RUNWAY_API_KEY`: Video generation API
- `DATABASE_URL`: PostgreSQL connection for n8n
- `N8N_ENCRYPTION_KEY`: n8n data encryption

**Development Database Schema:**
- n8n tables (managed by n8n)
- `projects` table for video project tracking
- `api_usage` table for cost monitoring
- `assets` table for generated content organization

---

## Detailed Implementation Roadmap

### Epic 1: Project Foundation & Infrastructure

#### Issue #2: Project Setup and Environment Configuration
```typescript
// Target Project Structure
video-n8n/
├── src/
│   ├── api/           # API client implementations
│   ├── types/         # TypeScript interfaces
│   ├── utils/         # Shared utilities
│   ├── config/        # Environment configuration
│   └── workflows/     # n8n workflow helpers
├── n8n-workflows/     # n8n workflow definitions
├── mcp-servers/       # Model Context Protocol servers
├── scripts/           # ExtendScript files for Premiere Pro
├── docker/            # Docker configurations
├── docs/              # Additional documentation
└── tests/             # Test files
```

**Implementation Steps:**
1. Initialize npm project with TypeScript
2. Configure ESLint, Prettier, Jest
3. Set up Docker Compose for development
4. Create GitHub Actions workflow
5. Establish coding standards and structure

#### Issue #3: n8n Instance Setup and Configuration
**Required n8n Community Nodes:**
- `n8n-nodes-base` (included)
- `n8n-nodes-langchain` (for AI integrations)
- Custom nodes for API integrations

**Docker Configuration:**
```yaml
# docker-compose.yml structure
services:
  n8n:
    image: n8nio/n8n
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - DB_TYPE=postgresdb
  postgres:
    image: postgres:13
  redis:
    image: redis:7-alpine
```

### Epic 2: API Integration Layer

#### Implementation Pattern for All API Clients:
```typescript
// Standard API Client Structure
export class APIClient {
  private apiKey: string;
  private baseURL: string;
  private rateLimiter: RateLimiter;
  
  async request<T>(endpoint: string, options?: RequestOptions): Promise<T>
  async retry<T>(operation: () => Promise<T>, maxRetries: number): Promise<T>
  trackUsage(endpoint: string, cost: number): void
}
```

#### Issue #5: ElevenLabs API Integration
**Key Endpoints:**
- `POST /v1/text-to-speech/{voice_id}` - Generate speech
- `POST /v1/voices/add` - Clone voice
- `GET /v1/voices` - List available voices
- `DELETE /v1/voices/{voice_id}` - Delete voice

#### Issue #6: Leonardo AI API Integration  
**Key Endpoints:**
- `POST /generations` - Generate images
- `GET /generations/{id}` - Check generation status
- `POST /generations-motion` - Generate motion images

### Cross-Session Communication

#### 📢 **Status Update Format**
When updating progress, use this format in GitHub issue comments:
```markdown
## Session {X} Progress Update - {Date}

### Completed Today
- [x] Task description with details

### In Progress  
- [ ] Current task with estimated completion

### Blockers/Dependencies
- Waiting for: {specific requirement from other session}

### Integration Notes
- New interfaces/types created in: {file path}
- Shared utilities added: {description}

### Next Session Focus
- {planned work for next development session}
```

#### 🔄 **Merge Strategy**
1. **Daily Integration**: Each session merges `main` into their branch daily
2. **Feature Integration**: Complete features merged to `main` via PR
3. **Cross-Epic Dependencies**: Coordinate through GitHub issue comments
4. **Conflict Resolution**: Use GitHub issue discussions for coordination

---

*This document serves as the coordination hub for parallel development across multiple Claude Code sessions. Update this file as the project evolves.*
