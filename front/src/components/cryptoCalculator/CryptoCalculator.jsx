import React, { useEffect, useState } from "react";
import styles from "./cryptoCalculator.module.css";
import { FaBitcoin, FaEthereum } from "react-icons/fa";
import { SiTon, SiTether } from "react-icons/si";
import { MdKeyboardArrowDown } from "react-icons/md";

const CRYPTO_LIST = [
  { id: "bitcoin", name: "BTC", icon: <FaBitcoin color="#f7931a" /> },
  { id: "ethereum", name: "ETH", icon: <FaEthereum color="#3c3c3d" /> },
  { id: "the-open-network", name: "TON", icon: <SiTon color="#0098ea" /> },
  { id: "tether", name: "USDT", icon: <SiTether color="#26a17b" /> },
];

const CryptoCalculator = () => {
  const [rates, setRates] = useState({});
  const [selected, setSelected] = useState(CRYPTO_LIST[3]);
  const [amount, setAmount] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mode, setMode] = useState("buy"); // buy (пользователь покупает у тебя), sell (пользователь продаёт тебе)
  const [result, setResult] = useState({ total: 0, rate: 0 });

  useEffect(() => {
    fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,the-open-network,tether&vs_currencies=rub"
    )
      .then((res) => res.json())
      .then((data) => setRates(data));
  }, []);

  useEffect(() => {
    if (!rates[selected.id]) return;

    const baseRate = rates[selected.id].rub;
    const qty = parseFloat(amount) || 1;
    const finalRate = mode === "sell" ? baseRate * 0.8 : baseRate * 1.2; // ✅ теперь логика верная
    const total = qty * finalRate;

    setResult({ total: total.toFixed(2), rate: finalRate.toFixed(2) });
  }, [amount, selected, rates, mode]);

  const handleSelect = (coin) => {
    setSelected(coin);
    setDropdownOpen(false);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.title}>Калькулятор обмена</h3>

      <div className={styles.toggle}>
        <button
          className={`${styles.btn} ${mode === "sell" ? styles.sell : ""}`}
          onClick={() => setMode("sell")}
        >
          Продать
        </button>
        <button
          className={`${styles.btn} ${mode === "buy" ? styles.buy : ""}`}
          onClick={() => setMode("buy")}
        >
          Купить
        </button>
      </div>

      <div className={styles.dropdownWrapper}>
        <div
          className={styles.dropdown}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className={styles.icon}>{selected.icon}</span>
          <span>{selected.name}</span>
          <MdKeyboardArrowDown className={styles.arrow} />
        </div>
        {dropdownOpen && (
          <ul className={styles.dropdownList}>
            {CRYPTO_LIST.map((coin) => (
              <li key={coin.id} onClick={() => handleSelect(coin)}>
                <span className={styles.icon}>{coin.icon}</span>
                <span>{coin.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {rates[selected.id]?.rub && (
        <p className={styles.rate}>
          {mode === "buy" ? "Курс продажи:" : "Курс покупки:"}{" "}
          <strong>{parseFloat(result.rate).toLocaleString()} ₽</strong>
        </p>
      )}

      <input
        type="number"
        placeholder="Введите количество"
        className={styles.input}
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <p className={styles.total}>
        💰 Итог: <strong>{result.total} ₽</strong>
      </p>
    </div>
  );
};

export default CryptoCalculator;
