# Context API Guide

This guide explains the React Context providers used for global state management in the application.

## Quick Reference

| Context | Purpose | Provides | When to Use |
|---------|---------|----------|-------------|
| **ApiContext** | API client access | `api` object | Every API call |
| **ProfileContext** | User profile data | `profile`, `loading`, `refetch` | Access user data, staff channels |
| **AuthContext** | Authentication state | `user`, `isAuthenticated`, `login`, `logout` | Auth checks, login/logout |
| **ThemeContext** | Theme preferences | `theme`, `toggleTheme` | Dark/light mode |

## Directory Structure

```
src/contexts/
├── ApiContext.tsx          # API client provider
├── ProfileContext.tsx      # User profile provider
├── AuthContext.tsx         # Authentication provider
└── ThemeContext.tsx        # Theme provider
```

## Part 1: ApiContext

**Purpose:** Provides access to the API client throughout the app

**File:** `/src/contexts/ApiContext.tsx`

### Basic Structure

```typescript
import React, { createContext, useContext, ReactNode } from 'react';
import { API } from '@/APIs';

interface ApiContextValue {
  api: API;
}

const ApiContext = createContext<ApiContextValue | undefined>(undefined);

interface ApiProviderProps {
  children: ReactNode;
}

export function ApiProvider({ children }: ApiProviderProps) {
  // Create API instance (singleton)
  const api = new API({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    timeout: 30000
  });

  return (
    <ApiContext.Provider value={{ api }}>
      {children}
    </ApiContext.Provider>
  );
}

// Custom hook for accessing API
export function useApiContext() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within ApiProvider');
  }
  return context;
}
```

### Usage in App

**File:** `/src/main.tsx` or `/src/App.tsx`

```typescript
import { ApiProvider } from '@/contexts/ApiContext';

function App() {
  return (
    <ApiProvider>
      <YourAppComponents />
    </ApiProvider>
  );
}
```

### Usage in Components

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useState, useEffect } from 'react';
import { News } from '@/types';

function NewsList() {
  const { api } = useApiContext();
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      // ✅ Access API client from context
      const response = await api.app.news.getNewsList({ page: 1, limit: 20 });
      setNews(response.items);
    };
    fetchNews();
  }, [api]);

  return (
    <div>
      {news.map(item => <NewsCard key={item.id} news={item} />)}
    </div>
  );
}
```

### API Client Structure

```typescript
// API instance provides:
api.app.news          // NewsAPI
api.app.poll          // PollAPI
api.app.user          // UserAPI
api.app.channel       // ChannelAPI
api.app.notification  // NotificationAPI
api.app.subscription  // SubscriptionAPI
api.app.tag           // TagAPI
api.app.expenseOrder  // ExpenseOrderAPI
// ... etc
```

### With Error Handling Hook

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useApiCall } from '@/hooks/useApiCall';

function CreateNewsForm() {
  const { api } = useApiContext();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: CreateNewsData) => {
    const result = await execute(
      () => api.app.news.createNews(data),
      {
        showSuccessMessage: true,
        successMessage: 'News created successfully!'
      }
    );

    if (result) {
      // Handle success
      navigate(`/news/${result.id}`);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Part 2: ProfileContext

**Purpose:** Provides user profile data and staff channels globally

**File:** `/src/contexts/ProfileContext.tsx`

### Basic Structure

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, ChannelStaff } from '@/types';
import { useApiContext } from './ApiContext';

interface ProfileContextValue {
  profile: User | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

interface ProfileProviderProps {
  children: ReactNode;
}

export function ProfileProvider({ children }: ProfileProviderProps) {
  const { api } = useApiContext();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.app.user.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err as Error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refetch: fetchProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// Custom hook
export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
}
```

### Usage in App

```typescript
import { ApiProvider } from '@/contexts/ApiContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

function App() {
  return (
    <ApiProvider>
      <ProfileProvider>
        <YourAppComponents />
      </ProfileProvider>
    </ApiProvider>
  );
}
```

### Usage in Components

```typescript
import { useProfile } from '@/contexts/ProfileContext';

function UserMenu() {
  const { profile, loading } = useProfile();

  if (loading) return <CircularProgress />;
  if (!profile) return <LoginButton />;

  return (
    <Menu>
      <MenuItem>{profile.firstName} {profile.lastName}</MenuItem>
      <MenuItem>{profile.email}</MenuItem>
      <Divider />
      <MenuItem>Settings</MenuItem>
      <MenuItem>Logout</MenuItem>
    </Menu>
  );
}
```

