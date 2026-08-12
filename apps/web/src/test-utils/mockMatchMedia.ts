import { vi } from "vitest";

type MockMediaQueryList = MediaQueryList & {
  emitChange: (matches: boolean) => void;
};

export function mockMatchMedia(initialMatches: Record<string, boolean>) {
  const lists = new Map<string, MockMediaQueryList>();

  const getList = (query: string): MockMediaQueryList => {
    const existing = lists.get(query);
    if (existing) return existing;

    let matches = initialMatches[query] ?? false;
    const listeners = new Set<(event: MediaQueryListEvent) => void>();

    const list = {
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
      addEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.add(listener);
      },
      removeEventListener: (
        _type: string,
        listener: (event: MediaQueryListEvent) => void,
      ) => {
        listeners.delete(listener);
      },
      emitChange: (nextMatches: boolean) => {
        matches = nextMatches;
        listeners.forEach((listener) =>
          listener({ matches } as MediaQueryListEvent),
        );
      },
      get matches() {
        return matches;
      },
    } as MockMediaQueryList;

    lists.set(query, list);
    return list;
  };

  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => getList(query)),
  );

  return { getList };
}
