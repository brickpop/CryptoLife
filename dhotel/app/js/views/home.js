import React, { Component } from "react"
import { connect } from "react-redux"
import { Row, Col, Card, DatePicker, Button, Spin, message, notification } from "antd"
import Bookings from 'Embark/contracts/Bookings'

class HomeView extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedDate: null,
			myBookingDate: null,
			bookingLoading: false,
			canCheckIn: false,
			canCheckOut: false
		}
	}

	componentDidMount() {
		this.fetchGuestBooking()
	}

	fetchGuestBooking() {
		Bookings.methods.getBooking().call()
			.then(result => {
				if (result[0] != "0" && result[1] != "0" && result[2] != "0") {
					this.setState({
						myBookingDate: {
							year: result[0],
							month: result[1],
							day: result[2]
						}
					})
				}
				else {
					this.setState({ myBookingDate: null })
				}
			})
			.then(() => Bookings.methods.canCheckIn().call())
			.then(result => this.setState({ canCheckIn: result }))
			.then(() => Bookings.methods.canCheckOut().call())
			.then(result => this.setState({ canCheckOut: result }))
			.catch(err => {
				this.setState({ myBookingDate: null })
				message.warn("The availability status could not be checked")
alert(err.message);
				this.setState({ selectedDate: null })
			})
	}

	datePicked(date) {
		if (!date) return
		date = date.toDate()
		const today = new Date()
		today.setHours(0)
		today.setMinutes(0)
		today.setSeconds(0)
		today.setMilliseconds(0)

		if (date < today) return message.error("The date must be in the future")
		const year = date.getFullYear()
		const month = date.getMonth() + 1
		const day = date.getDate()

		Bookings.methods.isAvailable(year, month, day).call()
			.then(result => {
				if (result) {
					message.info("The room is available")
					this.setState({ selectedDate: date })
				}
				else {
					message.warn("The room is already booked on that date")
					this.setState({ selectedDate: null })
				}
			})
			.catch(err => {
				message.warn("The availability status could not be checked")
				this.setState({ selectedDate: null })
			})
	}

	onBookRoom() {
		if (!this.state.selectedDate) return
		const year = this.state.selectedDate.getFullYear()
		const month = this.state.selectedDate.getMonth() + 1
		const day = this.state.selectedDate.getDate()

		this.setState({ bookingLoading: true })

		return Bookings.methods.price().call().then(value => {
			return Bookings.methods.bookRoom(year, month, day)
				.send({ value })
		})
			.then(tx => {
				this.setState({ bookingLoading: false })

				message.success("Your reservation has been registered!")
				this.fetchGuestBooking()
			}).catch(err => {
				this.setState({ bookingLoading: false })
				message.warn("The transaction could not be completed")
				console.error(err)
			})
	}

	onCancelBooking() {
		if (!this.state.myBookingDate) return

		this.setState({ bookingLoading: true })

		return Bookings.methods.cancelBooking(this.state.myBookingDate.year, this.state.myBookingDate.month, this.state.myBookingDate.day)
			.send()
			.then(() => {
				this.setState({ bookingLoading: false })

				message.success("Your reservation has been registered!")
				this.fetchGuestBooking()
			}).catch(err => {
				this.setState({ bookingLoading: false })
				message.warn("The transaction could not be completed")
				console.error(err)
			})
	}

	onRoomClick() {
		this.props.history.push("/room")
	}

	renderCurrentReservation() {
		// let canCheckIn = false
		// let now = new Date()
		// if (this.state.myBookingDate) {
		// 	if (this.state.myBookingDate.year == now.getFullYear() &&
		// 		this.state.myBookingDate.month == (now.getMonth() + 1) &&
		// 		this.state.myBookingDate.day == now.getDate()) {
		// 		canCheckIn = true
		// 	}
		// }
		return <div>
			<Card className="margin-bottom">
				<p>You currently have a reservation</p>
				<p>Arrival on {this.state.myBookingDate.day}/{this.state.myBookingDate.month}/{this.state.myBookingDate.year}</p>
			</Card>
			{
				this.state.canCheckIn ? <Button type="primary" className="width-100 margin-bottom" onClick={() => this.onRoomClick()}>Check In</Button> : null
			}
			{
				this.state.canCheckOut ? <Button type="primary" className="width-100 margin-bottom" onClick={() => this.onRoomClick()}>Room access</Button> : null
			}
			<Button type="danger" className="width-100" onClick={() => this.onCancelBooking()}>Cancel booking</Button>
		</div>
	}

	renderBookForm() {
		return <div>
			<Card className="margin-bottom">
				<p>Choose the date you'd like to book</p>
				<DatePicker className="width-100" onChange={value => this.datePicked(value)} />
			</Card>

			{
				this.state.selectedDate && (!this.state.bookingLoading) ?
					<Button type="primary" className="width-100" onClick={() => this.onBookRoom()}>Book now</Button> : null
			}

			{
				this.state.bookingLoading ?
					<p className="margin-top">Please wait... <Spin /></p> : null
			}
		</div>
	}

	render() {
		return <div id="home">
			<Row>
				<Col>
					<p className="margin-top">Welcome to the first distributed hotel</p>
				</Col>
			</Row>

			{this.state.myBookingDate ? this.renderCurrentReservation() : this.renderBookForm()}
		</div>
	}
}

export default connect(({ accounts }) => ({ accounts }))(HomeView)
