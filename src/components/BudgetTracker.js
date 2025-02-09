import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";

function BudgetTracker() {
  const [user, setUser] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(800); // Puedes ajustar el presupuesto mensual predeterminado o permitir configurarlo en Settings.
  const [spent, setSpent] = useState(0);
  const [dailyLimit, setDailyLimit] = useState(0);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const startOfMonth = dayjs().startOf("month").toDate();
    const endOfMonth = dayjs().endOf("month").toDate();
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      where("date", ">=", startOfMonth),
      where("date", "<=", endOfMonth)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      snapshot.forEach((doc) => {
        if(doc.data().type === "expense") {
          total += doc.data().amount;
        }
      });
      setSpent(total);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    const today = dayjs();
    const totalDays = today.daysInMonth();
    const currentDay = today.date();
    const remainingDays = totalDays - currentDay + 1;
    const remainingBudget = monthlyBudget - spent;
    setDailyLimit(remainingDays > 0 ? (remainingBudget / remainingDays).toFixed(2) : 0);
  }, [monthlyBudget, spent]);

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6">Control de Presupuesto</Typography>
      <Typography variant="body1">Presupuesto mensual: {monthlyBudget}€</Typography>
      <Typography variant="body1">Gasto acumulado: {spent}€</Typography>
      <Typography variant="body1">Días restantes: {dayjs().daysInMonth() - dayjs().date() + 1}</Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>Disponible diario: {dailyLimit}€</Typography>
    </Box>
  );
}

export default BudgetTracker;
