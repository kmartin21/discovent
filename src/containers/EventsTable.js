import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Event from '../components/Event'
import { 
    fetchEventDetailsIfNeeded, 
    fetchEventsByCountryIfNeeded, 
    selectEvent, 
    deselectEvent, 
    selectCountry
} from '../actions/Events'
import EventDetailsModal from './EventDetailsModal';
import '../styles/main.css'

class EventsTable extends Component {
    static propTypes = {
        countryCode: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        error: PropTypes.object,
        items: PropTypes.array.isRequired,
        selectedCountry: PropTypes.string.isRequired,
        selectedEventId: PropTypes.string
    }

    constructor(props) {
        super(props),
        this.state = {
            show: false
        }
    }
    
    showModal = (eventId) => {
        this.selectEvent(eventId)
        this.setState({ show: true })
    }

    selectEvent = (eventId) => {
        const { dispatch } = this.props
        dispatch(selectEvent(eventId))
        dispatch(fetchEventDetailsIfNeeded(eventId))
    }

    hideModal = () => {
        const { dispatch } = this.props
        dispatch(deselectEvent())
        this.setState({ show: false })
    }

    componentDidMount() {
        const { dispatch, countryCode } = this.props
        dispatch(selectCountry(countryCode))
        dispatch(fetchEventsByCountryIfNeeded())
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedCountry !== this.props.selectedCountry) {
            const { dispatch, selectedCountry } = nextProps
            dispatch(fetchEventsByCountryIfNeeded(selectedCountry))
        }
    }
    
    render() {
        const { isLoading, error, items, selectedCountry, selectedEventId } = this.props
        
        return (
            <div className='events-container'> 
                {this.state.show &&
                    <EventDetailsModal eventId={selectedEventId} onClose={() => this.hideModal()}/>
                }
                {items.length > 0 &&
                    <div className='events'>
                        {items.map(event => 
                            <Event id={event.id} imageUrl={event.imageUrl} name={event.name} onClick={() => this.showModal(event.id)} />
                        )}
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {

    const { selectedCountry } = state
    const events = state.eventsByCountry[selectedCountry] || {
        isLoading: true,
        items: []
    }

    return {
        isLoading: events.isLoading,
        error: events.error,
        items: events.items,
        selectedCountry: state.selectedCountry,
        selectedEventId: state.selectedEvent
    }
}

export default connect(mapStateToProps)(EventsTable)



