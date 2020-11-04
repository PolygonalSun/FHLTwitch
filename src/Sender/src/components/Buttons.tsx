import * as React from "react";
import "./timer.css"

interface IProps {
    //   products: string[];
    ws : WebSocket;
}

interface State {
    //timeout :  
//    quantities: { [key: string]: number };
    joke: string;
    name: string;
}

interface IJokeMessage {
    Type: string;
    Joke: string;
    Name: string;
}

interface IVerdictMessage {
    Type: string;
    Verdict: boolean;
}


export default class ActionButtons extends React.Component<IProps, State> {
   
    state: Readonly<State> = {
        // quantities: this.props.products.reduce((acc, product) => {
        //     return acc;
        // }, {})
        joke: "",
        name: "John Doe"
    }

    render() {

        // const { products } = this.props;
        // const { quantities } = this.state;

        return (
            <div >
                <div id="Send Joke" >
                    
                    <p>
                        <div style={{ float: "left", height: "50px"}}>
                            <label title="offenderNameLabel">Name</label>
                            <input  className="button" name="offenderName" value={this.state.name}  onChange={this.changeName} ></input>
                        </div>
                       <div  style={{ float: "left"}} >
                        
                       <textarea style={{ height: "50px", width:"200px"}} className="button"  name="joke"  onChange={this.changeJoke} ></textarea>
                       </div>
                       <button className={`button button-primary button-primary-active`} onClick={this.sendJoke}>
                        Send
                        </button>
                    </p>

                    <p>
                        <div  >
                            <h2>Verdict:</h2>
                            
                        </div>
                    </p>
                    <p>
                        <div  >
                            <button className={`button button-primary button-primary-active`} onClick={this.sendVerdict(true)}>
                            Yay
                            </button>
                            <button className={`button`} onClick={this.sendVerdict(false)}>
                            Nay
                            </button>
                        </div>
                    </p>

                      
                </div>

            </div>
        )
    }

    changeJoke = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.setState({name:this.state.name, joke: event.target.value })
    }

    changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({joke:this.state.joke, name: event.target.value })
      }

    sendJoke = () => {
         
           var message:IJokeMessage = {Type: "joke", Joke: this.state.joke, Name: this.state.name} ;
            try {
                console.log(message)
                this.props.ws.send(JSON.stringify(message))
               
            } catch (error) {
                console.log(error) // catch error
            }
        
    }

    sendVerdict =  (verdict: boolean) => () => {
        var message:IVerdictMessage = {Type: "verdict", Verdict: verdict} ;
            try {
                console.log(message)
                this.props.ws.send(JSON.stringify(message))
               
            } catch (error) {
                console.log(error) // catch error
            }
    }
}