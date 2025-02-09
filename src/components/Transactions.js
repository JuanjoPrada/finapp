import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Box, Typography, IconButton } from "@mui/material";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function Transactions() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(dayjs());
  const [month, setMonth] = useState(dayjs().format("MMMM")); // e.g., "February"
  const [type, setType] = useState("expense");
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ amount: "", category: "", note: "", date: "", month: "", type: "" });

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
      orderBy("date", "desc")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const trans = [];
      querySnapshot.forEach((doc) => {
        trans.push({ id: doc.id, ...doc.data() });
      });
      setTransactions(trans);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTransaction = async () => {
    if (!amount || !category) {
      alert("Por favor complete los campos requeridos.");
      return;
    }
    if (!user) {
      alert("No estás autenticado.");
      return;
    }
    try {
      await addDoc(collection(db, "users", user.uid, "transactions"), {
        amount: parseFloat(amount),
        category,
        note,
        date: date.toDate(),
        month,
        type
      });
      setAmount("");
      setCategory("");
      setNote("");
      setDate(dayjs());
      setMonth(dayjs().format("MMMM"));
      setType("expense");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "transactions", id));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleEdit = (trans) => {
    setEditingId(trans.id);
    setEditData({
      amount: trans.amount,
      category: trans.category,
      note: trans.note,
      date: dayjs(trans.date.seconds * 1000).format("YYYY-MM-DD"),
      month: trans.month,
      type: trans.type
    });
  };

  const saveEdit = async () => {
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid, "transactions", editingId), {
        amount: parseFloat(editData.amount),
        category: editData.category,
        note: editData.note,
        date: dayjs(editData.date).toDate(),
        month: editData.month,
        type: editData.type
      });
      setEditingId(null);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6">{t("addTransaction")}</Typography>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select labelId="type-label" value={type} label="Tipo" onChange={(e) => setType(e.target.value)}>
          <MenuItem value="income">{t("income")}</MenuItem>
          <MenuItem value="expense">{t("expense")}</MenuItem>
        </Select>
      </FormControl>
      <TextField label={t("amount")} type="number" value={amount} onChange={(e) => setAmount(e.target.value)} fullWidth sx={{ mt: 2 }} />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="category-label">{t("category")}</InputLabel>
        <Select labelId="category-label" value={category} label={t("category")} onChange={(e) => setCategory(e.target.value)}>
          <MenuItem value="Alimentación">Alimentación</MenuItem>
          <MenuItem value="Transporte">Transporte</MenuItem>
          <MenuItem value="Ocio">Ocio</MenuItem>
          <MenuItem value="Salario">Salario</MenuItem>
          <MenuItem value="Otros">Otros</MenuItem>
        </Select>
      </FormControl>
      <TextField label={t("note")} value={note} onChange={(e) => setNote(e.target.value)} fullWidth sx={{ mt: 2 }} />
      <TextField label={t("date")} type="date" value={date.format("YYYY-MM-DD")} onChange={(e) => setDate(dayjs(e.target.value))} fullWidth sx={{ mt: 2 }} InputLabelProps={{ shrink: true }} />
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel id="month-label">{t("month")}</InputLabel>
        <Select labelId="month-label" value={month} label={t("month")} onChange={(e) => setMonth(e.target.value)}>
          {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
            <MenuItem key={m} value={m}>{m}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleAddTransaction}>{t("submit")}</Button>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Historial de transacciones</Typography>
        {transactions.map((trans) => (
          <Box key={trans.id} sx={{ borderBottom: "1px solid #ccc", mt: 1, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            {editingId === trans.id ? (
              <Box sx={{ width: "100%" }}>
                <TextField label={t("amount")} type="number" value={editData.amount} onChange={(e) => setEditData({ ...editData, amount: e.target.value })} sx={{ mt: 1 }} fullWidth />
                <TextField label={t("category")} value={editData.category} onChange={(e) => setEditData({ ...editData, category: e.target.value })} sx={{ mt: 1 }} fullWidth />
                <TextField label={t("note")} value={editData.note} onChange={(e) => setEditData({ ...editData, note: e.target.value })} sx={{ mt: 1 }} fullWidth />
                <TextField label={t("date")} type="date" value={editData.date} onChange={(e) => setEditData({ ...editData, date: e.target.value })} sx={{ mt: 1 }} fullWidth InputLabelProps={{ shrink: true }} />
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel id="edit-month-label">{t("month")}</InputLabel>
                  <Select labelId="edit-month-label" value={editData.month} label={t("month")} onChange={(e) => setEditData({ ...editData, month: e.target.value })}>
                    {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button variant="outlined" color="primary" sx={{ mt: 1 }} onClick={saveEdit}>Guardar</Button>
                <Button variant="text" color="secondary" sx={{ mt: 1 }} onClick={() => setEditingId(null)}>Cancelar</Button>
              </Box>
            ) : (
              <>
                <Box>
                  <Typography variant="body1">{trans.type === "income" ? t("income") : t("expense")}: {trans.amount}</Typography>
                  <Typography variant="body2">{t("category")}: {trans.category} | {t("note")}: {trans.note}</Typography>
                  <Typography variant="caption">{t("date")}: {new Date(trans.date.seconds * 1000).toLocaleDateString()} | {t("month")}: {trans.month}</Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleEdit(trans)} color="primary"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDelete(trans.id)} color="error"><DeleteIcon /></IconButton>
                </Box>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default Transactions;
