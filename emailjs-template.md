# EmailJS Template — Paste into EmailJS template editor

Use the following subject, headers and body in your EmailJS template (`template_lwucuwt`). Replace or expand as needed.

## Recommended Subject

[{{query_type}}] New contact from {{from_name}}

## Recommended Headers (set in the template settings)
- Reply-To: `{{reply_to}}`

> Note: the SMTP "From" address will be the address you configured for the EmailJS service (your professional email). Reply-To must be set to `{{reply_to}}` so replies go to the user.

---

## HTML Body (paste into the HTML editor)

<html>
  <body style="font-family: system-ui, -apple-system, Roboto, 'Segoe UI', 'Helvetica Neue', Arial; color:#111827;">
    <h2 style="margin:0 0 8px 0">New contact — {{query_type}}</h2>
    <p style="margin:0 0 16px 0">You have a new contact request submitted via the website.</p>

    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:640px;">
      <tr><td style="font-weight:600;width:160px">Name</td><td>{{from_name}}</td></tr>
      <tr><td style="font-weight:600">Email</td><td>{{reply_to}}</td></tr>
      <tr><td style="font-weight:600">Query Type</td><td>{{query_type}}</td></tr>
      <tr><td style="font-weight:600">Number of Sites</td><td>{{sites}}</td></tr>
      <tr><td style="font-weight:600">Message</td><td style="white-space:pre-wrap">{{message}}</td></tr>
    </table>

    <p style="margin-top:18px;color:#6b7280;font-size:13px">Sent from: ClimateRiskProject website</p>
  </body>
</html>

---

## Plain-text Body (fallback / for editors that use plain text)

New contact — {{query_type}}

Name: {{from_name}}
Email: {{reply_to}}
Query Type: {{query_type}}
Number of Sites: {{sites}}

Message:
{{message}}

---

## Template variables (must match form `name` attributes)
- `from_name` — populated by the form's `first_name` + `last_name`
- `reply_to` — user's email (sets Reply-To header)
- `user_email` — user's email (if you prefer this name in the template)
- `first_name`, `last_name` — separate fields if needed
- `sites` — radio value (e.g., `1-10`, `11-100`, `100+`)
- `query_type` — category selected (General, Pricing, Technical, Partnership, Other)
- `message` — message text

## How to configure in EmailJS
1. Create or edit the template in EmailJS and paste the HTML body in the HTML editor and the plain-text body in the text editor.
2. Set the **Subject** to: `[{{query_type}}] New contact from {{from_name}}`
3. Set the **Reply-To** header (template settings) to: `{{reply_to}}` so when you hit reply in your mailbox it goes to the user.
4. Ensure the template field names match those sent from the form. The code already submits `from_name`, `reply_to`, `query_type`, `sites`, and `message`.
5. Use your EmailJS service that is connected to your professional SMTP (so the From address will be your professional email). That way messages appear to come from you while Reply-To points to the user.

## Quick test steps
1. Run the site locally and submit the contact form.
2. Check the inbox configured in the EmailJS service for the email.
3. Click Reply — the reply should address the user's email (because of Reply-To).

## Troubleshooting
- If you receive the form but Reply-To isn't set, confirm the template header `Reply-To` uses `{{reply_to}}` and that the form is sending that field (it's a hidden input populated before submit).
- If the sender name doesn't appear, ensure the template uses `{{from_name}}` and that first/last fields are populated before sending.

---

If you'd like, I can also add a small `emailjs-template.json` (or a companion README snippet) formatted for quick paste into EmailJS. Tell me which format you prefer.
