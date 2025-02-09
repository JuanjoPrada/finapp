import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Analytics() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "transactions"),
      orderBy("date", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const transArray = [];
      snapshot.forEach((doc) => {
        transArray.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(transArray);
    });
    return () => unsubscribe();
  }, [user]);

  if (!user) return <div>Cargando...</div>;

  const groupedData = {};
  transactions.forEach(tr => {
    const dateKey = dayjs(tr.date.seconds * 1000).format("YYYY-MM-DD");
    if (!groupedData[dateKey]) {
      groupedData[dateKey] = { income: 0, expense: 0 };
    }
    if (tr.type === "income") {
      groupedData[dateKey].income += tr.amount;
    } else {
      groupedData[dateKey].expense += tr.amount;
    }
  });
  const labels = Object.keys(groupedData);
  const incomeData = labels.map(date => groupedData[date].income);
  const expenseData = labels.map(date => groupedData[date].expense);

  const data = {
    labels,
    datasets: [
      {
        label: "Ingresos",
        data: incomeData,
        backgroundColor: "green"
      },
      {
        label: "Gastos",
        data: expenseData,
        backgroundColor: "red"
      }
    ]
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6">Análisis de transacciones</Typography>
      <Bar data={data} />
    </Box>
  );
}

export default Analytics;
