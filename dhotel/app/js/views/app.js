import React, { Component } from "react"
import { Route, Switch, Redirect, withRouter } from 'react-router-dom'
import { connect } from "react-redux"
import { Layout } from "antd"
const { Header } = Layout

import EmbarkJS from 'Embark/EmbarkJS'

import LoadingView from "./loading"
import MessageView from "./message"
import HomeView from "./home"
import RoomView from "./room"
import Container from "../widgets/container"

class App extends Component {
    componentDidMount() {
        EmbarkJS.onReady(error => {
            if (error) {
                this.props.dispatch({ type: "SET_UNSUPPORTED" })
            }
            else {
                this.props.dispatch({ type: "SET_CONNECTED" })
            }
        })
    }

    render() {
        if (this.props.status.loading) return <Container><LoadingView /></Container>
        else if (this.props.status.unsupported) return <MessageView message="Your browser does not support Web3" />
        // else if (this.props.status.networkId != config.WEB3_PROVIDER) return <MessageView message={`Please, switch to the ${config.WEB3_PROVIDER} network`} />
        else if (!this.props.status.connected) return <MessageView message="Your connection seems to be down" />

        return <div>
            <Header className="header">
                <h2 className="text-center" style={{ color: "white" }}>DHotel</h2>
            </Header>
            <Container>
                <Switch>
                    <Route path="/" exact component={HomeView} />
                    <Route path="/room" exact component={RoomView} />
                    <Redirect to="/" />
                </Switch>
            </Container></div>
    }
}

export default withRouter(connect(({ accounts, status }) => ({ accounts, status }))(App))
