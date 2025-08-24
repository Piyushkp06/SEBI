import supabase from "../supabaseClient.js";


export const signup = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Signup successful, verify your email!", data });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Login successful", data });
};


export const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

export const logout = async (req, res) => {
  const { error } = await supabase.auth.signOut();
  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "Logout successful" });
};
