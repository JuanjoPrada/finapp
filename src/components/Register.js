import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        createdAt: new Date()
      });
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">{t("register")}</Typography>
        <TextField margin="normal" required fullWidth label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField margin="normal" required fullWidth label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleRegister}>{t("register")}</Button>
      </Box>
    </Container>
  );
}

export default Register;
