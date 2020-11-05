import { WSAEACCES } from 'constants';
import React, { useState, useEffect } from 'react';
import "./timer.css"

interface IProps {
    //   products: string[];
    ws : WebSocket;
}

interface IVoteMessage {
    Type: string;
    StatusOfVote: boolean;
    Timeout: number;
}

const Timer = (props: IProps) => {
    const [seconds, setSeconds] = useState(0);
    const [secondsValue, setSecondsValue] = useState(10);
    const ws = props.ws; 
  
    const message:IVoteMessage = {Type: "vote", StatusOfVote: false, Timeout: secondsValue}

    function startVote() {
      setSeconds(secondsValue);
      message.StatusOfVote = true;
      sendMessage(message)
    }

    function endVote() {
      if(seconds !== 0){
        reset();
      }
      message.StatusOfVote = false;
      sendMessage(message)
    }

     function setTimer(event:React.ChangeEvent<HTMLInputElement>){
         if(event.target){
            setSecondsValue(parseInt(event.target.value));
         }
     }
  
    function reset() {
      setSeconds(0);
    }
  
    useEffect(() => {
      var interval:any = null;
      if (seconds !== 0) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds - 1);
        }, 1000);
      } else if (seconds == 0) {
            clearInterval(interval);
            endVote();
      }
      return () => clearInterval(interval);
    }, [seconds]);
  
    function sendMessage(message: IVoteMessage){
      try {
        console.log(message)
        ws.send(JSON.stringify(message)); //send data to the server
      } catch (error) {
          console.log(error) // catch error
      }
    }

    return (
       <div>
        <div className="time">
          {seconds}s
        </div>
        <div className="row">
          <input type="Number" value={secondsValue} className={`button button-primary button-primary-active`} onChange={setTimer}>
             
          </input>
          <button className={`button button-primary button-primary-active`} onClick={startVote}>
          Start Vote
          </button>
          <button className="button" onClick={endVote}>
            End Vote
          </button>
        </div>
        </div>
    );
  };
  
  export default Timer;