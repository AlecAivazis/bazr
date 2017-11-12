// external imports
import { mergeSchemas } from 'graphql-tools'
// local imports
import createGHSchema from './github'
import createServerSchema from './server'

// the type extensions to link schema together
const linkTypes = `
extend type Project {
  repository: Repository
}

extend type Transaction {
  recipient: User
}
`

// a factory for the api's schema
export default async function createSchema() {
    // merge the two
    return mergeSchemas({
        schemas: [await createServerSchema(), await createGHSchema(), linkTypes],
        // prefer local types over remote ones
        onTypeConflict: (leftType, rightType) => leftType,
        // implement the links between types
        resolvers: mergeInfo => ({
            Project: {
                repository: {
                    fragment: 'fragment ProjectRepositoryFragment on Project { repoID }',
                    resolve: (parent, args, context, info) => {
                        // assume the id is in the format of <owner>/<name>
                        const [owner, name] = parent.repoID.split('/')

                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'repository', { owner, name }, context, info)
                    }
                }
            },
            Transaction: {
                recipient: {
                    fragment: 'fragment TransactionRecipientFragment on Transaction { recipientName }',
                    resolve: (parent, args, context, info) => {
                        // return the repository designated by the ID
                        return mergeInfo.delegate('query', 'user', { login: parent.recipientName }, context, info)
                    }
                }
            }
        })
    })
}