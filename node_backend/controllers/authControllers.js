
import prisma from "../prisma/prismaClient.js";
import supabase from "../supabaseClient.js";

export const signup = async (req, res) => {
  const { email, password, name, role } = req.body;
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  // Upsert user in Prisma
  if (data?.user) {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email, name, role: role || 'INVESTOR' },
      create: { id: data.user.id, email, name, role: role || 'INVESTOR' },
    });
  }
  res.json({ message: "Signup successful, verify your email!", data });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return res.status(400).json({ error: error.message });
  // Upsert user in Prisma
  if (data?.user) {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { email },
      create: { id: data.user.id, email },
    });
  }
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
