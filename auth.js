/* ════════════════════════════════════════════════════════════════
   SUPABASE AUTH & DB  (replaces Firebase)
   Loaded as an ES module. Exposes window.AUTH and window.DB.
   ════════════════════════════════════════════════════════════════ */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const url = window.SUPABASE_URL;
const key = window.SUPABASE_ANON_KEY;

let client = null;
let initError = null;

try {
  if (!url || !key || url.includes("YOUR-PROJECT") || key.includes("YOUR-ANON")) {
    throw new Error("Supabase keys not configured in supabase-config.js");
  }
  client = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
  window.SUPABASE_READY = true;
} catch (e) {
  initError = e.message;
  window.SUPABASE_READY = false;
  window.SUPABASE_ERROR = e.message;
  console.error("Supabase init error:", e);
}

/* ---------- AUTH ---------- */
const AUTH = {
  get _sb() {
    if (!client) throw new Error("Supabase not initialized - " + (initError || "unknown error"));
    return client;
  },

  async googleSignUp() {
    const { data, error } = await this._sb.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/index.html" }
    });
    if (error) throw error;
    return data; // triggers redirect; result handled in onAuthChange
  },

  async googleLogin() {
    return this.googleSignUp(); // same OAuth flow
  },

  async emailSignUp(name, email, password) {
    const { data, error } = await this._sb.auth.signUp({ email, password, options: { data: { full_name: name } } });
    if (error) throw error;
    if (data.user && data.user.identities && data.user.identities.length === 0)
      throw { code: "auth/email-already-in-use", message: "This email is already registered." };
    return data.user;
  },

  async emailLogin(email, password) {
    const { data, error } = await this._sb.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },

  async logout() {
    const { error } = await this._sb.auth.signOut();
    if (error) throw error;
  },

  onAuthChange(cb) {
    if (!client) return () => {};
    const { data } = this._sb.auth.onAuthStateChange((_event, session) => cb(session?.user || null));
    return data.subscription.unsubscribe;
  },

  currentUser() {
    return client ? client.auth.getUser().then(r => r.data.user).catch(() => null) : Promise.resolve(null);
  }
};

/* ---------- DB (Postgres tables) ---------- */
// Create / refresh a profile row for ANY authenticated user (Google or email,
// new or existing). Safe to call repeatedly.
async function ensureProfile(user, extra = {}) {
  if (!user) return;
  const provider = user.app_metadata?.provider
    || (user.identities && user.identities[0] && user.identities[0].provider)
    || (user.user_metadata && user.user_metadata.full_name ? "email" : "email");
  const { error } = await client.from("profiles").upsert({
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Learner",
    email: user.email,
    phone: user.phone || null,
    provider,
    ...extra
  }, { onConflict: "id" });
  if (error) console.warn("profile upsert warn:", error.message);
}

// Called automatically whenever a session is present (incl. after OAuth return).
// Creates the profile and, on auth pages, sends the user home.
function autoHandleSession(user) {
  if (!user || !client) return;
  const isAuthPage = /(signup|login)\.html$/.test(window.location.pathname);
  ensureProfile(user).catch(() => {}).finally(() => {
    if (isAuthPage) window.location.href = "index.html";
  });
}

if (client) {
  // React to OAuth redirect / login / signup immediately
  AUTH.onAuthChange(autoHandleSession);
  // Also check the current session on load (handles page refresh while logged in)
  client.auth.getUser().then(({ data }) => { if (data.user) autoHandleSession(data.user); }).catch(() => {});
}

const DB = {
  async saveFoundingMember(data) {
    if (!client) throw new Error("Database not initialized");
    const { data: user } = await client.auth.getUser();
    const uid = user?.user?.id || null;
    await ensureProfile(user?.user, { full_name: data.name, phone: data.phone });
    const { error } = await client.from("founding_members").insert({
      user_id: uid, full_name: data.name, email: data.email,
      phone: data.phone, provider: data.provider || "email"
    });
    if (error) throw error;
  },

  async saveJoinCommunity(data) {
    if (!client) throw new Error("Database not initialized");
    const { data: user } = await client.auth.getUser();
    const uid = user?.user?.id || null;
    const v = (...keys) => keys.map(k => data[k]).find(v => v !== undefined && v !== "");
    const { error } = await client.from("join_community").insert({
      user_id: uid,
      full_name: v("fullName", "jcName", "Full Name *"),
      email: v("email", "jcEmail", "Email *"),
      college: v("college", "jcCollege"),
      branch: v("branch", "jcBranch"),
      year: v("year", "jcYear"),
      linkedin: v("linkedin", "jcLinkedin"),
      github: v("github", "jcGithub"),
      goal: v("goal", "jcGoal"),
      why_join: v("whyJoin", "jcWhy")
    });
    if (error) throw error;
  },

  async saveStartupForm(data) {
    if (!client) throw new Error("Database not initialized");
    const { data: user } = await client.auth.getUser();
    const uid = user?.user?.id || null;
    const v = (...keys) => keys.map(k => data[k]).find(x => x !== undefined && x !== "");
    const { error } = await client.from("startup_form").insert({
      user_id: uid,
      full_name: v("fullName", "startupName", "Full Name *"),
      email: v("email", "startupEmail", "Email *"),
      phone: v("phone", "startupPhone", "Phone Number *"),
      idea: v("idea", "startupIdea", "Your Startup Idea *")
    });
    if (error) throw error;
  }
};

window.AUTH = AUTH;
window.DB = DB;
