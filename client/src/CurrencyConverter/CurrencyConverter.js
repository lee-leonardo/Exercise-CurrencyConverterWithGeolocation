import React, {useState, useEffect} from "react";
import "./CurrencyConverter.css";

const CurrencyConverter = () => {
  const [supportedCurrencies, setSupportedCurrencies] = useState([]);
  const [amount, setAmount] = useState(0);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);
  const [fromCurrency, setFromCurrency] = useState('');
  const [toCurrency, setToCurrency] = useState('');
  const [conversionError, setConversionError] = useState('');

  const updateAmount = (event) => {
    reset();
    setAmount(Number(event.target.value));
  };
  const updateFromCurrency = (event) => {
    reset();
    setFromCurrency(event.target.value);
  };
  const updateToCurrency = (event) => {
    reset();
    setToCurrency(event.target.value);
  };

  const reset = () => {
    setConvertedAmount(0);
    setConversionRate(0);
    setConversionError(null);
  }

  const convertFunds = () => {
    fetch(`/api/currencyConverter?to=${toCurrency}&from=${fromCurrency}&amount=${amount}`)
      .then(async (response) => {
        if (!response.ok) {
          throw await response.json();
        }
        return response.json()
      })
      .then((body) => {
        setConvertedAmount(body.amount);
        setConversionRate(body.conversionRate);
      }).catch(error => {
        console.error(error);
        setConversionError(error.message);
      });
  }

  useEffect(() => {
    fetch("/api/currencies")
      .then((res) => res.json())
      .then((body) => setSupportedCurrencies(body));
  }, []);

  return (
    <div className="CurrencyConverter">
      <auro-header display="500">Currency Converter</auro-header>
      <div>
        <p>Select the amount of currency that you would like to convert.</p>
        <div class="currency-input">
          <label htmlFor="amount">Amount: </label>
          <input class="currency-field" name="amount" type="number" onChange={updateAmount}></input>
        </div>
        <div class="currency-input">
          <label htmlFor="from">From this currency </label>
          <select
            class="currency-select"
            onChange={updateFromCurrency}
            name="from"
            defaultValue=""
          >
            <option value="" disabled>
              Select a currency
            </option>
            {supportedCurrencies.map((currency, index) => (
              <option key={index} value={currency.currencyCode}>
                {currency.fullCurrencyName} ({currency.currencyCode})
              </option>
            ))}
          </select>
        </div>
        <div class="currency-input">
          <label htmlFor="to">To this currency </label>
          <select
            class="currency-select"
            onChange={updateToCurrency}
            name="to"
            defaultValue=""
          >
            <option value="" disabled>
              Select a currency
            </option>
            {supportedCurrencies.map((currency, index) => (
              <option key={index} value={currency.currencyCode}>
                {currency.fullCurrencyName} ({currency.currencyCode})
              </option>
            ))}
          </select>
        </div>
      </div>
      <button class="convert-button" onClick={convertFunds}>Convert</button>
      <div>
        {(convertedAmount && conversionRate) ?
        <>
            <p>
            <strong>{amount} ({fromCurrency}) = {convertedAmount} ({toCurrency})</strong>
            </p>
            <p>Conversion rate (updates daily): 1 {fromCurrency} =  {conversionRate} {toCurrency}</p>
        </> : ``}
        {conversionError != null ? <p>{conversionError}</p>: ``}
        <p>Purchases at alaskaair.com are in U.S. dollars.</p>
      </div>
    </div>
  );
};

export default CurrencyConverter;