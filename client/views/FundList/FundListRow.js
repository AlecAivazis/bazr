// @flow
// external imports
import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { Title, Subtitle, IconStar } from 'quark-web'
import { View } from 'react-native-web'
import { Link } from 'react-router-dom'
import web3 from 'web3'
// local imports
import { ListRow } from '../../components'
import styles from './styles'
import FundListRow_fund from './__generated__/FundListRow_fund.graphql'

type Props = {
    fund: FundListRow_fund,
    last: Boolean
}

const FundListRow = ({ fund, last }: Props) => {
    console.log(fund.contract.__typename === 'MinedContractFund')
    return fund.contract.__typename === 'PendingContractFund' ? (
        'Contract not mined'
    ) : (
        <Link to={`/funds/${fund.contract.createdBy}`}>
            <ListRow style={styles.row} last={last}>
                <Title style={styles.fundName}>
                    {fund.name}
                    <Subtitle style={styles.address}>{fund.contract.address}</Subtitle>
                </Title>
                <View style={styles.statsRow}>
                    <View style={styles.starContainer}>
                        <Subtitle style={styles.stat}>Javascript &middot; more than 100</Subtitle>
                        <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>
                            {' '}
                            <IconStar />
                        </Subtitle>
                        <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>&middot; less than 500</Subtitle>
                        <Subtitle style={{ ...styles.stat, marginLeft: 2 }}>
                            {' '}
                            <IconStar />
                        </Subtitle>
                    </View>
                    <Subtitle style={styles.stat}>
                        Ether Remaining: {web3.utils.fromWei(fund.contract.balance, 'ether').toString()}
                    </Subtitle>
                </View>
            </ListRow>
        </Link>
    )
}

export default createFragmentContainer(
    FundListRow,
    graphql`
        fragment FundListRow_fund on Fund {
            name
            contract {
                __typename
                ... on MinedFundContract {
                    address
                    balance
                    createdBy
                }
            }
        }
    `
)
