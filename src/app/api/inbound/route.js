export async function POST(req) {
  try {
    const event = await req.json();

    console.log("FULL EVENT:", event);

    // Only handle incoming emails
    if (event.type !== "email.received") {
      return new Response("Ignored", { status: 200 });
    }

    const email = event.data;

    const from = email.from;
    const to = email.to?.[0];
    const subject = email.subject;

    console.log("EMAIL RECEIVED:", { from, to, subject });

    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Away Home <noreply@awayhomehq.com>",
        to: "anuemmanuela1@gmail.com",
        subject: `New email from ${from}: ${subject}`,
        html: `
          <p><strong>From:</strong> ${from}</p>
          <p><strong>To:</strong> ${to}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>This email was received via Away Home.</p>
        `,
      }),
    });


    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Away Home <noreply@awayhomehq.com>",
        to: from,
        subject: "We received your message",
        html: `
          <p>Hi,</p>
          <p>Thanks for contacting Away Home. We've received your message and will get back to you shortly.</p>
          <p>— Away Home Team</p>
        `,
      }),
    });

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("ERROR:", error);
    return new Response("Server error", { status: 500 });
  }
}