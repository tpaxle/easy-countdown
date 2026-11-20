const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

function getReleaseType(messages) {
  const headers = messages.map((message) => message.split(/\r?\n/, 1)[0]);

  if (messages.some((message) => /(?:^|\n)BREAKING[ -]CHANGE:\s*\S/m.test(message)) ||
      headers.some((header) => /^[a-z][a-z0-9-]*(?:\([^)]+\))?!:/i.test(header))) {
    return 'major';
  }

  if (headers.some((header) => /^feat(?:\([^)]+\))?:/i.test(header))) {
    return 'minor';
  }

  return 'patch';
}

function incrementVersion(version, releaseType) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid package version: ${version}`);
  }

  let major = Number(match[1]);
  let minor = Number(match[2]);
  let patch = Number(match[3]);

  if (releaseType === 'major') {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (releaseType === 'minor') {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }

  return `${major}.${minor}.${patch}`;
}

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function getNextVersion() {
  const tags = git([
    'tag', '--merged', 'HEAD', '--list', 'v[0-9]*', '--sort=-version:refname',
  ]).split(/\r?\n/).filter((tag) => /^v\d+\.\d+\.\d+$/.test(tag));
  const latestTag = tags[0];
  const baseVersion = latestTag
    ? latestTag.slice(1)
    : require('../package.json').version;

  let range = latestTag && `${latestTag}..HEAD`;
  if (!range) {
    const before = process.env.GITHUB_EVENT_BEFORE;
    range = before && !/^0+$/.test(before) ? `${before}..HEAD` : 'HEAD';
  }

  const commits = git(['log', '--format=%B%x00', range])
    .split('\0')
    .filter(Boolean);

  return incrementVersion(baseVersion, getReleaseType(commits));
}

if (require.main === module) {
  const version = getNextVersion();
  const output = process.env.GITHUB_OUTPUT;

  if (output) {
    fs.appendFileSync(output, `version=${version}\n`);
  } else {
    console.log(version);
  }
}

module.exports = { getReleaseType, incrementVersion };
