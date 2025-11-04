import React, { useState } from "react";
import "../styles/CSS/donations.css";

function Donations() {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const presetAmounts = [5, 10, 20, 50];

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      alert("Alege o sumă validă");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Number(amount) })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url; // redirect to Stripe Checkout
      } else {
        alert("Eroare la inițierea plății");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      alert("Eroare de conexiune la server");
      setLoading(false);
    }
  };

  return (
    <div className="donations-container">
      <h1>Support Our Mission </h1>
      <p>Your donation helps us reunite lost items with their owners.</p>

      {/* preset amounts */}
      <div className="buttons-container">
        {presetAmounts.map((value) => (
          <button key={value} onClick={() => setAmount(value)}>
            {value}€
          </button>
        ))}
      </div>

      {/* custom amount input */}
      <input
        type="number"
        placeholder="Custom amount (€)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      {/* Stripe donate button */}
      <button className="donate-btn" onClick={handleDonate} disabled={loading}>
        {loading ? "Se încarcă..." : "Donate with Card (Stripe)"}
      </button>

      {/* Revolut section */}
      <h2 style={{ marginTop: "30px", marginBottom: "20px" }}>
        Donate via Revolut 💸
      </h2>

      <div className="donation-options">
        {/* QR */}
        <div className="qr-section">
          <img
            src="/Pictures/revolutQR.jpeg"  
            alt="Revolut QR"
            className="qr-img"
          />
        </div>

        {/* OR */}
        <div className="or-text">OR</div>

        {/* Button link */}
        <div className="btn-section">
          <a
            href="https://revolut.me/madali1nvm"
            target="_blank"
            rel="noopener noreferrer"
            className="revolut-btn"
          >
            Open Revolut 🔗
          </a>
        </div>
      </div>
    </div>
  );
}

export default Donations;
