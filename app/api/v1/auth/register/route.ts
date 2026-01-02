import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password, username, confirmPassword } = await req.json();

    // Validate passwords match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const supabase = await createServerSupabaseClient();

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create the profile
    const { data , error: profileError } = await supabase
      .from('profile')
      .insert({
        user_id: authData.user?.id,
        email: authData.user?.email,
        username
      });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'User registered successfully!' });
    
  } catch (err) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
