import { useAtomValue } from "jotai";

import { profileState } from "@/state/profile";

export const useProfile = () => {
  return useAtomValue(profileState);
};
