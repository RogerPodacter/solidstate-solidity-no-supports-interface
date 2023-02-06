import { Suite } from 'mocha';

export declare function describeFilter(
  skips?: string[],
): (title: string, suite: (this: Suite) => void) => void;
