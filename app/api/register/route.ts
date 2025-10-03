import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVICE ROLE
);

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    // create user in Supabase auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // may want to handle confirmation differently later?
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // insert user into "users" table
    if (data.user) {
      const { error: dbError } = await supabase
        .from("users")
        .insert([{ id: data.user.id, email: data.user.email }]);

      if (dbError) {
        console.error("Error inserting into users table:", dbError.message);
      }
    }

    return NextResponse.json({ success: true, user: data.user });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
