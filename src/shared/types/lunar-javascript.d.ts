declare module "lunar-javascript" {
  interface SolarValue {
    getYear(): number;
    getMonth(): number;
    getDay(): number;
    getLunar(): LunarValue;
    next(days: number): SolarValue;
  }

  interface LunarValue {
    getYear(): number;
    getMonth(): number;
    getSolar(): SolarValue;
  }

  interface LunarMonthValue {
    getFirstJulianDay(): number;
    next(months: number): LunarMonthValue;
  }

  export const Solar: {
    fromDate(date: Date): SolarValue;
    fromJulianDay(julianDay: number): SolarValue;
  };

  export const Lunar: {
    fromYmd(year: number, month: number, day: number): LunarValue;
  };

  export const LunarMonth: {
    fromYm(year: number, month: number): LunarMonthValue;
  };
}
