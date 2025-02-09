import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import DeleteIcon from "@mui/icons-material/Delete";

function CommonAccounts() {
  const [user, setUser] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [commonAccounts, setCommonAccounts] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(collection(db, "users", user.uid, "commonAccounts"), (snapshot) => {
      const accounts = [];
      snapshot.forEach((doc) => {
        accounts.push({ id: doc.id, ...doc.data() });
      });
      setCommonAccounts(accounts);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddAccount = async () => {
    if (!accountName) {
      alert("Introduce un nombre para la cuenta común.");
      return;
    }
    if (!user) return;
    try {
      await addDoc(collection(db, "users", user.uid, "commonAccounts"), {
        name: accountName,
        createdAt: new Date(),
        // Aquí podrías agregar más campos, como miembros, tope de gastos, etc.
      });
      setAccountName("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const handleDeleteAccount = async (id) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "commonAccounts", id));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <Box sx={{ mt: 3, p: 2, backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h6">Cuentas Comunes</Typography>
      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
        <TextField label="Nombre de la cuenta" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
        <Button variant="contained" color="primary" onClick={handleAddAccount}>Crear</Button>
      </Box>
      <List>
        {commonAccounts.map((account) => (
          <ListItem key={account.id} secondaryAction={
            <IconButton edge="end" onClick={() => handleDeleteAccount(account.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={account.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default CommonAccounts;
