# RCS Formatter Application

## Overview

This is a comprehensive full-stack web application for creating, managing, and demonstrating RCS (Rich Communication Services) message formats. The application provides a complete demo platform with industry templates, analytics dashboard, webhook simulation, and professional presentation features that showcase real-world RCS integration capabilities without requiring actual carrier connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **UI Library**: Radix UI components with Tailwind CSS styling
- **State Management**: React Context API for global state, TanStack Query for server state
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom theme variables and shadcn/ui components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with JSON responses
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Passport.js with local strategy using scrypt for password hashing
- **File Handling**: Multer for multipart/form-data uploads with file storage

### Database Architecture
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Neon serverless driver
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

## Key Components

### Data Models
- **Users**: Authentication and user management
- **Customers**: Brand information including logos, colors, and verification status
- **Campaigns**: Message campaigns with status tracking and scheduling
- **RCS Formats**: Rich card and carousel format definitions with compliance validation
- **Webhook Configurations**: Integration endpoints for external services
- **Webhook Logs**: Simulated delivery tracking and status progression
- **Templates**: Industry-specific pre-built RCS message templates
- **Analytics**: Performance metrics and campaign tracking data

### Authentication System
- Session-based authentication with secure password hashing
- User registration and login with validation
- Protected routes requiring authentication
- Session persistence with PostgreSQL store

### Image Processing
- File upload handling with validation (JPEG, PNG, WebP)
- Image optimization and resizing capabilities
- File storage with unique naming and URL generation
- Support for brand logos and message media

### RCS Message Generation
- Rich card format with customizable orientation and media height
- Carousel format with drag-and-drop card reordering (2-10 cards)
- Action buttons (URL, phone, postback) with validation
- Brand integration with logos and verification badges
- Real-time RCS specification compliance checking
- Enhanced JSON export with perfect RCS API compatibility
- Industry-specific template library (retail, hospitality, healthcare)
- Interactive preview for both Android and iOS platforms

## Data Flow

1. **User Authentication**: Login/register → Session creation → Protected resource access
2. **Template Selection**: Browse industry templates → Customize or create from scratch → Apply to campaign
3. **Campaign Creation**: User creates campaign → Associates with customer/brand → Defines message format
4. **Message Formatting**: Image upload → Format selection → Drag-and-drop card arrangement → Compliance validation → Preview generation → Export
5. **Brand Management**: Customer creation → Logo/branding upload → Campaign association
6. **Webhook Simulation**: Configuration setup → Mock message delivery → Status progression tracking → Analytics generation
7. **Analytics Dashboard**: Performance monitoring → Campaign metrics → Delivery insights → Export reports

## External Dependencies

### Frontend Dependencies
- **@radix-ui/react-***: Accessible UI components
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **react-hook-form**: Form state management and validation
- **date-fns**: Date manipulation utilities

### Backend Dependencies
- **express**: Web framework
- **drizzle-orm**: Type-safe ORM
- **passport**: Authentication middleware
- **multer**: File upload handling
- **connect-pg-simple**: PostgreSQL session store
- **@neondatabase/serverless**: Serverless PostgreSQL client

### Database Dependencies
- **PostgreSQL**: Primary database (configured for Neon serverless)
- **Drizzle migrations**: Schema versioning and deployment

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx for TypeScript execution with auto-reload
- **Database**: Neon serverless PostgreSQL
- **File Storage**: Local file system with public URL serving

### Production Build
- **Frontend**: Vite build to static assets
- **Backend**: esbuild compilation to single Node.js bundle
- **Database**: Drizzle migrations applied via `db:push`
- **File Storage**: Express static file serving from public directory

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `SESSION_SECRET`: Session encryption key (defaults to development key)
- `NODE_ENV`: Environment mode (development/production)

The application uses a monorepo structure with shared TypeScript schemas and utilities, making it easy to maintain type safety across the full stack while supporting both development and production deployments.

## Recent Updates (August 2025)

### Comprehensive Demo Platform Enhancement
- **Template Library**: Industry-specific templates for retail, hospitality, and healthcare with realistic use cases
- **Analytics Dashboard**: Mock performance metrics with campaign tracking, delivery rates, and engagement analytics
- **Webhook Simulator**: Complete webhook testing system with status progression (pending → sent → delivered → read → clicked)
- **Drag-and-Drop Interface**: Intuitive carousel card reordering with visual feedback and compliance validation
- **Real-time Compliance Checking**: RCS specification validation with detailed error messages and suggestions
- **Enhanced Export Formats**: Perfect RCS JSON compliance with multiple export options
- **Professional Presentation**: Polished UI suitable for client demonstrations and sales presentations

### Technical Enhancements
- **Advanced Storage System**: Support for all new entities with comprehensive CRUD operations
- **Type-Safe API Routes**: Complete REST API coverage for templates, analytics, and webhook simulation
- **Interactive Components**: Enhanced drag-and-drop functionality with TypeScript compliance
- **Responsive Design**: Mobile-first approach with consistent user experience across devices
- **Error Handling**: Comprehensive validation and user-friendly error messages throughout the application