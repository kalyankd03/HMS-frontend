"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { login, register, getProfile, getHospital } from "@/lib/api";
import type { LoginForm, RegisterForm } from "@/lib/types";
import { USER_ROLES, ROLE_NAMES } from "@/lib/types";
import clsx from "clsx";

export default function AuthPage() {
  const router = useRouter();
  const { setToken, setUser, setHospital, setLoading, isLoading, isAuthenticated } = useAuthStore();

  // If authenticated, push to dashboard immediately
  useEffect(() => {
    if (isAuthenticated()) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const [loginData, setLoginData] = useState<LoginForm>({ email: "", password: "" });
  const [registerData, setRegisterData] = useState<RegisterForm>({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role_id: USER_ROLES.FRONTDESK,
    hospital_id: 1,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) { setError("Email and password are required"); return; }
    setError(""); setLoading(true);
    try {
      const response = await login(loginData);
      setToken(response.token);
      const profile = await getProfile(response.token);
      setUser(profile);
      
      // Fetch hospital information
      try {
        const hospitalData = await getHospital(profile.hospital_id, response.token);
        setHospital(hospitalData);
      } catch (hospitalError) {
        console.warn('Failed to fetch hospital data during login:', hospitalError);
        // Continue with login even if hospital fetch fails
      }
      
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerData.first_name || !registerData.last_name || !registerData.email || !registerData.password) { setError("All fields are required"); return; }
    if (registerData.password !== registerData.confirmPassword) { setError("Passwords do not match"); return; }
    if (registerData.password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError(""); setLoading(true);
    try {
      await register(registerData);
      setMode("login");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="hidden md:block" />
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">HMS</h1>
          <p className="text-gray-600 mt-2">Hospital Management System</p>
        </div>

        <div className="card max-w-xl ml-auto">
          <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
            <button onClick={() => setMode("login")} className={clsx("flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors", mode === "login" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}>Login</button>
            <button onClick={() => setMode("register")} className={clsx("flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors", mode === "register" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900")}>Register</button>
          </div>

          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="label">Email</label>
                <input id="login-email" type="email" autoComplete="email" required className="input" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} placeholder="Enter your email" />
              </div>
              <div>
                <label htmlFor="login-password" className="label">Password</label>
                <input id="login-password" type="password" autoComplete="current-password" required className="input" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} placeholder="Enter your password" />
              </div>
              {error && <div className="error" role="alert">{error}</div>}
              <button type="submit" disabled={isLoading} className="btn w-full" aria-label={isLoading ? "Logging in..." : "Login"}>{isLoading ? "Logging in..." : "Login"}</button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="register-first-name">First Name</label>
                  <input id="register-first-name" className="input" required value={registerData.first_name} onChange={(e) => setRegisterData({ ...registerData, first_name: e.target.value })} />
                </div>
                <div>
                  <label className="label" htmlFor="register-last-name">Last Name</label>
                  <input id="register-last-name" className="input" required value={registerData.last_name} onChange={(e) => setRegisterData({ ...registerData, last_name: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="register-email">Email</label>
                <input id="register-email" type="email" className="input" required value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label" htmlFor="register-role">Role</label>
                  <select id="register-role" className="input" required value={registerData.role_id} onChange={(e) => setRegisterData({ ...registerData, role_id: Number(e.target.value) })}>
                    {Object.entries(ROLE_NAMES).map(([id, name]) => (
                      <option key={id} value={id}>{name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label" htmlFor="register-hospital">Hospital ID</label>
                  <input id="register-hospital" type="number" className="input" required value={registerData.hospital_id} onChange={(e) => setRegisterData({ ...registerData, hospital_id: Number(e.target.value) })} min="1" />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="register-password">Password</label>
                <input id="register-password" type="password" className="input" required value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
              </div>
              <div>
                <label className="label" htmlFor="register-confirm">Confirm Password</label>
                <input id="register-confirm" type="password" className="input" required value={registerData.confirmPassword} onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} />
              </div>
              {error && <div className="error" role="alert">{error}</div>}
              <button type="submit" disabled={isLoading} className="btn w-full" aria-label={isLoading ? "Creating account..." : "Create Account"}>{isLoading ? "Creating account..." : "Create Account"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
