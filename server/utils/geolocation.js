const got = require('got');

const apiKey = "example";

function url(lat, long) {
  return `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${long}&key=${apiKey}`
}

async function reverseGeoCoding(lat, long) {
  try {
    const response = await got.get(url(lat, long));
    if (response.error_message) {
      return {
        success: false,
        error: new Error(response.error_message)
      };
    }

    const results = response.results;

    return {
      success: true,
      results: results
    };
  } catch (e) {
    // logging
    return {
      success: false,
      error: e,
    };
  }
}

function getCountryName(geoLocationResults) {
  // assume that the first is the most accurate for simplicity, but this might be where accuracy might need to come into play
  const location = geoLocationResults[0]
  const addressComponents = location.address_components;

  const countryComponent = addressComponents.filter(component => {
    return component.types.indexOf('country') !== -1;
  });

  return {
    long: countryComponent.long_name,
    short: countryComponent.short_name,
  }
}

module.exports = {
  reverseGeoCoding: reverseGeoCoding,
  getCountryName: getCountryName
}