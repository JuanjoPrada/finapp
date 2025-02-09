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
