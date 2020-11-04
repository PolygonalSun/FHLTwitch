import * as React from "react";
import ActionButtons from './Buttons';
import Timer from './Timer';

interface Props {
 //   products: string[];
}

interface State {
    //timeout :  
//    quantities: { [key: string]: number };
    
}


export default class Main extends React.Component<Props, State> {

    ws = new WebSocket('ws://localhost:3000/ws');

    componentDidMount() {
        this.ws.onopen = () => {
        // on connecting, do nothing but log it to the console
            console.log('connected')
        }

        this.ws.onmessage = evt => {
            // listen to data sent from the websocket server
            const message = JSON.parse(evt.data)
            //this.setState({dataFromServer: message})
            console.log(message)
        }

        this.ws.onclose = () => {
            console.log('disconnected')
            // automatically try to reconnect on connection loss
        }

    }
     

    state: Readonly<State> = {
        // quantities: this.props.products.reduce((acc, product) => {
        //     return acc;
        // }, {})
    }

    render() {

        // const { products } = this.props;
        // const { quantities } = this.state;

        return (
            <div className="app">
                    <Timer ws={this.ws}></Timer>
                    <ActionButtons ws={this.ws}></ActionButtons>
            </div>
        )   
    }

     
}