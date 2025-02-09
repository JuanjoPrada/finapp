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
