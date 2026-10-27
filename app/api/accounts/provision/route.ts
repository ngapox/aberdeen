import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isValidTanzaniaPhone } from "@/lib/beem/sms";
import { StepClassKey, UserRole } from "@/lib/supabase/types";

export function phoneToInternalAuthEmail(phoneNumber: string): string {
  return `${phoneNumber.trim().replace(/^\+/, "")}@aberdeen.sc.tz`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      actorRole,
      accountType,
      phoneNumber,
      fullName,
      pupilName,
      assignedClass,
      tempPassword,
    } = body as {
      actorRole: UserRole;
      accountType: UserRole;
      phoneNumber: string;
      fullName: string; // For pupil account, this is Parent/Guardian Full Name
      pupilName?: string; // Required when accountType === 'parent'
      assignedClass?: StepClassKey; // Required for 'teacher' and 'parent'
      tempPassword?: string;
    };

    // Enforce RBAC for provisioning
    if (!["admin", "owner", "secretary"].includes(actorRole)) {
      return NextResponse.json(
        { error: "Only Admin, Owner, or Secretary can provision accounts." },
        { status: 403 }
      );
    }

    if (actorRole === "secretary" && accountType !== "parent") {
      return NextResponse.json(
        {
          error:
            "Secretaries are strictly permitted to register Pupil/Parent accounts only.",
        },
        { status: 403 }
      );
    }

    if (!isValidTanzaniaPhone(phoneNumber)) {
      return NextResponse.json(
        {
          error:
            "Phone number must strictly follow Tanzania format +255XXXXXXXXX (e.g., +255754123456).",
        },
        { status: 400 }
      );
    }

    if (accountType === "parent" && (!pupilName || !assignedClass)) {
      return NextResponse.json(
        {
          error:
            "Pupil accounts require both Pupil Full Name, Parent/Guardian Full Name, and assigned Step Class.",
        },
        { status: 400 }
      );
    }

    if (accountType === "teacher" && !assignedClass) {
      return NextResponse.json(
        { error: "Teacher accounts must be assigned to Step 1, Step 2, or Step 3." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // If Supabase Service Role is configured, provision in Supabase Auth + Postgres tables
    if (
      supabaseUrl &&
      serviceRoleKey &&
      !supabaseUrl.includes("your-project-id") &&
      serviceRoleKey !== "your-supabase-service-role-key"
    ) {
      const adminSupabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      // Check if profile with this +255 phone number already exists (e.g. parent enrolling another child)
      const { data: existingProfile } = await adminSupabase
        .from("profiles")
        .select("id")
        .eq("phone_number", phoneNumber.trim())
        .maybeSingle();

      let userId = existingProfile?.id;

      if (!userId) {
        const syntheticEmail = phoneToInternalAuthEmail(phoneNumber);
        const passwordToUse = tempPassword || "Aberdeen2026!";

        // Create user in Supabase Auth (supports both Phone Auth and Email fallback for Free Tier)
        const authUserRes = await adminSupabase.auth.admin.createUser({
          email: syntheticEmail,
          phone: phoneNumber.trim(),
          password: passwordToUse,
          email_confirm: true,
          phone_confirm: true,
          user_metadata: {
            full_name: fullName,
            phone_number: phoneNumber.trim(),
            role: accountType,
          },
        });

        if (authUserRes.error || !authUserRes.data.user) {
          return NextResponse.json(
            {
              error:
                authUserRes.error?.message ||
                "Failed to create Supabase Auth user.",
            },
            { status: 400 }
          );
        }

        userId = authUserRes.data.user.id;

        // Insert into profiles
        const { error: profileErr } = await adminSupabase
          .from("profiles")
          .upsert({
            id: userId,
            phone_number: phoneNumber.trim(),
            full_name: fullName.trim(),
            role: accountType,
          });

        if (profileErr) {
          return NextResponse.json(
            { error: profileErr.message },
            { status: 400 }
          );
        }
      }

      // Resolve class UUID if teacher or parent
      if (assignedClass && userId) {
        const { data: classRow } = await adminSupabase
          .from("classes")
          .select("id")
          .eq("name", assignedClass)
          .maybeSingle();

        if (classRow) {
          if (accountType === "teacher") {
            await adminSupabase.from("teacher_assignments").upsert(
              {
                teacher_id: userId,
                class_id: classRow.id,
              },
              { onConflict: "teacher_id,class_id" }
            );
          } else if (accountType === "parent" && pupilName) {
            await adminSupabase.from("pupils").insert({
              pupil_name: pupilName.trim(),
              parent_id: userId,
              parent_name: fullName.trim(),
              class_id: classRow.id,
              is_active: true,
            });
          }
        }
      }

      return NextResponse.json({
        ok: true,
        mode: "supabase_live",
        userId,
      });
    }

    // Otherwise return success for client state / demo persistence
    return NextResponse.json({
      ok: true,
      mode: "local_state",
      userId: `usr_${Date.now()}`,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Failed to provision account",
      },
      { status: 500 }
    );
  }
}
