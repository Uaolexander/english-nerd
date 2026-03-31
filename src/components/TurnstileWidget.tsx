"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  widgetRef?: React.MutableRefObject<TurnstileInstance | null>;
}

export default function TurnstileWidget({ onToken, widgetRef }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <Turnstile
      ref={widgetRef}
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken("")}
      options={{
        size: "invisible",
        execution: "render",
      }}
    />
  );
}
