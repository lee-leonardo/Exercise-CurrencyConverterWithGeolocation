const express = require('express');
const app = express();
const ratesByCountryName = require('./utils/conversionRates');

app.get('/api', (req, res) => {
  res.status(200).json({ message: 'Hello from api!' });
});

/*
 * Returns the currencies that this currency converter supports.
*/
app.get('/api/currencies', (req, res) => {
  return res.status(200).send(Object.values(ratesByCountryName));
});

/*
 * Returns the converted currency amount.
*/
app.get('/api/currencyConverter', (req, res) => {
  try {
    const fromCurrency = req.query.from;
    const toCurrency = req.query.to;
    const amountCurrency = req.query.amount;

    const rates = Object.values(ratesByCountryName);

    const fromConversionRate = rates.find(rate => rate.currencyCode === fromCurrency);
    const toConversionRate = rates.find(rate => rate.currencyCode === toCurrency);

    // if undefined need to
    if (!fromConversionRate) {
      // log message about missing currency

      res.status(400).send({
        message: 'unable to find conversion rate from currency: ' + fromCurrency
      });
    } else if (!toConversionRate) {
      // log message about missing currency

      res.status(400).send({
        message: 'unable to find conversion rate from currency: ' + toCurrency
      });
    }

    const newConversionRate = 1.0 / fromConversionRate['rateFromUSDToCurrency'] * toConversionRate['rateFromUSDToCurrency'];

    const amountInToCurrency = amountCurrency * newConversionRate;

    const responseObject = {
      amount: amountInToCurrency,
      conversionRate: newConversionRate,
    }

    return res.status(200).send(responseObject);
  } catch (e) {
    // log e.message

    return res.status(500).send({
      message: 'something unexpected happened.'
    })
  }
});

/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', (req, res) => {

  res.status(503).send('Not Implemented');
});

module.exports = app;