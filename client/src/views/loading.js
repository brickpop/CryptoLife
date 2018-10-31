import React from "react"
import { Row, Col, Spin, Layout, Card } from "antd"
import Container from "../widgets/container"

export default () => <div id="loading">
    <Layout.Header className="header">
        <h2 className="text-center">dAppartment</h2>
    </Layout.Header>
    <Container xs={400} sm={400} md={440} lg={470}>
        <Row type="flex" justify="center">
            <Col xs={24} sm={18} md={12}>
                <Card
                    className="margin-top text-center">
                    <p className="light" style={{ margin: 0 }}>Connecting to the blockchain. Please wait...</p>
                    <br />
                    <Spin />
                </Card>
            </Col>
        </Row>
    </Container>
</div>
