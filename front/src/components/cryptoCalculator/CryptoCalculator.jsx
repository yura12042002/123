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
  const [cryptoAmount, setCryptoAmount] = useState("");
  const [rubAmount, setRubAmount] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mode, setMode] = useState("buy");
  const [rate, setRate] = useState(0);

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
    const adjustedRate = mode === "sell" ? baseRate * 0.9 : baseRate * 1.1;

    setRate(adjustedRate);
  }, [selected, rates, mode]);

  const handleCryptoChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) return; // ❌ блокируем отрицательное
    setCryptoAmount(value);
    const val = parseFloat(value);
    if (!isNaN(val)) {
      setRubAmount((val * rate).toFixed(2));
    } else {
      setRubAmount("");
    }
  };

  const handleRubChange = (e) => {
    const value = e.target.value;
    if (parseFloat(value) < 0) return; // ❌ блокируем отрицательное
    setRubAmount(value);
    const val = parseFloat(value);
    if (!isNaN(val)) {
      setCryptoAmount((val / rate).toFixed(6));
    } else {
      setCryptoAmount("");
    }
  };

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

      {rate && (
        <p className={styles.rate}>
          {mode === "buy" ? "Курс продажи:" : "Курс покупки:"}{" "}
          <strong>{parseFloat(rate).toLocaleString()} ₽</strong>
        </p>
      )}

      <input
        type="number"
        min="0"
        placeholder={`Введите сумму в ${selected.name}`}
        className={styles.input}
        value={cryptoAmount}
        onChange={handleCryptoChange}
      />

      <input
        type="number"
        min="0"
        placeholder="Или введите сумму в ₽"
        className={styles.input}
        value={rubAmount}
        onChange={handleRubChange}
      />

      <p className={styles.total}>
        💰 Итог: <strong>{rubAmount || 0} ₽</strong>
      </p>
    </div>
  );
};

export default CryptoCalculator;
