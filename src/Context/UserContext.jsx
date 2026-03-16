import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(user)

  useEffect(() => {
    const fetchUserRole = async (user) => {
      if (!user) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setRole(data.role);
          setUser(user);
        } else {
          setRole(null);
          setUser(user);
        }
      } catch (err) {
        console.error("Error fetching role:", err.message);
        setRole(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      fetchUserRole(session?.user);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserRole(session?.user || null);
    });

    // Cleanup the subscription correctly
    return () => {
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, role, setRole, loading }}>
      {children}
    </UserContext.Provider>
  );
};
