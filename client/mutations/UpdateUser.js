// @flow
// external imports
import { graphql } from 'react-relay'
// local imports
import mutationFromQuery from './mutationFromQuery'

export default mutationFromQuery(graphql`
    mutation UpdateUserMutation($input: UpdateUserInput!) {
        UpdateUser(input: $input) {
            user {
                id
                walletAddress
            }
        }
    }
`)