### Accessing Staff Channels

```typescript
import { useProfile } from '@/contexts/ProfileContext';

function ChannelSelector() {
  const { profile } = useProfile();

  // Get channels where user is staff
  const staffChannels = profile?.staffChannels?.map(sc => sc.channel) ?? [];

  return (
    <Select>
      {staffChannels.map(channel => (
        <MenuItem key={channel.id} value={channel.id}>
          {channel.name}
        </MenuItem>
      ))}
    </Select>
  );
}
```

### Refetching Profile

```typescript
import { useProfile } from '@/contexts/ProfileContext';

function UpdateProfileForm() {
  const { api } = useApiContext();
  const { refetch } = useProfile();

  const handleSubmit = async (data: UpdateUserData) => {
    await api.app.user.updateProfile(data);

    // ✅ Refetch profile to update context
    await refetch();
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

## Part 3: AuthContext

**Purpose:** Manages authentication state and provides login/logout functions

**File:** `/src/contexts/AuthContext.tsx`

### Basic Structure

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserBase } from '@/types';
import { useApiContext } from './ApiContext';

interface AuthContextValue {
  user: UserBase | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { api } = useApiContext();
  const [user, setUser] = useState<UserBase | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      // Verify token and get user
      api.app.auth.verifyToken()
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.app.auth.login({ email, password });
    localStorage.setItem('auth_token', response.token);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const register = async (data: RegisterData) => {
    const response = await api.app.auth.register(data);
    localStorage.setItem('auth_token', response.token);
    setUser(response.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### Usage - Protected Routes

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <CircularProgress />;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

// In router
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### Usage - Login/Logout

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { execute, loading } = useApiCall();

  const handleSubmit = async (data: LoginData) => {
    await execute(
      () => login(data.email, data.password),
      { showSuccessMessage: true, successMessage: 'Login successful!' }
    );
    navigate('/dashboard');
  };

  return <form onSubmit={handleSubmit}>...</form>;
}

function LogoutButton() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return <Button onClick={handleLogout}>Logout</Button>;
}
```

### Usage - Conditional Rendering

```typescript
import { useAuth } from '@/contexts/AuthContext';

function Header() {
  const { isAuthenticated, user } = useAuth();

  return (
    <AppBar>
      <Toolbar>
        <Typography variant="h6">My App</Typography>
        {isAuthenticated ? (
          <>
            <Typography>Welcome, {user?.firstName}</Typography>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </Toolbar>
    </AppBar>
  );
}
```

## Part 4: ThemeContext

**Purpose:** Manages theme (dark/light mode) preferences

**File:** `/src/contexts/ThemeContext.tsx`

### Basic Structure

```typescript
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

type ThemeMode = 'light' | 'dark';

interface ThemeContextValue {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get saved theme from localStorage
    const saved = localStorage.getItem('theme_mode');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    // Save theme preference
    localStorage.setItem('theme_mode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Create MUI theme based on mode
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#1976d2'
          },
          secondary: {
            main: '#dc004e'
          }
        }
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

// Custom hook
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
```

### Usage

```typescript
import { useTheme } from '@/contexts/ThemeContext';
import { IconButton } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <IconButton onClick={toggleTheme} color="inherit">
      {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
    </IconButton>
  );
}
```

## Provider Nesting Order

**File:** `/src/main.tsx` or `/src/App.tsx`

```typescript
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ApiProvider } from '@/contexts/ApiContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

function App() {
  return (
    <ThemeProvider>           {/* Outermost - no dependencies */}
      <ApiProvider>           {/* API client needed by all */}
        <AuthProvider>        {/* Auth needs API */}
          <ProfileProvider>   {/* Profile needs API and Auth */}
            <Router>
              <Routes>
                <Route path="/" element={<HomePage />} />
                {/* ... other routes */}
              </Routes>
            </Router>
          </ProfileProvider>
        </AuthProvider>
      </ApiProvider>
    </ThemeProvider>
  );
}
```

## Common Patterns

### Pattern 1: Multiple Contexts in One Component

