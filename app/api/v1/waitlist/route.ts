import { loops } from "@/lib/loops/loops";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
      });
    }

    //  Wrap loops call in try/catch
    try {
      await loops.createContact({
        email,
        mailingLists: {
          dsfdsf: true,
        },
      });
    } catch (err) {
      console.error("Loops error:", err);
      return new Response(
        JSON.stringify({ error: "Failed to subscribe contact" }),
        { status: 500 }
      );
    }

    return new Response(JSON.stringify({ success: true }));
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
