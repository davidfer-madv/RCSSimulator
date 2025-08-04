# RCS Formatter Application

## Overview

This is a full-stack web application for creating and managing RCS (Rich Communication Services) message formats. The application allows users to create rich cards and carousels for business messaging, manage campaigns and customers, and export formatted messages for use in RCS platforms.

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
- **RCS Formats**: Rich card and carousel format definitions
- **Webhook Configurations**: Integration endpoints for external services

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
- Carousel format for multiple cards
- Action buttons (URL, phone, postback)
- Brand integration with logos and verification badges
- JSON export compatible with RCS Business Messaging API

## Data Flow

1. **User Authentication**: Login/register → Session creation → Protected resource access
2. **Campaign Creation**: User creates campaign → Associates with customer/brand → Defines message format
3. **Message Formatting**: Image upload → Format selection → Preview generation → Export
4. **Brand Management**: Customer creation → Logo/branding upload → Campaign association
5. **Webhook Integration**: Configuration setup → Message delivery → Status tracking

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