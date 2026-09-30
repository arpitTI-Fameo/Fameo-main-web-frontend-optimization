"use client";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useLoginMutation } from '@/lib/hooks/auth/useAuth';
import { toUserMessage } from "@/lib/api/errors";
import { safeRedirect } from "@/lib/security/safeRedirect";
import { loginSchema, LOGIN_DEFAULT_VALUES } from "../schema";
import AuthShell from "@/components/Layout/AuthShell";
import LoginStory from "../LoginStory";
import LoginForm from "../LoginForm";
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { ROUTES } from '@/constants/routes';


export default function LoginContainer() {
  const params = useSearchParams();
  const router = useRouter();
  const { login, user } = useAuthStore();
  const loginMutation = useLoginMutation();

  /* React Hook Form owns the field state; zod owns the rules. `onSubmit` for
     both modes keeps the old timing exactly — nothing goes red while you type,
     and a message stays put until the next submit attempt. */
  /** @type {import('react-hook-form').UseFormReturn<import('../schema').LoginValues>} */
  const { register, handleSubmit, control, formState: { errors: fieldErrors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: LOGIN_DEFAULT_VALUES,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const isPending = loginMutation.isPending;
  // One line, one message — the required-field rule and the server error can
  // never both be live, because submit resets the mutation before validating.
  const validationError = fieldErrors.username?.message || fieldErrors.password?.message || "";
  const invalid = { username: Boolean(fieldErrors.username), password: Boolean(fieldErrors.password) };

  // Display only: Sign in lights up (one shine) once both fields have text.
  const [usernameValue, passwordValue] = useWatch({ control, name: ["username", "password"] });
  const ready = Boolean(usernameValue && passwordValue);
  const error = validationError || (loginMutation.error ? toUserMessage(loginMutation.error) : "");

  // Compute this AFTER mount so server and first client render agree (both
  // false), avoiding a hydration mismatch. It flips to true on the client only.
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSessionExpired(
      new URLSearchParams(window.location.search).get("reason") === "session_expired"
    );
  }, []);

  useEffect(() => {
    if (user) router.replace(ROUTES.HOME);
  }, [user, router]);

  const onValid = async ({ username, password }) => {
    try {
      // Posts to our own /api/auth/login, which calls upstream server-side and
      // returns ONLY a Set-Cookie. The session token never reaches this code —
      // that is the point of the httpOnly cookie (defect #4).
      const data = await loginMutation.mutateAsync({ username, password });

      const user = data?.user ?? null;

      if (typeof window !== "undefined") {
        // No credential is written here any more. The session token and the app
        // token are both httpOnly cookies set by /api/auth/login; `fameo_user`
        // is the user OBJECT, read by the socket hooks for their handshake
        // payload, and `fameo_just_logged_in` is a one-shot UI flag.
        if (user) sessionStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        sessionStorage.setItem(STORAGE_KEYS.JUST_LOGGED_IN, "1");
      }

      login(user, null);
      // Never navigate to a raw query-string value — that is an open redirect.
      // safeRedirect() reduces it to a same-origin path or falls back to "/".
      window.location.assign(safeRedirect(params.get("redirect")));
    } catch (err) {
      // Error is handled by loginMutation.error
    }
  };

  // The card has no <form> element, so the button and the Enter key call this
  // directly — same entry point as before. Clearing the previous server error
  // ahead of validation preserves the old ordering.
  const handleLogin = () => {
    loginMutation.reset();
    return handleSubmit(onValid)();
  };

  return (
    <AuthShell prompt="New to Fameo?" linkLabel="Join the circle" href={ROUTES.REGISTER} footer>
      <div className="mx-auto grid max-w-275 grid-cols-2 items-center gap-20 px-16.25 pt-17.5 pb-15 min-[1100px]:gap-23.75 min-[1100px]:pt-22.5 min-[1100px]:pb-21.25 max-[851px]:grid-cols-[minmax(0,.9fr)_minmax(0,1fr)] max-[851px]:gap-8.75 max-[851px]:px-8.5 max-[851px]:py-12.5 max-[651px]:block max-[651px]:px-6.25 max-[651px]:pt-6.75 max-[651px]:pb-9">
        <LoginStory />

        <section
          aria-label="Account access"
          className="min-w-0 border-l border-border/70 pl-11 max-[851px]:pl-7 max-[651px]:mx-auto max-[651px]:max-w-97.5 max-[651px]:border-t max-[651px]:border-l-0 max-[651px]:pt-6.5 max-[651px]:pl-0"
        >
          <LoginForm
            register={register}
            loading={isPending}
            error={error}
            invalid={invalid}
            ready={ready}
            isSessionExpired={isSessionExpired}
            handleLogin={handleLogin}
          />
        </section>
      </div>
    </AuthShell>
  );
}
