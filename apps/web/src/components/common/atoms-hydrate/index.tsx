import { type FC, type ReactNode } from "react";
import type { WritableAtom } from "jotai";
import { useHydrateAtoms } from "jotai/utils";

// biome-ignore lint/suspicious/noExplicitAny: <AtomValues>
export type AtomValues = Iterable<readonly [WritableAtom<unknown, [any], unknown>, unknown]>;

export type AtomsHydrateProps = {
  atomValues: AtomValues;
  children: ReactNode;
};

export const AtomsHydrate: FC<AtomsHydrateProps> = ({ atomValues, children }) => {
  useHydrateAtoms(new Map(atomValues));
  return children;
};
