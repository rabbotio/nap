import persist from '../lib/persist'

export const initSession = async (store, state) => store.setState(
  Object.assign(
    state,
    { sessionToken: persist.willGetSessionToken() }
  )
)