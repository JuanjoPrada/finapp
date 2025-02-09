import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";

function Reminders({ dailyBudget = 800 }) {
  const [user, setUser] = useState(null);
  const [todayExpense, setTodayExpense] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const today = dayjs().startOf("day").toDate();
    const tomorrow = dayjs().endOf("day").toDate();
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      where("date", ">=", today),
      where("date", "<=", tomorrow),
      where("type", "==", "expense")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        total += doc.data().amount;
      });
      setTodayExpense(total);
    });
    return () => unsubscribe();
  }, [user, dailyBudget]);

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 2 }}>
      {todayExpense > dailyBudget ? (
        <Typography color="error">
          Atención: Has superado tu presupuesto diario de {dailyBudget}. Gastaste {todayExpense}.
        </Typography>
      ) : (
        <Typography color="primary">
          Estás dentro del presupuesto diario.
        </Typography>
      )}
    </Box>
  );
}

export default Reminders;
