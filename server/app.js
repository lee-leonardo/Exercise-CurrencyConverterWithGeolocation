const express = require('express');
const app = express();
const ratesByCountryName = require('./utils/conversionRates');
const geo = require('./utils/geolocation');

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
    });
  }
});

/*
 * Returns the user's local currency type based on the user geolocation.
*/
app.get('/api/locationToCurrency', async (req, res) => {

  try {
    // TODO: first attempt to gain IP information via user consent with the HTML geolocator API and reverse geolocating via google.
    const lat = req.query.lat;
    const long = req.query.long;
    // const accuracy = req.query.accuracy; // might be worth keeping

    if (!lat || !long) {
      res.status(400).send({
        message: 'this endpoint requires geolocation informatino to proceed'
      });
    }

    // using the google endpoint
    const response = await geo.reverseGeoCoding(lat, long);

    if (!response.success) {
      throw response.error;
    }

    const country = geo.getCountryName(response.results);

    res.status(200).send({
      currencyCode: conversionRate[country.short].currencyCode
    });
  } catch (e) {
    // log e.message

    res.status(500).send({
      message: 'something unexpected happened.'
    });
  }
});

module.exports = app;