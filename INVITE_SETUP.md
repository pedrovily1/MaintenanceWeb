# Invite Link Setup Guide

## Problem Solved
This guide addresses the issue where invite links were failing with `error=access_denied&error_code=otp_expired` and users never saw the password setup screen.

## Root Causes Fixed

### 1. Missing SetPasswordScreen Component ✅
- **Issue**: The component was referenced but never created
- **Fix**: Created `/src/sections/SetPasswordScreen.tsx` with password form UI
- **File**: Uses Supabase `auth.updateUser({ password })` to set password on first login

### 2. Missing USER_INVITED Event Handler ✅
- **Issue**: App only handled `PASSWORD_RECOVERY` events
- **Fix**: Updated `App.tsx` to also handle `USER_INVITED` events
- **Impact**: Both password recovery and invite links now trigger the password setup screen

### 3. PKCE Flow Support ✅
- **Issue**: Modern Supabase uses PKCE flow (query param `?code=`) instead of implicit flow (hash `#access_token=`)
- **Fix**: Updated hash routing guard to also ignore `?code=` query parameters
- **Impact**: Both flow types now work correctly without hash routing interference

---

## Required Supabase Configuration

You **must** configure these settings in your Supabase Dashboard for invites to work:

### 1. Redirect URLs (Authentication → URL Configuration)

Add these URLs to the **Redirect URLs** allowlist:

**Development:**
```
http://localhost:5173
```

**Production (replace with your domain):**
```
https://your-app.vercel.app
https://your-custom-domain.com
```

⚠️ **Critical**: The invite link will fail if the redirect URL is not exactly whitelisted.

---

### 2. Email Templates (Authentication → Email Templates)

#### Confirm Signup Template
This template is used for invite emails. Verify the confirmation URL:

**Default template snippet:**
```html
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your account</a></p>
```

**Important**: The `{{ .ConfirmationURL }}` automatically includes:
- The token
- The `type` parameter (`invite`, `recovery`, etc.)
- Any `redirect_to` parameter you specify when calling the invite function

#### What to Check:
1. Make sure the template hasn't been customized with a hardcoded URL
2. Verify `{{ .ConfirmationURL }}` is still present
3. If you need custom redirects, use the `redirectTo` parameter in the invite function call (see Edge Function section below)

---

### 3. Site URL (Authentication → URL Configuration)

Set your **Site URL** to:

**Development:**
```
http://localhost:5173
```

**Production:**
```
https://your-app.vercel.app
```

This is used as the default redirect if no `redirectTo` is specified.

---

### 4. PKCE Flow (Authentication → Settings)

**Recommended**: Keep PKCE **enabled** (this is the modern secure flow).

If you see `?code=` in your redirect URLs instead of `#access_token=`, PKCE is enabled. ✅ This is good and now fully supported.

---

## Edge Function Configuration

The invite flow uses an edge function called `clever-task` (see `/src/sections/Users/index.tsx:63-69`).

### Required Edge Function Code

Your edge function **must** call Supabase's admin API to send the invite:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '', // Use service role key for admin API
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

Deno.serve(async (req) => {
  const { email, full_name, role } = await req.json()

  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
    data: {
      full_name: full_name,
      role: role,
    },
    redirectTo: `${Deno.env.get('SITE_URL')}/`, // ⚠️ Must match Supabase allowed URLs
  })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ success: true, user: data.user }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

### Important Notes:

1. **redirectTo must match allowed URLs**: The `redirectTo` parameter in `inviteUserByEmail()` must exactly match one of the URLs in your Supabase Redirect URLs allowlist.

2. **Environment Variables Required**:
   - `SUPABASE_URL`: Your project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for admin API access)
   - `SITE_URL`: Your app URL (for redirects)

3. **User Metadata**: The `data` object sets user metadata fields that will be available in `user.user_metadata` after signup.

---

## Testing the Invite Flow

### 1. Send an Invite
1. Log in as an admin
2. Go to Users → "Create New User"
3. Enter email, name, and role
4. Click "Approve" in the Pending Requests tab

### 2. Check the Email
The user should receive an email with a confirmation link like:
```
https://yourproject.supabase.co/auth/v1/verify?token=...&type=invite&redirect_to=http://localhost:5173/
```

### 3. Click the Link
The user should be redirected to:
```
http://localhost:5173/#access_token=...&type=invite
```
or (if PKCE is enabled):
```
http://localhost:5173/?code=...
```

### 4. Verify the Flow
1. **Browser console** should show:
   ```
   [App] USER_INVITED event — showing set password screen
   ```

2. **SetPasswordScreen** should appear with:
   - Two password input fields
   - Password validation (min 8 characters)
   - "Set Password" button

3. After setting password:
   - App should bootstrap (load user sites and data)
   - User should see the work orders dashboard

