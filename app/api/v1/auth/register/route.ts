import { base_url } from '@/lib/axios/axiosClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, username, confirmPassword } = await req.json();

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    const { data, error: authError } =
      await supabase.auth.signUp({ email, password, options: {
        emailRedirectTo:`${base_url}/login`,
    data: {
      username
    }
  } });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // DO NOT create profile yet
    // User must confirm email first

    return NextResponse.json({
      message: 'Registration successful. Please confirm your email before logging in.'
    });

  } catch (err) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
