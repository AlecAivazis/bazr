// @flow
// external imports
import * as React from 'react'
import { View } from 'react-native-web'
import { H1, Input, Label, Text, SecondaryButton, PrimaryButton, Form, Overlay, GetTheme } from 'quark-web'
import PropTypes from 'prop-types'
import { ConnectionHandler } from 'relay-runtime'
import { createFragmentContainer, graphql } from 'react-relay'
import { withRouter } from 'react-router-dom'
// local imports
import styles from './styles'
import { createFund, depositEther } from '~/client/mutations'

type Props = {
    toggle: boolean
}

type State = {
    error: boolean
}

class CreateFundOverlay extends React.Component<Props, State> {
    state = {
        error: false
    }

    static contextTypes = {
        environment: PropTypes.any
    }

    componentWillReceiveProps(nextProps) {
        // if we are toggling
        if (nextProps.visible !== this.props.visible) {
            this.setState({ error: false })
        }
    }

    _toggleError = () => this.setState(state => ({ error: !state.error }))

    _submit = ({ name, deposit }) => async () => {
        // grab the environment out of the context
        const { environment } = this.context

        try {
            // try to deploy a fund with the given name
            var { createFund: { node: fund } } = await createFund({
                environment,
                input: { name, deposit }
            })
        } catch (error) {
            return this.setState({ error })
        }

        // try {
        //     // deposit the designated amount of ether in the contract
        //     await depositEther({
        //         environment,
        //         input: {
        //             address: fund.address,
        //             amount: deposit
        //         }
        //     })
        // } catch (error) {
        //     return this.setState({ error })
        // }

        this.props.history.push(`/funds/${fund.address}`)
    }

    _error = () => (
        <React.Fragment>
            <Text>Something went wrong while creating fund:</Text>
            <GetTheme>
                {({ lightRed }) => (
                    <View style={{ marginTop: 12 }}>
                        <Text style={{ color: lightRed }}>{this.state.error.message}</Text>
                    </View>
                )}
            </GetTheme>
            <View style={styles.footer}>
                <SecondaryButton onPress={this.props.toggle}>Cancel</SecondaryButton>
                <PrimaryButton onPress={this._toggleError}>Try Again</PrimaryButton>
            </View>
        </React.Fragment>
    )

    render = () => {
        const { toggle, visible } = this.props
        return (
            <Overlay toggle={toggle} visible={visible}>
                <H1 style={styles.header}>Create a Fund</H1>

                {this.state.error ? (
                    <this._error />
                ) : (
                    <Form
                        initialData={{ name: '' }}
                        validate={{
                            name: val => ((val && val.length) > 0 ? null : 'name is required'),
                            deposit: val => ((val && val.length) > 0 ? null : 'deposit is required')
                        }}
                    >
                        {({ getValue, setValue, getError, hasErrors }) => (
                            <React.Fragment>
                                <Label value="Name" style={styles.input} error={getError('name')}>
                                    <Input
                                        error={getError('name')}
                                        value={getValue('name')}
                                        onChange={name => setValue({ name })}
                                    />
                                </Label>
                                <Label value="Initial Deposit" error={getError('name')}>
                                    <Input
                                        error={getError('deposit')}
                                        value={getValue('deposit')}
                                        onChange={deposit => setValue({ deposit })}
                                    />
                                </Label>
                                <View style={styles.footer}>
                                    <SecondaryButton onPress={toggle}>Cancel</SecondaryButton>
                                    <PrimaryButton
                                        style={styles.submitButton}
                                        disabled={hasErrors}
                                        onPress={this._submit({
                                            name: getValue('name'),
                                            deposit: getValue('deposit')
                                        })}
                                    >
                                        Deposit Ether
                                    </PrimaryButton>
                                </View>
                            </React.Fragment>
                        )}
                    </Form>
                )}
            </Overlay>
        )
    }
}

export default createFragmentContainer(
    withRouter(CreateFundOverlay),
    graphql`
        fragment CreateFundOverlay_viewer on User {
            id
        }
    `
)
