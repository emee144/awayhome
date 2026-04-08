import { Resend } from "resend";
import { connectDB } from "@/lib/mongodb";
import Message from "@/models/Message";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const body = await req.json();

    const { firstName, lastName, email, phone, state, message } = body;


    await connectDB();


    await Message.create({
      firstName,
      lastName,
      email,
      phone,
      state,
      message,
    });


    await resend.emails.send({
      from: "contact@awayhomehq.com",
      to: "anuemmanuela1@gmail.com",
      subject: "New Contact Message",
      html: `
        <h2>New Message from AwayHome</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>State:</strong> ${state || "N/A"}</p>
        <hr/>
        <p>${message}</p>
      `,
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error("CONTACT ERROR:", error);
    return Response.json({ success: false }, { status: 500 });
  }
}