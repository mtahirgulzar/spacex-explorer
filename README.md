# SpaceX Explorer

A modern, enterprise-grade web application for exploring SpaceX launches, missions, and spacecraft data. Built with Next.js, React, TypeScript, and TanStack Query, following atomic design principles and industry best practices.

## Overview

SpaceX Explorer provides a comprehensive platform to browse, filter, and analyze SpaceX mission data with an intuitive user interface and powerful search capabilities. The application delivers real-time data from the SpaceX API v4 with advanced features like infinite scroll, server-side pagination, and robust error handling.

## Features

### Must-Have Features

#### Launches List
- **Server-side pagination** via `POST /launches/query` (not client-side filtering)
- **Advanced filtering system**:
  - Upcoming/Past launches
  - Success/Failure status
  - Date range selection
  - Mission name search
- **Flexible sorting**: By date or mission name (ascending/descending)
- **Infinite scroll** with load-more functionality (12 items initially, then progressive loading)
- **Loading states**: Skeleton loaders and comprehensive error states with retry functionality
- **Enterprise-grade UI/UX** with professional design and smooth animations

#### Launch Detail Page
- **Dynamic routing** at `/launches/[id]`
- **Comprehensive launch information**:
  - Core mission details and timeline
  - Rocket specifications and engine data
  - Launchpad information and location
  - Payload details and deployment info
  - Stage information and recovery data
- **Related data integration**:
  - Rocket details via `GET /rockets/:id`
  - Launchpad information via `GET /launchpads/:id`
- **Interactive image gallery** with navigation and thumbnails
- **External resource links** (videos, articles, Wikipedia)

#### Favorites System
- **LocalStorage persistence** for user preferences
- **Cross-session data retention**
- **Easy favorite management** with intuitive UI controls

### Technical Excellence

#### Architecture & Performance
- **React Query (TanStack Query)** for robust data layer management
- **TypeScript-first approach** with strong typing (no `any` types)
- **Atomic Design Pattern** with organized component structure:
  - **Atoms**: Basic UI components (Button, Input, Typography)
  - **Molecules**: Composite components (LaunchCard, SearchBar)
  - **Organisms**: Complex UI sections (LaunchList, FilterBar)
- **Virtualization** for performance optimization on large datasets
- **Next.js 15** with App Router for modern React patterns

#### Accessibility & UX
- **ARIA labels** and keyboard navigation support
- **Focus management** for screen readers
- **Responsive design** with mobile-first approach
- **Loading states and error boundaries** throughout the application
- **Smooth animations and transitions** for enhanced user experience

#### Design System
- **shadcn/ui** component library for consistent design
- **Tailwind CSS** for utility-first styling
- **Inter & JetBrains Mono** fonts for professional typography
- **Consistent color scheme** and spacing system
- **Dark/Light mode support** (configurable)

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Framework** | Next.js 15 | React framework with App Router |
| **Language** | TypeScript | Type-safe development |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **UI Components** | shadcn/ui | Accessible component library |
| **State Management** | TanStack Query | Server state and caching |
| **HTTP Client** | Axios | API communication |
| **Date Handling** | date-fns | Date manipulation and formatting |
| **Icons** | Lucide React | Consistent icon system |
| **Fonts** | Inter, JetBrains Mono | Professional typography |

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mtahirgulzar/spacex-explorer.git
   cd spacex-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
   ```

4. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── launches/          # Launches list and detail pages
│   │   ├── [id]/         # Dynamic launch detail page
│   │   └── page.tsx      # Launches list page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── components/           # Atomic Design Components
│   ├── atoms/           # Basic UI components
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Input/
│   │   └── Typography/
│   ├── molecules/       # Composite components
│   │   └── LaunchCard/
│   └── organisms/       # Complex UI sections
├── lib/                 # Core utilities and configurations
│   ├── api/            # API layer
│   │   ├── client.ts   # Axios configuration
│   │   ├── endpoints.ts # API endpoints
│   │   └── services/   # Feature-specific API services
│   ├── queries/        # React Query hooks
│   ├── hooks/          # Custom React hooks
│   └── types.ts        # TypeScript definitions
└── providers/          # React context providers
```

## API Integration

### SpaceX API v4 Endpoints Used

- **`POST /launches/query`** - Server-side pagination, filtering, and sorting
- **`GET /rockets/:id`** - Individual rocket specifications
- **`GET /launchpads/:id`** - Launchpad details and location data

### Query Strategy

- **Infinite Queries** for paginated launch data
- **Individual Queries** for detailed rocket/launchpad information
- **Optimistic Updates** for favorites management
- **Background Refetching** for real-time data synchronization
- **Error Boundaries** with automatic retry logic

## Key Features Explained

### Server-Side Pagination
Instead of fetching all launches and filtering client-side, the application uses SpaceX API's query endpoint for efficient server-side operations:

```typescript
const queryPayload = {
  query: filters,
  options: {
    page: pageParam,
    limit: 12,
    sort: { [sortBy]: sortOrder },
    populate: ['rocket', 'launchpad']
  }
};
```

### Infinite Scroll Implementation
Uses React Intersection Observer for performant infinite scrolling:
- Initial load: 12 launches
- Progressive loading: Additional batches on scroll
- Smooth loading states with skeleton UI
- Error handling with retry functionality

### Type Safety
Comprehensive TypeScript interfaces ensure type safety:
```typescript
interface Launch {
  id: string;
  name: string;
  date_utc: string;
  success: boolean | null;
  upcoming: boolean;
  rocket: string | Rocket;
  launchpad: string | Launchpad;
  // ... complete type definitions
}
```

## Development Guidelines

### Code Standards
- **No `any` types** - Use proper TypeScript typing
- **Functional components** - Avoid class-based components
- **Atomic design** - Organize components by complexity
- **Clean code** - No comments or console.logs in production
- **Error boundaries** - Graceful error handling throughout

### Performance Optimizations
- **React Query caching** for efficient data management
- **Image optimization** with Next.js Image component
- **Code splitting** for smaller bundle sizes
- **Virtualization** for large datasets
- **Debounced search** to reduce API calls

## Design Decisions

### Component Architecture
Following atomic design principles for maintainable and scalable UI components:
- **Atoms**: Reusable, single-purpose components
- **Molecules**: Combinations of atoms for specific functionality
- **Organisms**: Complex, feature-complete sections

### State Management Strategy
- **Server state**: TanStack Query for API data
- **Client state**: React hooks for local UI state
- **Persistent state**: LocalStorage for user preferences

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle size**: Optimized with code splitting
- **API response time**: Cached and optimized queries

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **SpaceX** for providing the comprehensive API
- **Next.js team** for the excellent framework
- **TanStack** for powerful state management tools
- **shadcn/ui** for beautiful, accessible components

---

**Built with care for space exploration enthusiasts**

*Time invested: 3-5 hours of focused development*