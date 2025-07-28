# URL Shortener Design Document

## Architecture Overview

This URL Shortener application is built using React with Material-UI for the frontend interface. The application follows a client-side-only architecture where all data storage and logic are handled within the browser.

## Technology Stack

- **Frontend Framework**: React 18
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios
- **Styling**: Material-UI's emotion-based styling system
- **Icons**: Material-UI Icons

## Key Design Decisions

### 1. State Management
- **Choice**: React's built-in useState and useEffect hooks
- **Rationale**: For a simple application with limited state complexity, React's native state management provides sufficient functionality without the overhead of external libraries like Redux.

### 2. Data Persistence
- **Choice**: Browser localStorage
- **Rationale**: Since the requirement specifies client-side-only logic, localStorage provides persistent storage that survives browser sessions while meeting the constraint of no backend database.

### 3. Routing Strategy
- **Choice**: React Router DOM with client-side routing
- **Rationale**: Enables seamless navigation between the shortener page and statistics page, while also handling dynamic route matching for shortcode redirection.

### 4. URL Shortcode Generation
- **Choice**: Random alphanumeric string generation using Math.random()
- **Rationale**: Simple yet effective approach that generates sufficiently unique shortcodes for the scope of this application.

## Component Structure

### 1. ShortenerPage Component
- Handles creation of up to 5 URLs simultaneously
- Manages form state for URL inputs, validity periods, and custom shortcodes
- Implements URL validation and shortcode uniqueness checking
- Provides real-time feedback through Material-UI Snackbar notifications

### 2. StatsPage Component
- Displays comprehensive statistics including total URLs, clicks, active/expired links
- Uses Material-UI Accordion components for expandable link details
- Shows detailed click analytics with timestamp, source, and location data
- Auto-refreshes data every 5 seconds for real-time updates

### 3. RedirectHandler Component
- Manages shortcode-to-URL redirection logic
- Implements click tracking with detailed analytics
- Handles expired link validation
- Provides logging for redirect events

### 4. Logging Middleware
- Custom logging service that sends structured logs to evaluation server
- Handles authentication token management
- Provides error handling for failed log transmissions

## Data Model

### Short Link Object Structure
```javascript
{
  shortcode: "abc123",           // Unique identifier
  longUrl: "https://...",        // Original URL
  createdAt: "2025-01-28T...",   // ISO timestamp
  expiresAt: "2025-01-28T...",   // ISO timestamp
  clicks: 0,                     // Total click count
  clickDetails: [                // Array of click events
    {
      timestamp: "2025-01-28T...",
      source: "Direct",
      location: "localhost"
    }
  ]
}
```

## User Experience Features

### 1. Responsive Design
- Mobile-first approach using Material-UI's Grid system
- Adaptive layouts that work on desktop and mobile devices
- Touch-friendly interface elements

### 2. Real-time Feedback
- Instant URL validation with visual feedback
- Copy-to-clipboard functionality for generated short URLs
- Success/error notifications for all user actions

### 3. Comprehensive Analytics
- Visual dashboard with key metrics cards
- Detailed click tracking with source and location data
- Expiry status monitoring with time remaining display

## Security Considerations

### 1. URL Validation
- Client-side URL validation to prevent malformed inputs
- Automatic protocol detection and validation

### 2. Expiry Management
- Time-based expiry enforcement during redirection
- Visual indicators for expired links in statistics

### 3. Data Isolation
- All data stored in browser's localStorage scope
- No cross-origin data sharing

## Performance Optimizations

### 1. Efficient Re-rendering
- Strategic use of React hooks to minimize unnecessary re-renders
- Optimized state updates with functional state setters

### 2. Data Loading
- Lazy loading of statistics data
- Efficient localStorage operations with JSON parsing optimization

### 3. User Interface
- Material-UI's built-in performance optimizations
- Minimal bundle size through selective component imports

## Scalability Considerations

While this implementation is designed for the evaluation requirements, potential improvements for production use would include:

1. **Backend Integration**: Database storage for persistence across devices
2. **Analytics Enhancement**: More detailed user behavior tracking
3. **Custom Domain Support**: Allow users to use custom domains
4. **Batch Operations**: Bulk URL management capabilities
5. **API Rate Limiting**: Prevent abuse through request throttling

## Testing Strategy

The application includes:
- Input validation for URL format and required fields
- Edge case handling for expired links and invalid shortcodes
- Error boundary handling for graceful failure recovery
- Cross-browser compatibility through Material-UI's browser support

## Deployment Requirements

- Runs on http://localhost:3000 as specified
- No external dependencies beyond npm packages
- Compatible with modern browsers supporting ES6+ features 