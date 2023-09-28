import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Make sure you import Bootstrap CSS

class Timer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            minutes: 1,
            seconds: 0,
        };
    }

    componentDidMount() {
        this.timerInterval = setInterval(this.updateTimer, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }

    updateTimer = () => {
        if (this.state.seconds === 0) {
            if (this.state.minutes === 0) {
                clearInterval(this.timerInterval);
            } else {
                this.setState({
                    minutes: this.state.minutes - 1,
                    seconds: 59,
                });
            }
        } else {
            this.setState({
                seconds: this.state.seconds - 1,
            });
        }
    };

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        {/*<h1>Countdown Timer</h1>*/}
                        <p>Time
                            Remaining: {`${this.state.minutes}:${this.state.seconds < 10 ? '0' : ''}${this.state.seconds}`}</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default Timer;
