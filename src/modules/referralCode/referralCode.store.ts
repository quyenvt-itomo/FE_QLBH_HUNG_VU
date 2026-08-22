import { createBaseStore } from "@/shared/base/createBaseStore";
import { apiEndpoint } from "@/shared/constants/apiEndpoint";
import { ReferralCode, ReferralCodeQuery } from "./referralCode.model";
import { getData } from "@/shared/api/apiClient";

export const useReferralCodeStore = createBaseStore<
  ReferralCode,
  ReferralCodeQuery,
  {
    getByCode: (code: string) => Promise<ReferralCode | null>;
  }
>({
  key: "referralCodes",
  apiUrl: apiEndpoint.referralCode.base,
  extend: ({ onError }) => ({
    getByCode: async (code: string) => {
      try {
        const result = await getData<ReferralCode | null>(
          `/public${apiEndpoint.referralCode.base}/code/${code}`,
        );
        return result?.data ?? null;
      } catch (error: any) {
        onError(error);
        return null;
      }
    },
  }),
});