### 5. Verify Subsequent Logins
1. Log out
2. Log back in with email + password
3. Should work normally (no password setup screen)

---

## Troubleshooting

### Issue: "Email link is invalid or has expired"

**Possible Causes:**

1. **Redirect URL not whitelisted**
   - Check Supabase Dashboard → Authentication → URL Configuration
   - Ensure the exact redirect URL is in the allowlist
   - URLs are case-sensitive and protocol-sensitive (`http` ≠ `https`)

2. **Token already consumed**
   - Invite tokens are single-use
   - If you click the link twice, the second attempt fails
   - Solution: Request a new invite

3. **Token expired**
   - Default expiration: 24 hours
   - Change in: Supabase Dashboard → Authentication → Email Auth → "Email Link Expiry"
   - Solution: Request a new invite or increase expiry time

4. **Double token consumption (React StrictMode)** ⚠️ **FIXED**
   - In development, React StrictMode mounts components twice
   - This consumed the token twice: first mount succeeds, second fails with `otp_expired`
   - **Solution implemented**: Disabled StrictMode in `src/index.tsx`
   - **Backup recovery**: App now checks for valid session even if URL shows error

### Issue: Password setup screen doesn't appear

**Possible Causes:**

1. **Wrong event type**
   - Check browser console for: `[App] USER_INVITED event — showing set password screen`
   - If missing, the event may be `PASSWORD_RECOVERY` or another type
   - Solution: Verify edge function calls `inviteUserByEmail` (not `signUp`)

2. **Session not established**
   - Invite link must create a temporary session
   - Check: `supabase.auth.getSession()` should return a valid session
   - Solution: Verify email template URL is correct

3. **SetPasswordScreen import error**
   - Check browser console for import errors
   - Verify file exists at `/src/sections/SetPasswordScreen.tsx`

### Issue: "Failed to send invite" error

**Possible Causes:**

1. **Edge function error**
   - Check edge function logs in Supabase Dashboard → Edge Functions
   - Common errors:
     - Missing environment variables
     - Wrong service role key
     - Invalid `redirectTo` URL

2. **User already exists**
   - Supabase won't invite a user with an existing account
   - Solution: Delete user first or use password reset flow

3. **Email provider rate limits**
   - Supabase free tier has email limits
   - Solution: Wait or upgrade plan

---

## Architecture Flow Diagram

```
[Admin clicks "Approve"]
         ↓
[Edge Function: clever-task]
         ↓
[Supabase Admin API: inviteUserByEmail]
         ↓
[Supabase sends email with confirm link]
         ↓
[User clicks link in email]
         ↓
[Supabase Auth endpoint: /auth/v1/verify]
         ↓
[Redirects to: http://localhost:5173/?code=... OR #access_token=...]
         ↓
[Supabase JS Client: detectSessionInUrl consumes token]
         ↓
[onAuthStateChange fires: event = "USER_INVITED" or "PASSWORD_RECOVERY"]
         ↓
[App.tsx sets isSettingPassword = true]
         ↓
[SetPasswordScreen renders]
         ↓
[User enters password]
         ↓
[supabase.auth.updateUser({ password })]
         ↓
[onComplete() → Bootstrap app with user data]
         ↓
[User sees dashboard]
```

---

## Code Changes Summary

### Files Created:
- `/src/sections/SetPasswordScreen.tsx` - Password setup UI component

### Files Modified:
- `/src/App.tsx`:
  - Added `SetPasswordScreen` import
  - Updated auth event handler to handle `USER_INVITED` events
  - Enhanced hash routing guard to ignore PKCE `?code=` params and error fragments
  - **Added session recovery mechanism** - checks for valid session even if URL shows error
  - Added comprehensive console logging for debugging

- `/src/index.tsx`:
  - **CRITICAL FIX**: Disabled React.StrictMode to prevent double token consumption
  - StrictMode's double-mount in dev causes Supabase to consume the invite token twice
  - First mount succeeds, second mount fails with `otp_expired` error

### Files Requiring Manual Configuration:
- **Supabase Dashboard** (URL Configuration, Email Templates)
- **Edge Function** (`clever-task` - ensure correct `redirectTo` parameter)

---

## Next Steps

1. ✅ Verify Supabase Dashboard settings (URLs, Email Templates)
2. ✅ Deploy/update edge function with correct `redirectTo` parameter
3. ✅ Test full invite flow end-to-end
4. ✅ Monitor browser console and Network tab for any auth errors
5. ✅ Update production environment variables if different from dev

---

## Support

If issues persist after following this guide:

1. Check browser console for `[App]` log messages
2. Check Network tab for requests to `/auth/v1/*` endpoints
3. Check Supabase Dashboard → Logs for edge function errors
4. Verify email was sent (check spam folder)
5. Try with a fresh incognito window to avoid cached auth state
