let POSITIVE_COLOR = "#bdcebe";
let NEGATIVE_COLOR = "#eca1a6";

let CURRENCY_FORMAT = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

let PERCENT_FORMAT = Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 3,
  maximumFractionDigits: 3
});

function changeCoinsColor(color) {
  let coins = document.getElementsByClassName("coin");
  [...coins].forEach((coin) => {
    coin.style.backgroundColor = color;
  });
}

function update() {
  updateCoin("btc-bitcoin", "btc-price", "btc-ath", "btc-athd", "btc-24");
  updateCoin("eth-ethereum", "eth-price", "eth-ath", "eth-athd", "eth-24");

  updateQuotes();
  document.getElementById("updated").innerHTML = new Date().toLocaleString();
}

function updateCoin(
  ticker,
  priceElement,
  athElement,
  athdElement,
  change24Element
) {
  fetch("https://api.coinpaprika.com/v1/tickers/" + ticker)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem fetching the data. Status Code: " +
            response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        document.getElementById(priceElement).innerHTML =
          CURRENCY_FORMAT.format(data.quotes.USD.price);
        document.getElementById(athElement).innerHTML = CURRENCY_FORMAT.format(
          data.quotes.USD.ath_price
        );
        document.getElementById(athdElement).innerHTML = new Date(
          data.quotes.USD.ath_date
        ).toLocaleString();
        document.getElementById(change24Element).innerHTML =
          PERCENT_FORMAT.format(data.quotes.USD.percent_change_24h / 100.0);

        let coins = document.getElementsByClassName("coin");
        [...coins].forEach((coin) => {
          if (data.quotes.USD.percent_change_24h > 0)
            coin.style.backgroundColor = POSITIVE_COLOR;
          else coin.style.backgroundColor = NEGATIVE_COLOR;
        });
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}

function updateQuotes() {
  updateQuote("quote1", "author1");
  updateQuote("quote2", "author2");
}

function updateQuote(quoteElement, authorElement) {
  fetch("https://stoic-quotes.com/api/quotes?num=1")
    .then(function (response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem fetching the data. Status Code: " +
            response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function (data) {
        console.log(data);
        document.getElementById(quoteElement).innerHTML = data[0].text;
        document.getElementById(authorElement).innerHTML = data[0].author;
      });
    })
    .catch(function (err) {
      console.log("Fetch Error :-S", err);
    });
}
