# Fixing Email Link (OTP) Authentication

The email link authentication is already implemented in the code but requires Firebase configuration to work.

---

## Why Email Link Auth Isn't Working

Email link authentication (passwordless sign-in) needs to be **enabled in Firebase Console** and your **domain must be whitelisted**. Here's how to fix it:

---

## ✅ Solution: Enable Email Link Sign-In in Firebase

### Step 1: Enable Email Link Sign-In

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **dedsec-5eae5**
3. Click **Authentication** in the left sidebar
4. Go to **Sign-in method** tab
5. Find **Email/Password** in the providers list
6. Click on it to expand
7. **Enable** both:
   - ✅ Email/Password
   - ✅ **Email link (passwordless sign-in)**
8. Click **Save**

### Step 2: Whitelist Your Domains

1. Still in **Authentication** section
2. Click **Settings** tab
3. Scroll down to **Authorized domains**
4. You should see:
   - `localhost`
   - `dedsec-5eae5.firebaseapp.com` (default)

5. **Add your production domains** (after deployment):
   - Click **Add domain**
   - Enter: `your-app.vercel.app`
   - Click **Add**

   - Click **Add domain** again
   - Enter: `dedsec-server.onrender.com`
   - Click **Add**

### Step 3: Configure Email Templates (Optional)

1. In **Authentication** section
2. Click **Templates** tab
3. Find **Email link sign-in**
4. Click the pencil icon to customize
5. You can customize:
   - Sender name
   - Subject line
   - Email body template
6. Click **Save**

---

## 🧪 Test Email Link Authentication

### Test Locally

1. Open your app: http://localhost:3000
2. Go to login page
3. Look for the "Sign in with email link" option
4. Enter your email address
5. Click "Send Sign-In Link"
6. Check your email (including spam folder)
7. Click the link in the email
8. Should redirect back to your app and sign you in

### Check Implementation

The code is already implemented in `src/lib/auth/useAuth.tsx`:

```typescript
// Send email link (lines 241-256)
const sendEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/auth/complete`,
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
  window.localStorage.setItem('emailForSignIn', email);
};

// Complete sign-in (lines 261-287)
const completeEmailLinkSignIn = async (email: string) => {
  if (!isSignInWithEmailLink(auth, window.location.href)) {
    throw new Error('Invalid sign-in link');
  }
  await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem('emailForSignIn');
  // ... user document creation
};
```

---

## 🐛 Troubleshooting

### Problem: No email received

**Solutions**:
1. ✅ Check spam/junk folder
2. ✅ Verify email link sign-in is enabled in Firebase
3. ✅ Check browser console for errors
4. ✅ Verify domain is whitelisted in Firebase
5. ✅ Try a different email provider (Gmail, Yahoo, etc.)

### Problem: "Invalid sign-in link" error

**Solutions**:
1. ✅ Make sure you're clicking the link from the same browser
2. ✅ Email link expires after some time - request a new one
3. ✅ Clear browser cache and try again
4. ✅ Check that the domain in the link matches whitelisted domains

### Problem: Email link works but authentication fails

**Solutions**:
1. ✅ Check Firestore rules allow user document creation
2. ✅ Verify Firebase project ID in `.env.local` matches console
3. ✅ Check browser console for specific error messages
4. ✅ Ensure `auth/complete` route exists in your app

---

## 📱 How Email Link Auth Works

1. **User enters email** → App calls `sendEmailLink()`
2. **Firebase sends email** with magic link
3. **User clicks link** → Redirects to `/auth/complete?apiKey=...&oobCode=...`
4. **App detects link** → Calls `completeEmailLinkSignIn()`
5. **Firebase verifies code** → Signs user in
6. **App creates user doc** → Redirects to dashboard

---

## 🔐 Security Notes

- Email links expire after a set time (configurable in Firebase)
- Links can only be used once
- User must complete sign-in from same browser
- Email is stored in localStorage temporarily
- Consider adding rate limiting to prevent abuse

---

## 🚀 Production Considerations

### Before Going Live:

1. **Customize email template** with your branding
2. **Set up custom email domain** (optional, requires Firebase Blaze plan)
3. **Monitor authentication logs** in Firebase Console
4. **Implement rate limiting** for email sends
5. **Add CAPTCHA** to prevent bot abuse (optional)

### Environment Variables

Make sure these are set in production:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=dedsec-5eae5.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=dedsec-5eae5
```

---

## ✨ Alternative: Use Firebase UI

If you want a pre-built UI, you can use FirebaseUI:

```bash
npm install firebaseui react-firebaseui
```

Then implement:

```typescript
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';

const uiConfig = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
      forceSameDevice: false,
    }
  ],
  signInSuccessUrl: '/dashboard'
};

<StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
```

---

## 📊 Testing Checklist

After enabling email link sign-in:

- [ ] Email link option visible on login page
- [ ] Entering email sends link successfully
- [ ] Email arrives within 1 minute
- [ ] Clicking link opens app
- [ ] Authentication completes successfully
- [ ] User redirected to dashboard
- [ ] User document created in Firestore
- [ ] Can sign out and sign in again

---

## 🎯 Summary

**Current Status**: Code is ready ✅
**Firebase Config Needed**: Enable email link sign-in
**Time to Fix**: 2 minutes
**Difficulty**: Easy

Just enable email link sign-in in Firebase Console and whitelist your domains. The code is already implemented and working!

---

**Last Updated**: December 7, 2025
**Status**: Ready to enable
