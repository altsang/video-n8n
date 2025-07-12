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

*This plan provides a comprehensive automation solution while respecting service limitations and ToS requirements.*
