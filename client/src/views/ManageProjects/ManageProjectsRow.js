// @flow
// external imports
import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import { Title, Text, IconCheckCircle, Button } from 'quark-web'
// local imports
import type { ManageProjectsRow_repo } from './__generated__/ManageProjectsRow_repo.graphql'
import styles from './styles'
import { connectProject } from '../../mutations'

type Props = {
    repo: ManageProjectsRow_repo,
    first: boolean,
    last: boolean
}

// the connected indicator
const ConnectedIndicator = () => (
    <div style={{ display: 'flex', color: '#58AD66', flexDirection: 'row', alignItems: 'center' }}>
        <IconCheckCircle />
        <Text style={{ marginLeft: 4, color: '#58AD66' }}>connected</Text>
    </div>
)

// the cta to connect the project to bazr
const ConnectCTA = ({ repo, environment }: { environment: RelayEnvironment, repo: ManageProjectsRow_repo }) => (
    <Button
        size="small"
        style={{ minWidth: 90 }}
        onClick={() =>
            connectProject({
                environment,
                input: {
                    name: repo.name,
                    owner: repo.owner.login
                },
                onCompleted: () => console.log('connected!')
            })
        }
    >
        connect
    </Button>
)

const ManageProjectsRow = ({ repo, first, relay }: Props) => (
    <div style={first ? styles.firstRepoRow : styles.repoRow}>
        <Title style={{ display: 'flex', alignItems: 'center', fontWeight: '100' }}>
            {repo.owner.login} / {repo.name}
        </Title>
        {repo.bazrProject ? <ConnectedIndicator /> : <ConnectCTA environment={relay.environment} repo={repo} />}
    </div>
)

export default createFragmentContainer(
    ManageProjectsRow,
    graphql`
        fragment ManageProjectsRow_repo on Repository {
            name
            owner {
                login
            }
            bazrProject {
                id
            }
        }
    `
)