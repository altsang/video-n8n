# Asset Management & Curation System Design

## Overview

The asset management and curation system is critical for managing the human approval workflow shown in the diagram. It provides organized storage, web-based curation interfaces, and progress tracking across both visual and audio pipelines.

## Core Components

### 1. File Organization System

#### Directory Structure
```
projects/
├── {project-id}/
│   ├── metadata.json                 # Project configuration and status
│   ├── script/
│   │   ├── original.fdx             # Source Final Draft file
│   │   └── parsed/                  # Extracted data (JSON)
│   │       ├── characters.json
│   │       ├── locations.json
│   │       ├── dialogue.json
│   │       └── scenes.json
│   ├── visual/
│   │   ├── characters/
│   │   │   ├── {character-name}/
│   │   │   │   ├── generated/       # AI-generated options
│   │   │   │   │   ├── option-1.png
│   │   │   │   │   ├── option-2.png
│   │   │   │   │   └── metadata.json
│   │   │   │   ├── curated/         # Human-approved asset
│   │   │   │   │   ├── approved.png
│   │   │   │   │   └── metadata.json
│   │   │   │   └── animated/        # Video conversion
│   │   │   │       ├── animated.mp4
│   │   │   │       └── metadata.json
│   │   └── locations/
│   │       └── {location-name}/     # Same structure as characters
│   ├── audio/
│   │   ├── voices/
│   │   │   ├── {character-name}/
│   │   │   │   ├── generated/       # Multiple voice options
│   │   │   │   ├── curated/         # Selected voice
│   │   │   │   └── dialogue/        # Scene-specific audio files
│   │   ├── music/
│   │   │   ├── generated/           # AI-generated music options
│   │   │   ├── curated/             # Selected music tracks
│   │   │   └── sourced/             # Soundstripe selections
│   │   └── sfx/
│   │       ├── generated/           # AI-generated sound effects
│   │       └── curated/             # Selected sound effects
│   └── assembly/
│       ├── premiere-project/        # Premiere Pro project files
│       ├── exports/                 # Various export formats
│       └── final/                   # Final deliverables
```

#### Metadata JSON Schema
```json
{
  "project": {
    "id": "uuid",
    "name": "string",
    "created_at": "timestamp",
    "script_file": "path",
    "status": "processing|visual_ready|audio_ready|ready_for_assembly|completed",
    "visual_pipeline": {
      "status": "pending|in_progress|awaiting_curation|completed",
      "progress_percentage": "number",
      "characters_total": "number",
      "characters_curated": "number",
      "locations_total": "number", 
      "locations_curated": "number"
    },
    "audio_pipeline": {
      "status": "pending|in_progress|awaiting_curation|completed",
      "progress_percentage": "number",
      "voices_total": "number",
      "voices_curated": "number",
      "music_tracks_curated": "number",
      "sfx_curated": "number"
    }
  }
}
```

### 2. Web-Based Curation Interface

#### Technology Stack
- **Frontend**: React with TypeScript
- **Backend**: Express.js API server
- **Database**: PostgreSQL for metadata, file paths in JSON
- **File Storage**: Local filesystem with potential cloud backup
- **Real-time Updates**: WebSocket for live progress updates

#### Curation Dashboard Features

##### Project Overview Page
```typescript
interface ProjectOverview {
  id: string;
  name: string;
  status: ProjectStatus;
  visualPipeline: PipelineStatus;
  audioPipeline: PipelineStatus;
  createdAt: Date;
  lastActivity: Date;
}

interface PipelineStatus {
  status: 'pending' | 'in_progress' | 'awaiting_curation' | 'completed';
  progressPercentage: number;
  pendingApprovals: number;
}
```

##### Character Curation Interface
- Grid view of generated character images
- Side-by-side comparison mode
- Character description from script
- Approve/reject buttons with comments
- Regeneration request functionality
- Tagging system for character attributes

##### Location Curation Interface
- Similar to character interface
- Location description and context from script
- Scene reference information
- Environmental tags (indoor/outdoor, time of day, mood)

##### Audio Curation Interface
- Audio player with waveform visualization
- A/B testing for voice options
- Music preview with scene context
- Sound effect organization by type
- Batch approval for similar assets

