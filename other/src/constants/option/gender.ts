import { Gender, genderMap } from "../enum";

export const genderOptions = Object.values(Gender).map((key) => ({
  label: genderMap[key],
  value: key,
}));
