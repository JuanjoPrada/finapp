import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Box, Typography, TextField, Button } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";

function Settings() {
  const [user, setUser] = useState(null);
  const [expensePercentage, setExpensePercentage] = useState(50);
  const [savingsPercentage, setSavingsPercentage] = useState(30);
  const [investmentPercentage, setInvestmentPercentage] = useState(20);
  const [dailyBudget, setDailyBudget] = useState(100);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const fetchSettings = async () => {
      const docRef = doc(db, "users", user.uid, "settings", "preferences");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExpensePercentage(data.expensePercentage);
        setSavingsPercentage(data.savingsPercentage);
        setInvestmentPercentage(data.investmentPercentage);
        setDailyBudget(data.dailyBudget);
      }
    };
    fetchSettings();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      alert("No estás autenticado.");
      return;
    }
    try {
      await setDoc(doc(db, "users", user.uid, "settings", "preferences"), {
        expensePercentage: Number(expensePercentage),
        savingsPercentage: Number(savingsPercentage),
        investmentPercentage: Number(investmentPercentage),
        dailyBudget: Number(dailyBudget)
      });
      alert("Configuración guardada!");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Configuración</Typography>
      <TextField
        label="Porcentaje de Gastos"
        type="number"
        value={expensePercentage}
        onChange={(e) => setExpensePercentage(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Porcentaje de Ahorros"
        type="number"
        value={savingsPercentage}
        onChange={(e) => setSavingsPercentage(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Porcentaje de Inversiones"
        type="number"
        value={investmentPercentage}
        onChange={(e) => setInvestmentPercentage(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label="Presupuesto Diario"
        type="number"
        value={dailyBudget}
        onChange={(e) => setDailyBudget(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSave}>
        Guardar Configuración
      </Button>
    </Box>
  );
}

export default Settings;
