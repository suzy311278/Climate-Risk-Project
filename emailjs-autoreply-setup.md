# EmailJS Auto-Reply Setup

To send automatic confirmations to users who submit the contact form, you need a **second template** in addition to the admin template.

---

## Step 1: Create a new template in EmailJS

1. Go to your EmailJS dashboard → **Templates**
2. Click **Create New Template**
3. Name it (e.g., `contact_form_autoreply`)
4. Note down the **Template ID** — you'll need it below

---

## Step 2: Configure the auto-reply template

### Subject
```
Thank you for contacting ClimateRisk Project
```

### To Email Address
Use the template variable: `{{reply_to}}`

This ensures the email is sent to the user who filled the form.

### HTML Body

```html
<html>
  <body style="font-family: system-ui, -apple-system, Roboto, 'Segoe UI', 'Helvetica Neue', Arial; color:#111827;">
    <h2 style="margin:0 0 8px 0">Thank you, {{from_name}}!</h2>
    <p style="margin:0 0 16px 0">We've received your {{query_type}} inquiry and will review it shortly.</p>
    
    <div style="background:#f3f4f6;padding:16px;border-radius:8px;margin:16px 0;">
      <h3 style="margin:0 0 8px 0;color:#1f2937">Your submission:</h3>
      <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;">
        <tr><td style="font-weight:600;width:160px">Query Type</td><td>{{query_type}}</td></tr>
        <tr><td style="font-weight:600">Number of Sites</td><td>{{sites}}</td></tr>
        <tr><td style="font-weight:600;vertical-align:top">Message</td><td style="white-space:pre-wrap">{{message}}</td></tr>
      </table>
    </div>

    <p style="margin:16px 0 0 0;color:#6b7280;font-size:14px">
      Our team typically responds within 24-48 hours. If you don't hear from us, please check your spam folder or reach out directly at <strong>contact@climateriskproject.com</strong>.
    </p>
    
    <p style="margin-top:24px;color:#9ca3af;font-size:12px;border-top:1px solid #e5e7eb;padding-top:12px;">
      ClimateRisk Project — Asset Intelligence
    </p>
  </body>
</html>
```

### Plain-text Body

```
Thank you, {{from_name}}!

We've received your {{query_type}} inquiry and will review it shortly.

Your submission:
Query Type: {{query_type}}
Number of Sites: {{sites}}
Message:
{{message}}

Our team typically responds within 24-48 hours. If you don't hear from us, please check your spam folder or reach out directly at contact@climateriskproject.com.

---
ClimateRisk Project — Asset Intelligence
```

---

## Step 3: Update the React form to send auto-reply

Edit `src/App.jsx` and update the `sendEmail` function to send **two** emails:

```javascript
const sendEmail = (e) => {
  e.preventDefault();
  if (!form.current) return;
  setIsSending(true);
  setSubmitStatus('');

  // Fill hidden template fields
  let chosenQueryType = '';
  try {
    const f = form.current;
    const first = (f.elements['first_name'] && f.elements['first_name'].value) || '';
    const last = (f.elements['last_name'] && f.elements['last_name'].value) || '';
    const userEmail = (f.elements['user_email'] && f.elements['user_email'].value) || '';
    chosenQueryType = (f.elements['query_type'] && f.elements['query_type'].value) || '';
    if (f.elements['from_name']) f.elements['from_name'].value = `${first} ${last}`.trim();
    if (f.elements['reply_to']) f.elements['reply_to'].value = userEmail;
  } catch (err) {
    // ignore errors
  }

  // Send to admin
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY)
    .then((result) => {
      // Now send auto-reply to user
      return emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_AUTOREPLY_TEMPLATE_ID, form.current, EMAILJS_PUBLIC_KEY);
    })
    .then((result) => {
      setIsSending(false);
      setSubmitStatus(`Thanks — your ${chosenQueryType || 'request'} was sent. Check your email for confirmation.`);
      form.current.reset();
    })
    .catch((error) => {
      setIsSending(false);
      setSubmitStatus('Sorry — something went wrong. Please try again or email us directly.');
      console.error('EmailJS error:', error.text || error);
    });
};
```

Then add the auto-reply template ID to your `.env`:

```env
VITE_EMAILJS_SERVICE_ID=service_bew524b
VITE_EMAILJS_TEMPLATE_ID=template_lwucuwt
VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID=template_YOUR_AUTOREPLY_ID
VITE_EMAILJS_PUBLIC_KEY=ZQF73rMjXhIJHRgr_
```

And add it to the top of `App.jsx`:

```javascript
const EMAILJS_AUTOREPLY_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID || 'YOUR_AUTOREPLY_TEMPLATE_ID';
```

---

## Template Variables Reference

Both templates can use these variables (passed from the form):
- `from_name` — user's full name
- `reply_to` — user's email address
- `user_email` — user's email (alias for `reply_to`)
- `first_name`, `last_name` — separate fields
- `sites` — selected number of sites
- `query_type` — inquiry category
- `message` — user's message

---

## Quick Checklist

- [ ] Create a new template in EmailJS for auto-reply
- [ ] Set the "To" field to `{{reply_to}}`
- [ ] Paste the HTML and plain-text bodies
- [ ] Copy the auto-reply template ID
- [ ] Add `VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID` to `.env`
- [ ] Update `sendEmail()` in `App.jsx` to send both templates (see code above)
- [ ] Test by submitting the form — you should receive both an admin email and a confirmation email

