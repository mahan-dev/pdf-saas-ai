"use client";
import { useState } from "react";
import { Button } from "@/core/components/ui/button";
import axios from "axios";

const SubscriptionButton = ({ isPro }: { isPro: boolean }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubscription = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/stripe");
      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="px-4 py-5 cursor-pointer"
      onClick={handleSubscription}
      disabled={loading}
    >
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};

export default SubscriptionButton;
