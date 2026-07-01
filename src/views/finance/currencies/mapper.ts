import { SystemCurrencyDto } from "@/src/features/currencies/api";


export type CurrencyRow = {
  id: number;
  code: string;
  name: string;
  symbol: string;
  rate: number; 
  status: "Active" | "Inactive";
  isActive: boolean;
  region: string;
  isDefault?: boolean;
};

export function mapCurrencyDtoToRow(dto: SystemCurrencyDto): CurrencyRow {
  return {
    id: dto.id,
    code: dto.code,
    name: dto.name,
    symbol: dto.symbol,
    rate: dto.exchangeRateToUsd,
    isActive: dto.isActive,
    status: dto.isActive ? "Active" : "Inactive",
    region: dto.region ?? "",
    isDefault: dto.code === "NGN", 
  };
}