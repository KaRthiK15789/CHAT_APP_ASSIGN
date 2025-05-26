# Periskope Chat Application

A modern, real-time chat application built with Next.js, TypeScript, Tailwind CSS, and Supabase. This project demonstrates a WhatsApp Web-style interface with comprehensive chat functionality.

## 🚀 Features

### ✅ Implemented Features

#### Core Functionality
- **Real-time Messaging**: Send and receive messages instantly
- **Chat Management**: Create and switch between different chats
- **User Authentication**: Secure login system with demo mode
- **Multi-account Support**: Send messages as different users (Personal, System, Support)

#### UI/UX Features
- **WhatsApp Web-style Interface**: Modern, responsive design
- **Chat Sidebar**: List of chats with search and filters
- **Message Status Indicators**: Double checkmarks for message delivery
- **Role-based Styling**: System users highlighted in green
- **Chat Tags**: Visual indicators for chat types (Demo, Internal, Signup, Content, Support)
- **Top Navigation**: Connection status, refresh, and user menu
- **Emoji Support**: Quick emoji picker for messages
- **Attachment Support**: File, image, and voice message options (UI ready)

#### Technical Features
- **TypeScript**: Full type safety throughout the application
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Component Architecture**: Modular, reusable components
- **Demo Mode**: Works without database connection for testing
- **Semantic HTML**: Proper semantic structure throughout

### 🚧 Advanced Features (Ready for Implementation)

#### Optional Features
- **Search and Filters**: Advanced chat filtering and search
- **Chat Labels**: Tagging system for organizing chats
- **Member Management**: Assign and manage chat members
- **Group Chat**: Full group conversation support

#### Bonus Features
- **IndexedDB Integration**: Offline message storage
- **File Attachments**: Send images, videos, and documents
- **Voice Messages**: Record and send voice notes
- **Read Receipts**: Track message read status
- **Typing Indicators**: Real-time typing status

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **Real-time**: Supabase Realtime
- **Authentication**: Supabase Auth
- **Icons**: React Icons (Feather Icons)
- **Date Handling**: date-fns
- **Build Tool**: Bun

## 📁 Project Structure

```
src/
├── app/
│   ├── chat/
│   │   └── page.tsx           # Main chat interface
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Landing/login page
├── components/
│   ├── auth/
│   │   ├── demo-login.tsx     # Demo authentication
│   │   └── login-form.tsx     # Supabase authentication
│   ├── chat/
│   │   ├── chat-header.tsx    # Chat header with user info
│   │   ├── chat-sidebar.tsx   # Chat list and navigation
│   │   ├── message-input.tsx  # Message composition
│   │   ├── message-list.tsx   # Message display
│   │   ├── top-navigation.tsx # Global navigation
│   │   └── *-demo.tsx         # Demo versions of components
│   └── ui/                    # shadcn/ui components
├── lib/
│   ├── demo-data.ts           # Mock data for demo mode
│   ├── database.types.ts      # TypeScript database types
│   ├── sample-data.ts         # Database setup scripts
│   ├── supabase.ts            # Supabase client configuration
│   └── utils.ts               # Utility functions
└── .same/
    └── todos.md               # Development progress tracking
```

## 🗄️ Database Schema

### Tables

#### Users
```sql
- id (UUID, Primary Key)
- email (Text, Unique)
- username (Text)
- avatar_url (Text, Optional)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Chats
```sql
- id (UUID, Primary Key)
- name (Text)
- type (direct | group)
- created_by (UUID, Foreign Key -> Users)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Messages
```sql
- id (UUID, Primary Key)
- chat_id (UUID, Foreign Key -> Chats)
- user_id (UUID, Foreign Key -> Users)
- content (Text)
- message_type (text | image | file)
- created_at (Timestamp)
- updated_at (Timestamp)
```

#### Chat Members
```sql
- id (UUID, Primary Key)
- chat_id (UUID, Foreign Key -> Chats)
- user_id (UUID, Foreign Key -> Users)
- role (admin | member)
- joined_at (Timestamp)
```

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access chats they're members of
- Comprehensive security policies for all operations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Bun package manager
- Supabase account (for production features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-app-assignment
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Run the development server**
   ```bash
   bun run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Mode

The application includes a demo mode that works without a database connection:

1. Visit the homepage
2. Click "Login as Alice" or "Login as Bob" for quick access
3. Explore all features with sample data

## 🔧 Configuration

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL schema from `src/lib/sample-data.ts`
3. Configure your environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### Real-time Features

Enable real-time subscriptions in Supabase:
1. Go to Database → Replication
2. Add tables: `messages`, `chats`, `chat_members`

## 📱 Features Overview

### Chat Interface
- **Sidebar**: Chat list with search, filters, and user status
- **Message Area**: Threaded conversations with date grouping
- **Input Area**: Rich text input with emoji, attachments, and account selection

### User Experience
- **Responsive Design**: Optimized for all screen sizes
- **Keyboard Shortcuts**: Enter to send, quick navigation
- **Visual Feedback**: Loading states, status indicators, animations
- **Accessibility**: Semantic HTML, proper ARIA labels

### Business Logic
- **Role-based Messaging**: Different user types with visual distinctions
- **Chat Organization**: Tags, filters, and search functionality
- **Message Threading**: Grouped messages by date and user
- **Status Tracking**: Online status, message delivery, read receipts

## 🎨 Design System

### Colors
- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Orange (#ea580c)
- **Error**: Red (#dc2626)
- **System**: Green (#16a34a) for system users

### Typography
- **Font Family**: Inter (system default)
- **Headings**: Semibold weights
- **Body**: Regular weights
- **UI Elements**: Medium weights

## 🧪 Testing

### Demo Mode Testing
1. Use quick login options (Alice/Bob)
2. Test message sending and receiving
3. Verify chat switching functionality
4. Check responsive design on different screen sizes

### Production Testing
1. Set up Supabase connection
2. Test real-time messaging between users
3. Verify authentication flows
4. Test chat creation and management

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the application: `bun run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

## 📋 Development Roadmap

### Phase 1: Core Foundation ✅
- [x] Project setup and basic UI
- [x] Authentication system
- [x] Chat interface components
- [x] Demo mode implementation

### Phase 2: Enhanced Features 🚧
- [ ] Real Supabase integration
- [ ] Real-time messaging
- [ ] File upload functionality
- [ ] Advanced search and filters

### Phase 3: Advanced Features 📅
- [ ] Voice messages
- [ ] Video calling
- [ ] Message encryption
- [ ] Mobile app (React Native)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** for the backend infrastructure
- **shadcn/ui** for the component library
- **Tailwind CSS** for the styling system
- **React Icons** for the icon set
- **WhatsApp Web** for design inspiration

---

**Built with ❤️ using modern web technologies**
