import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({
      connected: false,
      reason: "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY",
    });
  }

  try {
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: classes, error: classErr } = await admin
      .from("classes")
      .select("id, name, display_name");

    if (classErr) {
      return NextResponse.json({
        connected: true,
        schemaReady: false,
        projectUrl: supabaseUrl,
        message:
          "Connected to Supabase project, but tables are not created yet. Please run supabase/schema.sql in the Supabase SQL Editor.",
        details: classErr.message,
      });
    }

    const { count: profileCount } = await admin
      .from("profiles")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({
      connected: true,
      schemaReady: true,
      projectUrl: supabaseUrl,
      classesCount: classes?.length || 0,
      profilesCount: profileCount || 0,
    });
  } catch (err) {
    return NextResponse.json({
      connected: false,
      reason: err instanceof Error ? err.message : "Unknown connection error",
    });
  }
}
