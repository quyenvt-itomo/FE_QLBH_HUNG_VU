import { useEffect, useState } from "react";

type Ward = { Name: string };
type Province = { Name: string; Wards: Ward[]; Plates: number[] };

export const useAddressSelector = (selectedProvince?: string) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  useEffect(() => {
    fetch("/select-address/location-data.json")
      .then((res) => res.json())
      .then((data: Province[]) => setProvinces(data));
  }, []);

  useEffect(() => {
    const province = provinces.find((c) => c.Name === selectedProvince);
    setWards(province?.Wards || []);
  }, [selectedProvince, provinces]);

  const provinceOptions = provinces.map((p) => ({ value: p.Name, label: p.Name }));
  const wardOptions = wards.map((w) => ({ value: w.Name, label: w.Name }));

  return { provinceOptions, wardOptions };
};
