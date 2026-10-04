# Setting up hello@kylafallis.com

The site now shows `hello@kylafallis.com` on the Contact page and in the footer
of every page. **That address does not exist yet.** This guide sets it up.

Budget about 20 minutes, most of which is waiting for DNS.

---

## What I found on your domain already

I looked up your DNS before writing this, so these steps match your actual setup:

| Check | Result | What it means |
|---|---|---|
| Nameservers | `emma.ns.cloudflare.com`, `konnor.ns.cloudflare.com` | Your DNS is already managed by **Cloudflare**, which is the easy path |
| MX records | none | No mail is set up yet, so nothing can break |
| A records | `185.199.108–111.153` | GitHub Pages, serving the site |
| SPF / TXT | none | Nothing to merge or conflict with |

Because you're already on Cloudflare, **Cloudflare Email Routing** is the right
choice: it's free, unlimited, and adds the DNS records for you.

> **Important:** nothing below touches the `A` records that serve your site. Mail
> and web hosting are separate records on the same domain. Your site stays up.

---

## Part 1: Receiving mail (about 10 minutes)

This forwards anything sent to `hello@kylafallis.com` into your normal Gmail
inbox. You don't get a new inbox to check. It just lands in the one you use.

1. Go to **dash.cloudflare.com** and sign in.
2. Click **kylafallis.com** in your list of domains.
3. In the left sidebar, click **Email** → **Email Routing**.
4. Click **Get started**.
5. Under **Custom address**, enter:
   - Custom address: `hello`  (the `@kylafallis.com` is already filled in)
   - Action: **Send to an email**
   - Destination: `kylakayf@gmail.com`
6. Click **Save and continue** (or **Create**).
7. Cloudflare sends a verification email to `kylakayf@gmail.com`. **Open it and
   click the verification link.** The route stays inactive until you do, and this is
   the step people most often miss.
8. Cloudflare then offers to **add the required DNS records automatically**.
   Click **Add records and enable**. It adds three `MX` records and one `TXT`
   (SPF) record for you.

### Check it worked

Wait about 5 minutes, then send an email from your phone or another account to
`hello@kylafallis.com`. It should arrive in your Gmail inbox.

If it doesn't arrive after 15 minutes, check:
- Is the destination address verified? (Email Routing → Destination addresses, where
  it should say *Verified*, not *Pending*.)
- Is the route **Active**?
- Check your Gmail spam folder for the first message.

**At this point the address on your website works.** Part 2 is optional but worth
doing: without it, replies will come from your Gmail address.

---

## Part 2: Sending *from* that address (about 10 minutes)

Cloudflare Email Routing only forwards mail *in*; it cannot send mail *out*. If
someone emails `hello@kylafallis.com` and you hit reply, it'll go out as
`kylakayf@gmail.com`, which rather defeats the point for a press contact.

Gmail can send as your custom address using Google's own SMTP server.

### First, create a Google App Password

You need 2-Step Verification turned on for this to be available.

1. Go to **myaccount.google.com/security**.
2. Turn on **2-Step Verification** if it isn't already.
3. Then go to **myaccount.google.com/apppasswords**.
4. Name it something like `kylafallis.com mail` and click **Create**.
5. Copy the 16-character password it shows you. **You can't see it again**, so keep
   the tab open until step 6 below is done.

### Then add the address in Gmail

1. In Gmail, click the gear icon → **See all settings**.
2. Go to the **Accounts and Import** tab.
3. Next to **Send mail as**, click **Add another email address**.
4. In the popup:
   - Name: `Kyla Fallis`
   - Email address: `hello@kylafallis.com`
   - Leave **Treat as an alias** checked.
   - Click **Next Step**.
5. On the SMTP screen:
   - SMTP Server: `smtp.gmail.com`
   - Port: `587`
   - Username: `kylakayf@gmail.com`  *(your full Gmail address)*
   - Password: *the 16-character App Password from above*
   - Secured connection using **TLS**
   - Click **Add Account**.
6. Google emails a confirmation code to `hello@kylafallis.com`, which now
   forwards to your Gmail inbox from Part 1. Open it, copy the code, paste it in.

### Make it the default for replies

Still in **Accounts and Import**:

- Next to **Send mail as**, click **make default** beside `hello@kylafallis.com`
  if you want new mail to come from it by default.
- Set **When replying to a message** to *Reply from the same address the message
  was sent to*. This is the setting you actually want: mail to your personal
  address replies from your personal address, mail to `hello@` replies from
  `hello@`.

---

## Part 3: Make sure your mail doesn't land in spam

Cloudflare already added an SPF record in Part 1. Because you'll now also send
through Google, that record needs to allow Google too.

1. Cloudflare dashboard → **kylafallis.com** → **DNS** → **Records**.
2. Find the `TXT` record for `kylafallis.com` whose content starts with `v=spf1`.
   It will read something like:

   ```
   v=spf1 include:_spf.mx.cloudflare.net ~all
   ```

3. Click **Edit** and change it to:

   ```
   v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all
   ```

4. Save.

### Add a DMARC record

This tells receiving servers what to do with mail that fails checks, and stops
others from spoofing your domain. Add a new `TXT` record:

| Field | Value |
|---|---|
| Type | `TXT` |
| Name | `_dmarc` |
| Content | `v=DMARC1; p=none; rua=mailto:hello@kylafallis.com` |

`p=none` means "monitor only, don't reject anything": the safe setting to start
with. You can tighten it later once you know everything is passing.

### Test your setup

Send an email from `hello@kylafallis.com` to **check-auth@verifier.port25.com**.
You'll get an automated reply scoring SPF, DKIM, and DMARC. You want to see
`SPF check: pass` and `DMARC check: pass`.

Or use **mail-tester.com**: send a message to the address it gives you and it
scores your deliverability out of 10.

---

## If you'd rather have a real mailbox

Forwarding is free and fine for a contact address. If you'd prefer a genuine
inbox at `hello@kylafallis.com`, separate from your personal Gmail, with its own
login, and able to send without the SMTP workaround:

| Option | Cost | Notes |
|---|---|---|
| **Google Workspace** | ~$7/user/month | Familiar Gmail interface, own login, best deliverability. Skips Part 2 entirely. |
| **Fastmail** | ~$5/user/month | Independent, strong privacy stance, handles custom domains well. |
| **Zoho Mail** | Free tier for 1 user | Cheapest real mailbox; interface is clunkier. |

If you switch to one of these later, you'd remove the Cloudflare Email Routing
records and add the provider's MX records instead. The address on the website
stays the same, so nothing needs changing in the code.

---

## Changing the address later

The address lives in exactly one place in the codebase, `data.js`:

```js
email: "hello@kylafallis.com",
```

The footer on every page reads from that value. The Contact page has it in two
spots in `contact.html`. After changing `data.js`, run:

```bash
node build/prerender.js
node build/jsonld.js
```

to update the baked HTML and the structured data.
