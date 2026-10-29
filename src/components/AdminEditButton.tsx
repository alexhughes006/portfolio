"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Renders an Edit link on public project pages only when an admin session
// exists in this browser. The check is cosmetic — real protection is the
// server-side middleware + RLS on the admin routes themselves.
export default function AdminEditButton({ projectId }: { projectId: string }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(!!user);
    });
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href={`/admin/edit/${projectId}`}
      className="rounded-full border border-line px-5 py-2.5 text-sm font-medium text-subtle transition-colors hover:border-accent hover:text-accent"
    >
      Edit ✎
    </Link>
  );
}