#### API Endpoints
```typescript
// Project management
GET    /api/projects                     // List all projects
GET    /api/projects/:id                 // Get project details
POST   /api/projects                     // Create new project
PUT    /api/projects/:id/status          // Update project status

// Asset management
GET    /api/projects/:id/assets/pending  // Get assets awaiting curation
POST   /api/assets/:id/approve           // Approve an asset
POST   /api/assets/:id/reject            // Reject an asset
POST   /api/assets/:id/regenerate        // Request regeneration

// Progress tracking
GET    /api/projects/:id/progress        // Get real-time progress
WS     /ws/projects/:id                  // WebSocket for live updates
```

### 3. Progress Tracking System

#### Real-Time Progress Updates
```typescript
interface ProgressUpdate {
  projectId: string;
  pipeline: 'visual' | 'audio';
  type: 'asset_generated' | 'asset_curated' | 'pipeline_completed';
  details: {
    assetType: string;
    assetName: string;
    totalAssets: number;
    completedAssets: number;
    progressPercentage: number;
  };
}
```

#### Notification System
- Email notifications for curation queue updates
- Slack integration for team collaboration
- In-app notifications with action buttons
- Daily progress summary reports

#### Analytics Dashboard
- Time tracking for curation decisions
- Asset regeneration rates
- Pipeline bottleneck identification
- Cost tracking per asset type

### 4. Asset Organization Logic

#### Automated File Management
```typescript
class AssetOrganizer {
  generateAssetPath(projectId: string, pipeline: string, assetType: string, status: string): string {
    return `projects/${projectId}/${pipeline}/${assetType}/${status}/`;
  }

  moveAssetOnStatusChange(assetId: string, oldStatus: string, newStatus: string): void {
    // Move files between generated/curated/animated folders
    // Update database paths
    // Trigger progress update
  }

  cleanupRejectedAssets(projectId: string): void {
    // Archive rejected assets
    // Free up storage space
    // Maintain audit trail
  }
}
```

#### Version Control for Assets
- Git LFS for large media files
- Asset versioning with rollback capability
- Backup and recovery procedures
- Change history tracking

### 5. Integration with n8n Workflows

#### n8n Custom Nodes
```typescript
// Custom node for curation queue management
class CurationQueueNode {
  async execute(items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
    const projectId = items[0].json.projectId;
    const assetType = items[0].json.assetType;
    
    // Add asset to curation queue
    await this.addToCurationQueue(projectId, assetType, items[0].json);
    
    // Trigger notification
    await this.notifyCurators(projectId, assetType);
    
    return [items];
  }
}

// Custom node for progress tracking
class ProgressTrackerNode {
  async execute(items: INodeExecutionData[]): Promise<INodeExecutionData[][]> {
    const progress = await this.calculateProgress(items[0].json.projectId);
    
    // Update database
    await this.updateProgress(progress);
    
    // Send WebSocket update
    this.broadcastProgress(progress);
    
    return [items];
  }
}
```

#### Workflow Integration Points
- Asset generation completion triggers curation queue
- Curation approval triggers next pipeline stage
- Progress updates trigger status change workflows
- Completion triggers assembly workflow

### 6. Quality Control Features

#### Asset Validation
- Image format and resolution validation
- Audio quality and format checks
- File size optimization
- Metadata completeness verification

#### Approval Workflows
- Multi-stage approval process
- Role-based access control
- Approval delegation and escalation
- Batch approval for similar assets

#### Audit Trail
- Complete history of all curation decisions
- User activity logging
- Asset modification tracking
- Performance analytics

### 7. Performance Optimization

#### Caching Strategy
- Thumbnail generation for quick preview
- Metadata caching for fast dashboard loads
- Progressive loading for large asset collections
- CDN integration for media delivery

#### Database Optimization
- Indexing for quick asset lookups
- Pagination for large asset lists
- Background cleanup jobs
- Archive old project data

#### File System Optimization
- SSD storage for active projects
- Archive storage for completed projects
- Automated cleanup policies
- Storage usage monitoring

## Implementation Timeline

### Phase 1: Core Infrastructure (1-2 weeks)
- Database schema and API setup
- Basic file organization system
- Simple curation interface

### Phase 2: Enhanced UI/UX (2-3 weeks)  
- Advanced curation interfaces
- Progress tracking dashboard
- Notification system

### Phase 3: Integration & Optimization (1-2 weeks)
- n8n workflow integration
- Performance optimization
- Quality control features

### Phase 4: Advanced Features (2-3 weeks)
- Analytics dashboard
- Multi-user collaboration
- Advanced approval workflows