import { expect } from 'chai'

import { parseRemote, sameGitHubRemote } from '../../src/lib/remote-parsing'
import { GitHubRepository } from '../../src/models/github-repository'

describe('parseRemote', () => {
  it('parses HTTPS URLs with a trailing git suffix', () => {
    const remote = parseRemote('https://github.com/hubot/repo.git')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses HTTPS URLs without a trailing git suffix', () => {
    const remote = parseRemote('https://github.com/hubot/repo')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses HTTPS URLs with a trailing slash', () => {
    const remote = parseRemote('https://github.com/hubot/repo/')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses HTTPS URLs which include a username', () => {
    const remote = parseRemote('https://monalisa@github.com/hubot/repo.git')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses SSH URLs', () => {
    const remote = parseRemote('git@github.com:hubot/repo.git')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses SSH URLs without the git suffix', () => {
    const remote = parseRemote('git@github.com:hubot/repo')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses SSH URLs with a trailing slash', () => {
    const remote = parseRemote('git@github.com:hubot/repo/')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses git URLs', () => {
    const remote = parseRemote('git:github.com/hubot/repo.git')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses git URLs without the git suffix', () => {
    const remote = parseRemote('git:github.com/hubot/repo')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses git URLs with a trailing slash', () => {
    const remote = parseRemote('git:github.com/hubot/repo/')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses SSH URLs with the ssh prefix', () => {
    const remote = parseRemote('ssh://git@github.com/hubot/repo')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })

  it('parses SSH URLs with the ssh prefix and trailing slash', () => {
    const remote = parseRemote('ssh://git@github.com/hubot/repo/')
    expect(remote).not.to.equal(null)
    expect(remote!.hostname).to.equal('github.com')
    expect(remote!.owner).to.equal('hubot')
    expect(remote!.name).to.equal('repo')
  })
})

describe('sameGitHubRemote', () => {
  const repository: GitHubRepository = {
    dbID: 1,
    name: 'desktop',
    fullName: 'shiftkey/desktop',
    cloneURL: 'https://github.com/shiftkey/desktop.git',
    owner: {
      login: 'shiftkey',
      id: 1234,
      endpoint: 'https://api.github.com/',
      hash: 'whatever',
    },
    private: false,
    htmlURL: 'https://github.com/shiftkey/desktop',
    defaultBranch: 'master',
    parent: null,
    endpoint: 'https://api.github.com/',
    fork: true,
    hash: 'whatever',
  }

  const repositoryWithoutCloneURL: GitHubRepository = {
    dbID: 1,
    name: 'desktop',
    fullName: 'shiftkey/desktop',
    cloneURL: null,
    owner: {
      login: 'shiftkey',
      id: 1234,
      endpoint: 'https://api.github.com/',
      hash: 'whatever',
    },
    private: false,
    htmlURL: 'https://github.com/shiftkey/desktop',
    defaultBranch: 'master',
    parent: null,
    endpoint: 'https://api.github.com/',
    fork: true,
    hash: 'whatever',
  }

  it('returns true for exact match', () => {
    expect(
      sameGitHubRemote(repository, 'https://github.com/shiftkey/desktop.git')
    ).is.true
  })

  it(`returns true when URL doesn't have a .git suffix`, () => {
    expect(sameGitHubRemote(repository, 'https://github.com/shiftkey/desktop'))
      .is.true
  })

  it(`returns false when URL belongs to a different owner`, () => {
    expect(
      sameGitHubRemote(repository, 'https://github.com/outofambit/desktop.git')
    ).is.false
  })

  it(`returns false if GitHub repository does't have a cloneURL set`, () => {
    expect(
      sameGitHubRemote(
        repositoryWithoutCloneURL,
        'https://github.com/shiftkey/desktop'
      )
    ).is.false
  })
})
