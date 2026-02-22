# Supabase Configuration Checklist for Invite Flow

## ✅ Quick Verification Steps

### 1. Authentication → URL Configuration

**Redirect URLs** must include (exact match):
```
☐ http://localhost:5173
☐ Your production URL (e.g., https://your-app.vercel.app)
```

⚠️ **Common mistakes:**
- Missing trailing slash vs. no trailing slash (be consistent)
- `http` vs `https` mismatch
- Port number missing (`:5173`)

**Site URL** should be:
```
Development: http://localhost:5173
Production: https://your-app.vercel.app
```

---

### 2. Authentication → Email Templates → Confirm Signup

**Check that the template contains:**
```html
{{ .ConfirmationURL }}
```

❌ **Do NOT hardcode URLs like:**
```html
<a href="http://localhost:5173/auth/confirm?token={{ .Token }}">
```

✅ **Correct:**
```html
<a href="{{ .ConfirmationURL }}">Confirm your account</a>
```

The `{{ .ConfirmationURL }}` automatically includes:
- Token
- Type (invite, recovery, etc.)
- Your redirect_to parameter from the invite function

---

### 3. Edge Function: `clever-task`

**Verify the function code includes:**

```typescript
await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
  data: { full_name, role },
  redirectTo: 'http://localhost:5173/',  // ⚠️ Must match URL Configuration exactly
})
```

**Check environment variables are set:**
```
☐ SUPABASE_URL
☐ SUPABASE_SERVICE_ROLE_KEY
☐ SITE_URL
```

**Deploy/redeploy if you made changes:**
```bash
supabase functions deploy clever-task
```

---

### 4. Test Before Sending Real Invites

**Step 1**: Check your Supabase URL
```bash
# Your invite link should look like:
https://ujdrwrtvbewrjcwdwyiu.supabase.co/auth/v1/verify?token=XXX&type=invite&redirect_to=http://localhost:5173/
```

**Step 2**: Check the `redirect_to` parameter matches your Redirect URLs **exactly**

**Common issues:**
- `redirect_to=http://localhost:5173` (missing trailing slash) but allowlist has `http://localhost:5173/`
- `redirect_to=http://localhost:5173/` (with slash) but allowlist has `http://localhost:5173`

⚠️ **They must match byte-for-byte**

---

### 5. Test Invite Flow

1. **Open browser DevTools** (F12) → Console tab
2. **Send test invite** to yourself
3. **Check email** - copy the full confirmation URL
4. **Before clicking**, verify:
   - URL starts with your Supabase project URL
   - Contains `type=invite`
   - `redirect_to` parameter matches your allowlist exactly
5. **Click the link**
6. **Watch console logs** for:
   ```
   [App] USER_INVITED event — showing set password screen
   ```
7. **SetPasswordScreen should appear**

---

## 🐛 If You Still See "otp_expired"

### Immediate Debug Steps:

1. **Open Network tab** before clicking invite link
2. Click the link
3. Look for request to `/auth/v1/verify`
4. Check the **response**:
   - Status 200 = token is valid, check why it's consumed twice
   - Status 4xx = token issue, check Supabase config

### Check Console Logs:

**You should see:**
```
[supabase] URL: https://ujdrwrtvbewrjcwdwyiu.supabase.co Key: eyJhbGciO...
[App] Setting up auth subscription (once)
[App] Error in URL, checking if we have a valid session anyway...
[App] Auth event: INITIAL_SESSION | session: true | hasBootstrapped: false
```

**If you see error URL but session exists:**
```
[App] Found valid session despite error URL! Cleaning URL and continuing...
```
→ This means the recovery mechanism worked! The invite was consumed but session was created.

**If no session:**
```
[App] Auth event: INITIAL_SESSION | session: false | hasBootstrapped: false
```
→ Token was not consumed successfully. Check Supabase Redirect URLs.

---

## 🔧 Supabase Dashboard Quick Links

Replace `ujdrwrtvbewrjcwdwyiu` with your project ID:

- **URL Configuration**: https://supabase.com/dashboard/project/ujdrwrtvbewrjcwdwyiu/auth/url-configuration
- **Email Templates**: https://supabase.com/dashboard/project/ujdrwrtvbewrjcwdwyiu/auth/templates
- **Edge Functions**: https://supabase.com/dashboard/project/ujdrwrtvbewrjcwdwyiu/functions
- **Auth Logs**: https://supabase.com/dashboard/project/ujdrwrtvbewrjcwdwyiu/logs/edge-logs

---

## ✅ Final Checklist Before Production

```
☐ Redirect URLs include production domain
☐ Site URL set to production domain
☐ Edge function environment variables updated for production
☐ Edge function deployed with correct redirectTo URL
☐ Email templates use {{ .ConfirmationURL }} (no hardcoded URLs)
☐ Test invite flow in production environment
☐ Verify HTTPS (not HTTP) in production
☐ Check CORS settings if using custom domain
```

---

## 📞 Still Stuck?

1. **Check browser console** for `[App]` logs
2. **Check Network tab** for `/auth/v1/verify` response
3. **Check Supabase logs** for edge function errors
4. **Verify email was sent** (check spam folder)
5. **Try incognito window** to avoid cached auth state
6. **Request new invite** (tokens are single-use)

---

## 🎉 Success Indicators

✅ Browser redirects to `http://localhost:5173/` (clean URL, no error)
✅ Console shows `[App] USER_INVITED event — showing set password screen`
✅ SetPasswordScreen appears with password inputs
✅ After setting password, user sees dashboard
✅ User can log out and log back in with email + password
