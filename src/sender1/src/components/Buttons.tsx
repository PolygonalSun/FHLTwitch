import * as React from "react";
import "./timer.css"

interface IProps {
    ws : WebSocket;
}

interface State {
    joke: string;
    name: string;
    judgeName: string;
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

interface IJudgeNameMessage {
    Type: string;
    Username: string;
}

export default class ActionButtons extends React.Component<IProps, State> {
   
    state: Readonly<State> = {
        joke: "",
        name: "John Doe",
        judgeName: "",

    }

    render() {
        return (
            <div >
                 <p>
                        <div style={{ right: "10px", height: "50px"}}  >
                            <input  className={`button small-button`} name="offenderName" value={this.state.judgeName}  onChange={this.changeJudgeName} ></input>
                            <button className={`button small-button`} onClick={this.sendJudgeName}>
                            Set judge name
                            </button>
                        </div>
                    </p>
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
                            Guilty
                            </button>
                            <button className={`button`} onClick={this.sendVerdict(false)}>
                            Not guilty
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

    changeJudgeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({joke:this.state.joke, name: this.state.name, judgeName: event.target.value })
    }

    sendJoke = () => {
        var message:IJokeMessage = {Type: "joke", Joke: this.state.joke, Name: this.state.name} ;
        this.sendMessage(JSON.stringify(message));
    }
    
    sendJudgeName = () => {
        var message:IJudgeNameMessage = {Type: "setjudge", Username: this.state.judgeName} ;
        this.sendMessage(JSON.stringify(message));    
    }
    
    sendVerdict =  (verdict: boolean) => () => {
        var message:IVerdictMessage = {Type: "verdict", Verdict: verdict} ;
        this.sendMessage(JSON.stringify(message));      
    }

    sendMessage = (message: string) => {
        try {
            console.log(message)
            this.props.ws.send(message)
           
        } catch (error) {
            console.log(error) // catch error
        }
    }
}