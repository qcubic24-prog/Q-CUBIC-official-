# Contact form delivery

Recipient: contact@q-cubic.com. The form collects name, mobile number, email, optional address and project requirements.

The frontend and server handler are implemented. Direct email delivery is not active without an email-service account and verified sender. The current UI therefore opens an email draft, clearly requiring the visitor to press Send in their email application. It never reports a successful submission when email delivery is not configured.

## Activate when hosting

1. Confirm that contact@q-cubic.com is an existing receiving mailbox.
2. Set up a transactional-email provider. This handler uses Resend. Verify a sending domain with the provider's DNS records.
3. Set server-only environment variables RESEND_API_KEY, CONTACT_FROM (a verified sending address), and CONTACT_SITE_ORIGIN (the exact production website origin, including https://).
4. Deploy contact-api.cjs behind /api/contact using the Node server or an adapted serverless handler. The static dist folder alone cannot send email. Keep the local dashboard API private; do not expose serve.cjs publicly as-is.
5. Verify GET /api/contact returns available:true, then perform an explicitly authorized real test and confirm receipt in the mailbox. A successful API response means the email provider accepted it, not a guarantee of immediate inbox delivery.

The frontend automatically switches from Open email draft to Send enquiry once the service is configured. Enquiries use the visitor's email as Reply-To; the recipient is fixed on the server. Provider keys are never sent to the browser. The handler validates fields, limits request size, includes a honeypot and a small in-memory rate limit. For production instances, use a shared rate limiter/spam protection at the hosting layer.

Do not place secrets in project files or client JavaScript. No real test email has been sent during development; provider responses were mocked for tests.

API reference: https://resend.com/docs/api-reference/emails/send-email
