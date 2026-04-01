"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";

interface TurnstileWidgetProps {
  onToken: (token: string) => void;
  onError?: () => void;
  widgetRef?: React.MutableRefObject<TurnstileInstance | null>;
}

export default function TurnstileWidget({ onToken, onError, widgetRef }: TurnstileWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

  return (
    <Turnstile
      ref={widgetRef}
      siteKey={siteKey}
      onSuccess={onToken}
      onExpire={() => onToken("")}
      onError={onError}
      options={{
        appearance: "interaction-only",
      }}
    />
  );
}
