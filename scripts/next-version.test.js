import { describe, expect, it } from 'vitest';
import versioning from './next-version.cjs';

const { getReleaseType, incrementVersion } = versioning;

describe('semantic versioning', () => {
  it('increments the major version for breaking changes', () => {
    expect(getReleaseType(['feat!: remove the old API'])).toBe('major');
    expect(getReleaseType(['feat: change API\n\nBREAKING CHANGE: old API removed'])).toBe('major');
    expect(incrementVersion('0.1.0', 'major')).toBe('1.0.0');
  });

  it('increments the minor version for features', () => {
    expect(getReleaseType(['feat(ui): add version label'])).toBe('minor');
    expect(incrementVersion('0.1.0', 'minor')).toBe('0.2.0');
  });

  it('increments the patch version for other commits', () => {
    expect(getReleaseType(['fix: correct date display'])).toBe('patch');
    expect(incrementVersion('0.1.0', 'patch')).toBe('0.1.1');
  });
});
