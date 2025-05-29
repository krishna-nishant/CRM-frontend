# Mini CRM Frontend 🎨

React-based frontend for the Mini CRM platform with dynamic campaign management and audience segmentation.

## ✨ Implemented Features

### Campaign Management
- Dynamic rule builder for audience segmentation
- Natural language to segment rules conversion
- Real-time audience size preview
- Campaign history with delivery stats
- Campaign status tracking

### Authentication
- Google OAuth 2.0 integration
- Protected routes
- Secure session handling

## 🛠️ Tech Stack

- React.js with Vite
- Tailwind CSS for styling
- Axios for API calls
- Heroicons for UI components
- React Context for state management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3000
```

3. Start development server:
```bash
npm run dev
```

## 📱 Available Pages

### 1. Login Page (`/login`)
- Google OAuth login button
- Redirect to dashboard after authentication

### 2. Campaigns Page (`/campaigns`)
- List of all campaigns with status
- Create new campaign button
- Campaign performance metrics
- Real-time delivery stats

### 3. Campaign Creation
- Dynamic rule builder interface
- Natural language input for rules
- Audience size preview
- Message template input

## 🔌 API Integration

The frontend communicates with the backend through these endpoints:

```javascript
// Campaign endpoints
GET    /api/campaigns
POST   /api/campaigns
POST   /api/campaigns/:id/start
GET    /api/campaigns/:id/stats

// Auth endpoints
GET    /auth/google
POST   /auth/logout
```

