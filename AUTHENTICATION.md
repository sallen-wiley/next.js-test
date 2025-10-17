# Authentication Management

## 🔐 Simple Toggle System

### Disable Authentication (Testing Mode)

```bash
ENABLE_AUTH=false
```

- **Use for**: Development, public demos, testing without sensitive data
- **Result**: No login required, direct access to all features

### Enable Authentication (Production Mode)

```bash
ENABLE_AUTH=true
NEXT_PUBLIC_AUTH_TYPE=supabase
```

- **Use for**: Real data, sensitive information, stakeholder demos
- **Result**: Users must sign in through Supabase authentication

## 👥 User Management

### Add New Users (Supabase Dashboard)

1. Go to your Supabase dashboard
2. Navigate to **Authentication** → **Users**
3. Click **Add User**
4. Enter email and temporary password
5. User will receive email confirmation

### Demo/Test Users

Create these accounts in Supabase for testing:

- `editor@yourcompany.com` - For editors/product managers
- `reviewer@yourcompany.com` - For reviewers
- `designer@yourcompany.com` - For design team
- `admin@yourcompany.com` - For administrators

## 🔧 Configuration Options

| Setting                 | Values            | Purpose                          |
| ----------------------- | ----------------- | -------------------------------- |
| `ENABLE_AUTH`           | `true/false`      | Master toggle for authentication |
| `NEXT_PUBLIC_AUTH_TYPE` | `supabase/simple` | Which auth system to use         |
| `USE_MOCK_DATA`         | `true/false`      | Data source toggle               |

## 📋 Common Scenarios

### Internal Team Demo (No Auth)

```bash
ENABLE_AUTH=false
USE_MOCK_DATA=true
```

### Stakeholder Demo (Protected)

```bash
ENABLE_AUTH=true
NEXT_PUBLIC_AUTH_TYPE=supabase
USE_MOCK_DATA=false
```

### Development (Your Choice)

```bash
ENABLE_AUTH=false  # Easy development
# OR
ENABLE_AUTH=true   # Test auth flows
```

## 🚀 Quick Commands

```bash
# Restart server after changing auth settings
npm run dev

# The app will automatically use the new settings
```

## 🔒 Security Notes

- **Supabase handles**: Password hashing, email verification, secure sessions
- **Row Level Security**: Already enabled in your database schema
- **No passwords in code**: All authentication handled by Supabase
- **Easy user management**: Add/remove users via Supabase dashboard
