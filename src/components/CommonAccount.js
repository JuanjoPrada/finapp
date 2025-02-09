import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { Box, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

function CommonAccount() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(dayjs());
  const [type, setType] = useState("expense");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "commonAccount", "transactions", "items"),
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trans = [];
      snapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    });
    return () => unsubscribe();
  }, []);

  const handleAddTransaction = async () => {
    if (!amount || !category) {
      alert("Complete los campos requeridos.");
      return;
    }
    try {
      await addDoc(collection(db, "commonAccount", "transactions", "items"), {
        amount: parseFloat(amount),
        category,
        note,
        date: date.toDate(),
        type
      });
      setAmount("");
      setCategory("");
      setNote("");
      setDate(dayjs());
      setType("expense");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">Cuenta Común</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select
          labelId="type-label"
          value={type}
          label="Tipo"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="income">{t("income")}</MenuItem>
          <MenuItem value="expense">{t("expense")}</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label={t("amount")}
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="category-label">{t("category")}</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          label={t("category")}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="Alimentación">Alimentación</MenuItem>
          <MenuItem value="Transporte">Transporte</MenuItem>
          <MenuItem value="Ocio">Ocio</MenuItem>
          <MenuItem value="Salario">Salario</MenuItem>
          <MenuItem value="Otros">Otros</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label={t("note")}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      />
      <TextField
        label={t("date")}
        type="date"
        value={date.format("YYYY-MM-DD")}
        onChange={(e) => setDate(dayjs(e.target.value))}
        fullWidth
        sx={{ mt: 2 }}
        InputLabelProps={{ shrink: true }}
      />
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddTransaction}>
        {t("submit")}
      </Button>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Historial de transacciones en la Cuenta Común</Typography>
        {transactions.map((tr) => (
          <Box key={tr.id} sx={{ borderBottom: "1px solid #ccc", mt: 1, pb: 1 }}>
            <Typography>{tr.type === "income" ? t("income") : t("expense")}: {tr.amount}</Typography>
            <Typography>{t("category")}: {tr.category}</Typography>
            <Typography>{t("note")}: {tr.note}</Typography>
            <Typography>{t("date")}: {new Date(tr.date.seconds * 1000).toLocaleDateString()}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default CommonAccount;
