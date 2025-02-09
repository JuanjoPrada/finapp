import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Container, Typography, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Typography component="h1" variant="h5">{t("login")}</Typography>
        <TextField margin="normal" required fullWidth label={t("email")} value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField margin="normal" required fullWidth label={t("password")} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleLogin}>{t("login")}</Button>
        <Button fullWidth onClick={() => navigate("/register")} sx={{ mt: 1 }}>{t("register")}</Button>
      </Box>
    </Container>
  );
}

export default Login;
