import { LoopsClient } from "loops";

const loops = new LoopsClient(process.env.LOOPS_API_KEY!);

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Email is required" }),
      { status: 400 }
    );
  }

  await loops.createContact({
    email,
    mailingLists: {            // subscribe to a real list
    "cmlclh3cv2h400i2t2uchc00x": true
  }
  });

  return new Response(JSON.stringify({ success: true }));
}
