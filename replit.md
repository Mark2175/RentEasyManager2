# RentEasy Solutions

## Overview

RentEasy Solutions is a comprehensive full-stack web application for property rentals in Bangalore, India. The platform serves multiple user types including tenants, landlords, brokers, and administrators. The application features a modern React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database with Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.
Database setup: PostgreSQL integration completed successfully (July 2025).

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for authentication and user state
- **Data Fetching**: TanStack Query (React Query) for server state management
- **Routing**: Client-side routing with conditional rendering based on authentication state

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API endpoints under `/api` prefix
- **Middleware**: Custom logging middleware for request/response tracking
- **Development**: Hot reload with Vite integration in development mode

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM (Production Ready)
- **Connection**: Replit-hosted PostgreSQL database
- **Schema**: Centralized schema definition in `shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations
- **Type Safety**: Full TypeScript integration with Drizzle-Zod validation
- **Sample Data**: Populated with realistic test data for development

## Key Components

### Authentication System
- **Provider**: Firebase Authentication
- **Method**: Phone number and OTP verification only
- **Context**: React Context for authentication state management
- **Storage**: User profiles stored in both Firebase and PostgreSQL

### User Management
- **Roles**: Four distinct user types (tenant, landlord, broker, admin)
- **Profiles**: Comprehensive user profiles with role-specific features
- **Verification**: Phone number verification required for all users

### Property Management
- **Unique IDs**: Each property has a generated unique identifier
- **Relationships**: Properties linked to landlords, tenants, and brokers
- **Features**: Virtual tours, image galleries, detailed specifications
- **Availability**: Real-time availability tracking

### Booking System
- **Workflow**: Tenant booking requests with landlord approval
- **Status Tracking**: Pending, approved, rejected, active, completed states
- **Payments**: Integrated payment processing for rent and deposits
- **Agreements**: Digital lease agreement generation

### Service Integration
- **Moving Services**: Integrated mover and packer services
- **Maintenance**: Property maintenance and repair services
- **Local Businesses**: Directory of local restaurants and services
- **Financial Services**: Bajaj Finance FD integration for landlords

## Data Flow

### User Authentication Flow
1. User enters phone number on auth screen
2. Firebase sends OTP via SMS
3. User verifies OTP and creates profile
4. User profile stored in both Firebase and PostgreSQL
5. Authentication state managed via React Context

### Property Listing Flow
1. Landlord creates property listing
2. Unique property ID generated and stored
3. Property details validated via Drizzle schema
4. Property made available for tenant search
5. Real-time updates via TanStack Query

### Booking Flow
1. Tenant searches and selects property
2. Booking request created with pending status
3. Landlord receives notification and approves/rejects
4. Payment processing initiated for approved bookings
5. Lease agreement generated and stored

## External Dependencies

### Core Dependencies
- **Firebase**: Authentication, Firestore, Storage
- **Drizzle ORM**: Database operations and migrations
- **TanStack Query**: Server state management
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework

### Payment Integration
- **Razorpay**: Payment gateway for rent, deposits, and fees
- **EMI Options**: Flexible payment plans for tenants
- **Bajaj Finance**: Special FD offers for landlords

### Third-Party APIs
- **Firebase Auth**: Phone number verification
- **Neon Database**: Serverless PostgreSQL hosting
- **Payment Gateways**: Razorpay for transaction processing

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot reload
- **Database**: Neon Database with connection pooling
- **Environment Variables**: Database URL and Firebase configuration

### Production Build
- **Frontend**: Vite build with optimized assets
- **Backend**: ESBuild bundling for Node.js deployment
- **Static Assets**: Served from `/dist/public` directory
- **Database**: Production PostgreSQL with proper connection handling

### Architecture Decisions

#### Database Choice
- **Problem**: Need for reliable, scalable database with strong typing
- **Solution**: PostgreSQL with Drizzle ORM
- **Benefits**: ACID compliance, JSON support, excellent TypeScript integration
- **Trade-offs**: More complex setup than NoSQL, but better for relational data

#### Authentication Strategy
- **Problem**: Secure user authentication for Indian market
- **Solution**: Firebase Auth with phone number verification
- **Benefits**: Familiar UX for Indian users, robust security, SMS delivery
- **Trade-offs**: Vendor lock-in, but excellent reliability and features

#### Frontend Architecture
- **Problem**: Complex state management across user types
- **Solution**: React Context + TanStack Query combination
- **Benefits**: Predictable state updates, optimistic updates, caching
- **Trade-offs**: More setup than simple useState, but scales better

#### API Design
- **Problem**: Type safety between frontend and backend
- **Solution**: Shared schema definitions with Drizzle-Zod
- **Benefits**: End-to-end type safety, validation at API boundaries
- **Trade-offs**: Additional setup complexity, but prevents runtime errors

#### UI Component Strategy
- **Problem**: Consistent, accessible UI components
- **Solution**: shadcn/ui with Radix UI primitives
- **Benefits**: Accessibility built-in, customizable, well-tested
- **Trade-offs**: Larger bundle size, but better user experience