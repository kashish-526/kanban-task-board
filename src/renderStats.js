// tiny external store so the stats panel can subscribe without being part of the board state
let counts = {}
let commits = { total: 0, last: null }
let version = 0
const listeners = new Set()

function emit() {
  version += 1
  listeners.forEach((l) => l())
}

export const renderStats = {
  record(name) {
    counts = { ...counts, [name]: (counts[name] || 0) + 1 }
    emit()
  },
  recordCommit(info) {
    commits = { total: commits.total + 1, last: info }
    emit()
  },
  reset() {
    counts = {}
    commits = { total: 0, last: null }
    emit()
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  getVersion: () => version,
  getCounts: () => counts,
  getCommits: () => commits,
}
