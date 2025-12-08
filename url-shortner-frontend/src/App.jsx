import React from "react";
import ShortenerForm from "./components/ShortenerForm";

function App() {
  return (
    <div>
      {/* Top Navigation Branding */}
      <header style={styles.header}>
        <div style={styles.brand}>
          richard<span style={styles.red}>.dev</span>
        </div>
      </header>

      {/* Main Content */}
      <div style={{ marginTop: "80px" }}>
        <ShortenerForm />
      </div>
    </div>
  );
}

const styles = {
  header: {
    width: "100%",
    padding: "18px 35px",
    position: "fixed",
    top: 0,
    left: 0,
    background: "#ffffff",
    borderBottom: "1px solid #eee",
    display: "flex",
    alignItems: "center",
    zIndex: 1000,
    boxShadow: "0 3px 10px rgba(0,0,0,0.05)",
  },

  brand: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#111",
    letterSpacing: "0.5px",
    fontFamily: "Inter, sans-serif",
  },

  red: {
    color: "red",
  },
};

export default App;
