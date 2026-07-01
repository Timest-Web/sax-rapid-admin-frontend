export const currencyKeys = {
  all: ["systemCurrencies"] as const,
  list: () => [...currencyKeys.all, "list"] as const,
};