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

  {
    console.log(isPro);
  }

  return (
    <Button
      className={"p-4 py-5"}
      onClick={handleSubscription}
      disabled={loading}
    >
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};

export default SubscriptionButton;
