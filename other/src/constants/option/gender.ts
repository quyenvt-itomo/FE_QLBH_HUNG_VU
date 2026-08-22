import { GenderEnum, genderMap } from "../enum";

export const genderOptions = Object.values(GenderEnum).map((key) => ({
  label: genderMap[key],
  value: key,
}));
