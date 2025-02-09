import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { Button, TextField, Typography, Box, Grid, Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { onAuthStateChanged } from "firebase/auth";

function Goals() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [goalDescription, setGoalDescription] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "goals"), (snapshot) => {
      const goalsArray = [];
      snapshot.forEach((doc) => {
        goalsArray.push({ id: doc.id, ...doc.data() });
      });
      setGoals(goalsArray);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddGoal = async () => {
    if (!goalDescription || !targetAmount) {
      alert("Por favor complete todos los campos.");
      return;
    }
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "goals"), {
        description: goalDescription,
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        createdAt: new Date()
      });
      setGoalDescription("");
      setTargetAmount("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleUpdateGoal = async (goalId, newAmount) => {
    if (!user) return;
    const goalRef = doc(db, "users", user.uid, "goals", goalId);
    try {
      await updateDoc(goalRef, {
        currentAmount: newAmount
      });
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">{t("goals")}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <TextField label="Descripción de la meta" value={goalDescription} onChange={(e) => setGoalDescription(e.target.value)} fullWidth />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField label="Cantidad objetivo" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} fullWidth />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddGoal}>
        Agregar Meta
      </Button>
      <Box sx={{ mt: 4 }}>
        {goals.map((goal) => (
          <Paper key={goal.id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1">{goal.description}</Typography>
            <Typography variant="body2">
              {`Objetivo: ${goal.targetAmount} - Actual: ${goal.currentAmount}`}
            </Typography>
            <Button variant="outlined" sx={{ mt: 1 }} onClick={() => handleUpdateGoal(goal.id, goal.currentAmount + 50)}>
              Contribuir +50
            </Button>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}

export default Goals;
