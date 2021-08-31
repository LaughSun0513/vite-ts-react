import React from 'react';

export default class BatchState extends React.Component {
    state = {
        number: 0
    }
    handClk = () => {
        this.setState({ number: this.state.number + 1 });
        console.log('1同步',this.state);

        this.setState({ number: this.state.number + 1 });
        console.log('2同步', this.state);
        
        this.setState({ number: this.state.number + 1 });
        console.log('3同步', this.state);

        setTimeout(() => {
            console.log('4异步', this.state);

            this.setState({ number: this.state.number + 1 });
            console.log('5异步', this.state);
            
            this.setState({ number: this.state.number + 1 });
            console.log('6异步', this.state);
        });
    }
    render() {
        return (
            <>
                <p>{ this.state.number }</p>
                <button onClick={ this.handClk }>+</button>
            </>
            
        )
    }
}