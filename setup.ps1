# setup.ps1
# =====================================================
# Este script crea la estructura de carpetas y genera
# los archivos fuente con las mejoras solicitadas:
# - Optimización responsive y tema personalizado.
# - Botones de editar y borrar en transacciones.
# - Clasificación de ingresos/gastos por mes, totales anuales/históricos.
# - Tope mensual para categorías y cálculo automático del presupuesto diario.
# - Gestión de cuentas comunes (múltiples).
#
# Reemplaza los valores de Firebase en firebase.js según tu proyecto.
# =====================================================

Write-Output "Creando estructura de carpetas..."
New-Item -ItemType Directory -Force -Path "src\components" | Out-Null

# ---------------------------
# Crear src/firebase.js
# ---------------------------
Write-Output "Creando src\firebase.js..."
@'
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyB1Ldt4hVZBkqn93I5bRn3QDFyPO-l3fpg",
    authDomain: "finapp-21fa0.firebaseapp.com",
    projectId: "finapp-21fa0",
    storageBucket: "finapp-21fa0.firebasestorage.app",
    messagingSenderId: "882910558285",
    appId: "1:882910558285:web:838e30b1b21c8ade2ec404",
    measurementId: "G-WLC3LXN06C"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
'@ | Set-Content -Path "src\firebase.js"

# ---------------------------
# Crear src/i18n.js
# ---------------------------
Write-Output "Creando src\i18n.js..."
@'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      logout: "Logout",
      dashboard: "Dashboard",
      income: "Income",
      expense: "Expense",
      addTransaction: "Add Transaction",
      editTransaction: "Edit Transaction",
      deleteTransaction: "Delete Transaction",
      amount: "Amount",
      category: "Category",
      note: "Note",
      date: "Date",
      month: "Month",
      submit: "Submit",
      dailyBudget: "Daily Budget",
      recommendations: "Recommendations",
      savings: "Savings",
      investments: "Investments",
      commonAccount: "Common Account",
      personalAccount: "Personal Account",
      goals: "Goals",
      exportCSV: "Export CSV",
      notifications: "Notifications",
      settings: "Settings",
      budgetTracker: "Budget Tracker",
      commonAccounts: "Common Accounts",
      totalMonthly: "Total Monthly",
      totalAnnual: "Total Annual",
      totalHistorical: "Total Historical",
      expenseCap: "Expense Cap"
    }
  },
  es: {
    translation: {
      welcome: "Bienvenido",
      login: "Iniciar sesión",
      register: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      logout: "Cerrar sesión",
      dashboard: "Tablero",
      income: "Ingreso",
      expense: "Gasto",
      addTransaction: "Agregar transacción",
      editTransaction: "Editar transacción",
      deleteTransaction: "Borrar transacción",
      amount: "Cantidad",
      category: "Categoría",
      note: "Nota",
      date: "Fecha",
      month: "Mes",
      submit: "Enviar",
      dailyBudget: "Presupuesto Diario",
      recommendations: "Recomendaciones",
      savings: "Ahorros",
      investments: "Inversiones",
      commonAccount: "Cuenta Común",
      personalAccount: "Cuenta Personal",
      goals: "Metas",
      exportCSV: "Exportar CSV",
      notifications: "Notificaciones",
      settings: "Configuración",
      budgetTracker: "Control de Presupuesto",
      commonAccounts: "Cuentas Comunes",
      totalMonthly: "Total Mensual",
      totalAnnual: "Total Anual",
      totalHistorical: "Total Histórico",
      expenseCap: "Tope de Gastos"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
'@ | Set-Content -Path "src\i18n.js"

# ---------------------------
# Crear src/App.js
# ---------------------------
Write-Output "Creando src\App.js..."
@'
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import BudgetTracker from "./components/BudgetTracker";
import CommonAccounts from "./components/CommonAccounts";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#dc004e" },
    background: { default: "#f5f5f5" }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/budget" element={<BudgetTracker />} />
          <Route path="/common" element={<CommonAccounts />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
'@ | Set-Content -Path "src\App.js"

# ---------------------------
# Crear src/index.js
# ---------------------------
Write-Output "Creando src\index.js..."
@'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./i18n";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
'@ | Set-Content -Path "src\index.js"

# ---------------------------
# Crear src/components/Login.js
# ---------------------------
Write-Output "Creando src\components\Login.js..."
@'
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
'@ | Set-Content -Path "src\components\Login.js"

# ---------------------------
# Crear src/components/Register.js
# ---------------------------
Write-Output "Creando src\components\Register.js..."
@'
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
'@ | Set-Content -Path "src\components\Register.js"

# ---------------------------
# Crear src/components/Dashboard.js
# ---------------------------
Write-Output "Creando src\components\Dashboard.js..."
@'
import React, { useState } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, Tabs, Tab, Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import Transactions from "./Transactions";
import Goals from "./Goals";
import Analytics from "./Analytics";
import Reminders from "./Reminders";
import BudgetTracker from "./BudgetTracker";
import CommonAccounts from "./CommonAccounts";
import { CSVLink } from "react-csv";

function Dashboard() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const csvData = [
    { date: "2025-01-01", type: "income", amount: 100, category: "Salary" },
    { date: "2025-01-02", type: "expense", amount: 50, category: "Food" }
  ];
  const headers = [
    { label: "Date", key: "date" },
    { label: "Type", key: "type" },
    { label: "Amount", key: "amount" },
    { label: "Category", key: "category" }
  ];

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Finanzas App</Typography>
          <Button color="inherit" onClick={() => handleChangeLanguage("es")}>ES</Button>
          <Button color="inherit" onClick={() => handleChangeLanguage("en")}>EN</Button>
          <Button color="inherit" onClick={() => navigate("/settings")}>{t("settings")}</Button>
          <Button color="inherit" onClick={handleLogout}>{t("logout")}</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label={t("dashboard")} />
          <Tab label={t("budgetTracker")} />
          <Tab label={t("commonAccounts")} />
          <Tab label={t("goals")} />
          <Tab label={t("exportCSV")} />
        </Tabs>
        <TabPanel value={tabValue} index={0}>
          <Transactions />
          <Reminders dailyBudget={800} />
          <Analytics />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <BudgetTracker />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <CommonAccounts />
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          <Goals />
        </TabPanel>
        <TabPanel value={tabValue} index={4}>
          <Typography variant="h6">Exportar Datos CSV</Typography>
          <CSVLink data={csvData} headers={headers} filename={"finanzas.csv"}>
            <Button variant="contained" color="primary" sx={{ mt: 2 }}>{t("exportCSV")}</Button>
          </CSVLink>
        </TabPanel>
      </Container>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && (<Box sx={{ p: 3 }}>{children}</Box>)}
    </div>
  );
}

