/**
 * Integration tests for the auth page. Verifies every flow
 * (login, signup, OTP verify, forgot password, OAuth) calls supabase.auth
 * directly — no Lovable auth SDK, no other backend.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// --- Mocks -----------------------------------------------------------------
const auth = {
  signInWithPassword: vi.fn(),
  signUp: vi.fn(),
  verifyOtp: vi.fn(),
  resend: vi.fn(),
  resetPasswordForEmail: vi.fn(),
  signInWithOAuth: vi.fn(),
  onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
  signOut: vi.fn(),
};

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { auth },
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: null, session: null, loading: false, isLoggedIn: false, signOut: vi.fn() }),
}));

const toastFn = vi.fn();
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastFn }),
  toast: toastFn,
}));

// Import AFTER mocks so the component picks them up.
import Auth from "@/pages/Auth";

function renderAuth() {
  return render(
    <HelmetProvider>
      <MemoryRouter initialEntries={["/auth"]}>
        <Auth />
      </MemoryRouter>
    </HelmetProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  auth.onAuthStateChange.mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  } as any);
  auth.getSession.mockResolvedValue({ data: { session: null } } as any);
});

describe("Auth page — supabase.auth integration", () => {
  it("login submits to supabase.auth.signInWithPassword", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: {}, error: null });
    renderAuth();

    fireEvent.change(document.getElementById("login-email")!, {
      target: { value: "alice@test.com" },
    });
    fireEvent.change(document.getElementById("login-password")!, {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => expect(auth.signInWithPassword).toHaveBeenCalledTimes(1));
    expect(auth.signInWithPassword).toHaveBeenCalledWith({
      email: "alice@test.com",
      password: "secret123",
    });
  });

  it("signup submits to supabase.auth.signUp and shows OTP screen when email confirmation is required", async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { id: "u1" }, session: null },
      error: null,
    });
    renderAuth();

    // Switch to register view
    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));

    fireEvent.change(document.getElementById("register-username")!, {
      target: { value: "alice" },
    });
    fireEvent.change(document.getElementById("register-email")!, {
      target: { value: "alice@test.com" },
    });
    fireEvent.change(document.getElementById("register-password")!, {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(auth.signUp).toHaveBeenCalledTimes(1));
    const call = auth.signUp.mock.calls[0][0];
    expect(call.email).toBe("alice@test.com");
    expect(call.password).toBe("secret123");
    expect(call.options.data).toMatchObject({ username: "alice" });
    expect(call.options.emailRedirectTo).toContain("/");

    // OTP screen should mount
    await waitFor(() =>
      expect(screen.getByText(/verify|verification|enter.*code/i)).toBeTruthy(),
    );
  });

  it("OTP verify calls supabase.auth.verifyOtp with type 'signup'", async () => {
    auth.signUp.mockResolvedValue({
      data: { user: { id: "u1" }, session: null },
      error: null,
    });
    auth.verifyOtp.mockResolvedValue({ data: { session: null }, error: null });
    renderAuth();

    fireEvent.click(screen.getByRole("button", { name: /create an account/i }));
    fireEvent.change(document.getElementById("register-username")!, {
      target: { value: "alice" },
    });
    fireEvent.change(document.getElementById("register-email")!, {
      target: { value: "alice@test.com" },
    });
    fireEvent.change(document.getElementById("register-password")!, {
      target: { value: "secret123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => expect(auth.signUp).toHaveBeenCalled());

    // Fill 6 OTP digits
    const code = "123456";
    await waitFor(() => {
      // OtpVerification renders 6 single-char inputs
      const inputs = document.querySelectorAll<HTMLInputElement>(
        'input[inputmode="numeric"], input[maxlength="1"]',
      );
      expect(inputs.length).toBeGreaterThanOrEqual(6);
    });
    const inputs = Array.from(
      document.querySelectorAll<HTMLInputElement>(
        'input[inputmode="numeric"], input[maxlength="1"]',
      ),
    ).slice(0, 6);
    await act(async () => {
      inputs.forEach((el, i) =>
        fireEvent.change(el, { target: { value: code[i] } }),
      );
    });

    await waitFor(() => expect(auth.verifyOtp).toHaveBeenCalledTimes(1));
    expect(auth.verifyOtp).toHaveBeenCalledWith({
      email: "alice@test.com",
      token: code,
      type: "signup",
    });
  });

  it("forgot-password calls supabase.auth.resetPasswordForEmail with reset redirect", async () => {
    auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
    renderAuth();

    fireEvent.click(screen.getByRole("button", { name: /forgot password/i }));
    fireEvent.change(document.getElementById("forgot-email")!, {
      target: { value: "alice@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    await waitFor(() => expect(auth.resetPasswordForEmail).toHaveBeenCalledTimes(1));
    const [email, opts] = auth.resetPasswordForEmail.mock.calls[0];
    expect(email).toBe("alice@test.com");
    expect(opts.redirectTo).toContain("/reset-password");
  });

  it("Google OAuth button calls supabase.auth.signInWithOAuth with provider 'google'", async () => {
    auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    renderAuth();

    fireEvent.click(screen.getByRole("button", { name: /^google$/i }));

    await waitFor(() => expect(auth.signInWithOAuth).toHaveBeenCalledTimes(1));
    expect(auth.signInWithOAuth.mock.calls[0][0]).toMatchObject({ provider: "google" });
    expect(auth.signInWithOAuth.mock.calls[0][0].options.redirectTo).toMatch(/^https?:/);
  });

  it("GitHub OAuth button calls supabase.auth.signInWithOAuth with provider 'github'", async () => {
    auth.signInWithOAuth.mockResolvedValue({ data: {}, error: null });
    renderAuth();

    fireEvent.click(screen.getByRole("button", { name: /^github$/i }));

    await waitFor(() => expect(auth.signInWithOAuth).toHaveBeenCalledTimes(1));
    expect(auth.signInWithOAuth.mock.calls[0][0]).toMatchObject({ provider: "github" });
  });
});

describe("Auth surface — no Lovable auth SDK is wired in", () => {
  it("does not import the Lovable cloud-auth-js package", () => {
    // If the SDK were imported, vi.mock above would not stub it and the
    // mocked supabase client would be bypassed. Confirm at the module level
    // that the package is not present in the dependency graph.
    const pkg = require("../../package.json");
    expect(pkg.dependencies?.["@lovable.dev/cloud-auth-js"]).toBeUndefined();
    expect(pkg.devDependencies?.["@lovable.dev/cloud-auth-js"]).toBeUndefined();
  });
});
