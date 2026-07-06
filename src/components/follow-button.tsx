"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function FollowButton({
  followeeId,
  initiallyFollowing,
}: {
  followeeId: string;
  initiallyFollowing: boolean;
}) {
  const router = useRouter();
  const [following, setFollowing] = useState(initiallyFollowing);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    try {
      const res = await fetch("/api/follows", {
        method: following ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId }),
      });
      if (res.ok) {
        setFollowing(!following);
        router.refresh();
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={following ? "btn-secondary" : "btn-primary"}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