```typescript
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useAuth } from '@/contexts/AuthContext';

function Dashboard() {
  const { api } = useApiContext();
  const { profile, loading: profileLoading } = useProfile();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (profileLoading) return <CircularProgress />;

  return (
    <div>
      <h1>Welcome, {profile?.firstName}</h1>
      {/* Dashboard content */}
    </div>
  );
}
```

### Pattern 2: Conditional Context Access

```typescript
import { useProfile } from '@/contexts/ProfileContext';
import { USER_ROLE } from '@/enums/UserEnums';

function AdminPanel() {
  const { profile } = useProfile();

  // Check user role from context
  const isAdmin = profile?.role === USER_ROLE.ADMIN || profile?.role === USER_ROLE.SUPER_ADMIN;

  if (!isAdmin) {
    return <Typography>Access Denied</Typography>;
  }

  return <div>Admin Panel Content</div>;
}
```

### Pattern 3: Context + Custom Hook

```typescript
// Custom hook combining context and data fetching
import { useApiContext } from '@/contexts/ApiContext';
import { useProfile } from '@/contexts/ProfileContext';
import { useState, useEffect } from 'react';

function useUserChannels() {
  const { api } = useApiContext();
  const { profile } = useProfile();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) {
      setLoading(false);
      return;
    }

    const fetchChannels = async () => {
      const data = await api.app.channel.getUserChannels();
      setChannels(data);
      setLoading(false);
    };
    fetchChannels();
  }, [profile, api]);

  return { channels, loading };
}

// Usage
function ChannelList() {
  const { channels, loading } = useUserChannels();

  if (loading) return <CircularProgress />;

  return (
    <List>
      {channels.map(channel => (
        <ListItem key={channel.id}>{channel.name}</ListItem>
      ))}
    </List>
  );
}
```

## Best Practices

### ✅ DO

1. **Always use custom hooks to access contexts**
   ```typescript
   const { api } = useApiContext();
   const { profile } = useProfile();
   ```

2. **Handle loading states**
   ```typescript
   if (loading) return <CircularProgress />;
   ```

3. **Nest providers in correct order**
   ```typescript
   <ThemeProvider>
     <ApiProvider>
       <AuthProvider>
         <ProfileProvider>
   ```

4. **Check authentication before accessing profile**
   ```typescript
   const { isAuthenticated } = useAuth();
   const { profile } = useProfile();

   if (!isAuthenticated) return <Navigate to="/login" />;
   ```

5. **Refetch after mutations**
   ```typescript
   await api.app.user.updateProfile(data);
   await refetch(); // Update context
   ```

### ❌ DON'T

1. **Don't access context directly**
   ```typescript
   // ❌ WRONG
   const context = useContext(ApiContext);

   // ✅ CORRECT
   const { api } = useApiContext();
   ```

2. **Don't forget error handling**
   ```typescript
   // ❌ WRONG
   const profile = await api.app.user.getProfile();

   // ✅ CORRECT
   try {
     const profile = await api.app.user.getProfile();
   } catch (error) {
     // Handle error
   }
   ```

3. **Don't use context outside provider**
   ```typescript
   // Will throw error if not wrapped in provider
   const { api } = useApiContext();
   ```

## Troubleshooting

### Problem: "useApiContext must be used within ApiProvider"

**Cause:** Component not wrapped in provider

**Solution:**
```typescript
// Wrap your app with provider
<ApiProvider>
  <YourComponent />
</ApiProvider>
```

### Problem: Profile context shows old data after update

**Cause:** Forgot to refetch after mutation

**Solution:**
```typescript
const { refetch } = useProfile();

await api.app.user.updateProfile(data);
await refetch(); // ✅ Refresh context
```

### Problem: Context value is undefined

**Cause:** Using context before provider mounts

**Solution:**
```typescript
const { profile, loading } = useProfile();

// ✅ Check loading state
if (loading) return <CircularProgress />;
if (!profile) return null;
```

## See Also

- [Quick Start Guide](/docs/QUICK_START.md) - Overview of frontend patterns
- [Hooks Guide](/src/hooks/README.md) - Custom hooks for data fetching
- [API Guide](/src/APIs/README.md) - API client implementation
- [Type System Guide](/src/types/README.md) - TypeScript types
