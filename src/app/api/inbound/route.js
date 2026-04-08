export async function POST(req) {
  try {
    const data = await req.json();

    const email = {
      from: data.from,
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
      headers: data.headers,
    };

    const toAddress = Array.isArray(email.to) ? email.to[0] : email.to;

    console.log("FULL EMAIL DATA:", data);

    // Validate sender
    if (!email.from) {
      return new Response("Missing sender", { status: 400 });
    }

    // Only accept emails sent to your domain
    if (!toAddress || !toAddress.endsWith("@awayhomehq.com")) {
      return new Response("Ignored", { status: 200 });
    }

    console.log("EMAIL RECEIVED:", {
      to: toAddress,
      from: email.from,
      subject: email.subject,
      text: email.text,
    });

    // Optional routing logic
    if (toAddress.startsWith("contact@")) {
      console.log("Handling contact message");
    } else if (toAddress.startsWith("support@")) {
      console.log("Handling support message");
    } else {
      console.log("Handling general inbox");
    }

    // Auto-reply to sender
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Away Home <noreply@awayhomehq.com>",
        to: email.from,
        subject: "We received your message",
        html: `
          <p>Hi,</p>
          <p>Thanks for contacting Away Home. We've received your message and will get back to you shortly.</p>
          <p>— Away Home Team</p>
        `,
      }),
    });

    return new Response("Email received", { status: 200 });

  } catch (error) {
    console.error("INBOUND ERROR:", error);
    return new Response("Server error", { status: 500 });
  }
}