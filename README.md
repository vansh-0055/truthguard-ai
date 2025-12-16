# TruthGuard AI - Fake News Detection System

A comprehensive AI-powered fake news detection system that analyzes news content for authenticity by cross-referencing with trusted sources and using advanced natural language processing.

## Features

### 🛡️ AI-Powered Detection
- Advanced machine learning algorithms for news authenticity analysis
- Real-time text similarity analysis with trusted sources
- Keyword matching and credibility scoring
- Bias detection and fact-checking capabilities

### 🔐 User Authentication
- Secure user registration and login system
- Password hashing and authentication via Supabase
- Protected routes and user session management

### 📊 Comprehensive Dashboard
- User activity tracking and analytics
- Detection history with search and filtering
- Performance metrics and confidence scores
- Visual indicators for fake vs. genuine news

### 🏢 Trusted Source Integration
- Cross-referencing with major Indian news outlets:
  - Times of India
  - Hindustan Times
  - ABP News
  - NDTV
  - Indian Express
  - The Hindu
  - Reuters India
  - BBC India

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Smooth animations and micro-interactions
- Clean, professional interface
- Mobile-first approach

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Supabase Edge Functions (Deno runtime)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Routing**: React Router v6
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd truthguard-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Click "Connect to Supabase" button in the top right corner of the application

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Fill in your Supabase credentials in the `.env` file.

5. **Run the development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application includes migration files that will automatically set up the required database schema:

- `news_queries` table for storing user news submissions
- `detection_results` table for storing AI analysis results
- Row Level Security (RLS) policies for data protection
- Optimized indexes for performance

## Core Functionality

### News Detection Algorithm

1. **Content Analysis**: Extracts key features from submitted news content
2. **Source Verification**: Cross-references content with trusted news sources
3. **Keyword Matching**: Identifies potential fake news indicators and bias markers
4. **Credibility Scoring**: Calculates confidence and credibility scores
5. **Result Generation**: Provides detailed analysis with probability assessments

### API Endpoints

- `POST /functions/v1/detect-news`: Analyzes news content for authenticity
- Database operations handled through Supabase client SDK

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── lib/               # Utility functions and API clients
├── pages/             # Route components
├── types/             # TypeScript type definitions
└── App.tsx            # Main application component

supabase/
├── functions/         # Edge functions for news detection
└── migrations/        # Database migration files
```

## Security Features

- Row Level Security (RLS) on all database tables
- Secure password hashing
- Protected routes and authentication middleware
- CORS configuration for API endpoints
- Input validation and sanitization

## Deployment

The application is designed to be deployment-ready for:

- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Supabase Edge Functions (automatically deployed)
- **Database**: Supabase (managed PostgreSQL)

### Production Considerations

1. **API Keys**: Obtain production API keys for news sources
2. **Rate Limiting**: Implement rate limiting for API calls
3. **Caching**: Add Redis caching for frequently accessed data
4. **Monitoring**: Set up error tracking and performance monitoring
5. **CDN**: Configure CDN for static assets

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Supabase for backend infrastructure
- OpenAI for AI integration concepts
- Trusted news sources for verification data
- React community for excellent tooling