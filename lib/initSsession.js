import NAPSession from '../lib/NAPSession'

export const initSession = async (store, state) => store.setState(
  Object.assign(
    state,
    { sessionToken: NAPSession.willGetSessionToken() }
  )
)