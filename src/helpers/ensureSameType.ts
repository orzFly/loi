export function ensureSameType<X, Y extends X>(): [X, Y] { return undefined as any; };
export function ensureTypeSame<X extends Y, Y>(): [X, Y] { return undefined as any; };
