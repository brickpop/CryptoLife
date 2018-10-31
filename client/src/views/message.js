import React from "react"
import { Row, Col, Layout, Card } from "antd"
import Container from "../widgets/container"

export default props => <div id="message">
    <Layout.Header className="header">
        <h2 className="text-center">dAppartment</h2>
    </Layout.Header>
    <Container xs={400} sm={400} md={440} lg={470}>
        <Row type="flex" justify="center">
            <Col xs={24} sm={18} md={12}>
                <Card
                    className="margin-top">
                    <p className="text-center" style={{ margin: 0 }}>{props.message}</p>
                </Card>
            </Col>
        </Row>
    </Container>
</div>