export default Dashboard;
'@ | Set-Content -Path "src\components\Dashboard.js"

# ---------------------------
# Crear src/components/Transactions.js
# ---------------------------
Write-Output "Creando src\components\Transactions.js..."
@'
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
  const [month, setMonth] = useState(dayjs().format("MMMM"));
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
'@ | Set-Content -Path "src\components\Transactions.js"

# ---------------------------
# Crear src/components/BudgetTracker.js
# ---------------------------
Write-Output "Creando src\components\BudgetTracker.js..."
@'
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { onAuthStateChanged } from "firebase/auth";

function BudgetTracker() {
  const [user, setUser] = useState(null);
  const [monthlyBudget, setMonthlyBudget] = useState(800);
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
'@ | Set-Content -Path "src\components\BudgetTracker.js"

# ---------------------------
# Crear src/components/CommonAccounts.js
# ---------------------------
Write-Output "Creando src\components\CommonAccounts.js..."
@'
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
        createdAt: new Date()
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
'@ | Set-Content -Path "src\components\CommonAccounts.js"

Write-Output "Todos los archivos han sido creados correctamente."

# ---------------------------
# Instalar dependencias necesarias
# ---------------------------
Write-Output "Instalando dependencias necesarias. Esto puede tardar unos minutos..."
npm install react-router-dom @mui/material @mui/icons-material @emotion/react @emotion/styled firebase dayjs react-chartjs-2 chart.js i18next react-i18next react-csv

Write-Output "Setup completado. Ahora puedes iniciar la aplicación con 'npm start'."
