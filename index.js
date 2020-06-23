const data = require('./invoices.json');

const basicPrices = {
  tragedy: 40000,
  comedy: 30000,
};

function calculatePrice(playType, audienceAmount) {
  let playAmount = 0;
  let bonusAmount = Math.max(audienceAmount - 30, 0);

  switch (playType) {
    case 'tragedy':
      playAmount = basicPrices.tragedy;
      if (audienceAmount > 30) {
        playAmount += 1000 * (audienceAmount - 30);
      }
      break;
    case 'comedy':
      playAmount = basicPrices.comedy;
      if (audienceAmount > 20) {
        playAmount += 10000 + 500 * (audienceAmount - 20);
      }
      playAmount += 300 * audienceAmount;
      bonusAmount += Math.floor(audienceAmount / 5);
      break;
    default:
      throw new Error(`неизвестный тип представления: ${playType}`);
  }
  return [playAmount, bonusAmount];
}

function printInvoiceMessages(invoices) {
  const priceFormat = new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
  });
  return invoices.map((invoice) => {
    const { customer, performance } = invoice;
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Счет для ${customer}:\n`;
    performance.forEach((play) => {
      const { playId, audience, type } = play;
      try {
        const [playAmount, bonusAmount] = calculatePrice(type, audience);
        totalAmount += playAmount;
        volumeCredits += bonusAmount;
        result += ` ${playId}: ${priceFormat.format(
          playAmount
        )} (${audience} мест)\n`;
      } catch (err) {
        console.error(err);
      }
    });
    result += `Итого с вас ${priceFormat.format(totalAmount)} \n`;
    if (volumeCredits) {
      result += `Вы заработали ${volumeCredits} бонусов\n`;
    }
    return result;
  });
}

console.log(printInvoiceMessages(data));
