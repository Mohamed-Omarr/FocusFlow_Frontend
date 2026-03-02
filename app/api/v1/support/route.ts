import { createServerSupabaseClient } from "@/lib/supabase/server";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
    
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

    const { type, subject, message } = await req.json();


    // Send email to your inbox via Loops
    const payload = {
      transactionalId: process.env.Support_TransactionalId, // set in env
      email: process.env.Support_Email, // your inbox
      dataVariables: {
        type,
        subject,
        message,
        userEmail: user.email,
      },
    };

     await axios.post("https://app.loops.so/api/v1/transactional", payload, {
      headers: {
        Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: `Server error:${error}` }, { status: 500 });
  }
}