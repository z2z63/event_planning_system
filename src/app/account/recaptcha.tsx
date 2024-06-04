"use client";
import React, { useCallback, useState } from "react";
import { GoogleReCaptcha } from "react-google-recaptcha-v3";

export default function useRecaptcha(): [
  string,
  () => void,
  () => React.ReactNode,
] {
  const [token, setToken] = useState("");
  const [refresh, setRefresh] = useState(false);
  const onVerify = useCallback(
    (t: string) => {
      setToken(t);
    },
    [setToken],
  );
  const refreshRecaptcha = useCallback(() => {
    setRefresh(!refresh);
  }, [refresh]);
  const ReCaptcha = useCallback(
    () => <GoogleReCaptcha onVerify={onVerify} refreshReCaptcha={refresh} />,
    [onVerify, refresh],
  );
  return [token, refreshRecaptcha, ReCaptcha];
}
