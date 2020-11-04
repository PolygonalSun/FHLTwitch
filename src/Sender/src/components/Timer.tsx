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
    const [isActive, setIsActive] = useState(false);
    const [secondsValue, setSecondsValue] = useState(10);
    const ws = props.ws; 
  
    const message:IVoteMessage = {Type: "vote", StatusOfVote: false, Timeout: secondsValue}

    function toggle() {
    
      if(!isActive){
          setSeconds(secondsValue);
          message.StatusOfVote = true;
        try {
            console.log(message)
            ws.send(JSON.stringify(message)); //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
         
      }  

      setIsActive(!isActive);
    }


     function setTimer(event:React.ChangeEvent<HTMLInputElement>){
         if(event.target){
            setSecondsValue(parseInt(event.target.value));
         }
     }
  
    function reset() {
      message.StatusOfVote = false;
      
      setSeconds(0);
      setIsActive(false);
      try {
        console.log(message)
        ws.send(JSON.stringify(message)); //send data to the server
        } catch (error) {
            console.log(error) // catch error
        }
    }
  
    useEffect(() => {
      var interval:any = null;
      if (isActive && seconds !== 0) {
        interval = setInterval(() => {
          setSeconds(seconds => seconds - 1);
        }, 1000);
      } else if (!isActive || seconds == 0) {
            
            clearInterval(interval);
            reset();
      }
      return () => clearInterval(interval);
    }, [isActive, seconds]);
  
    return (
       <div>
        <div className="time">
          {seconds}s
        </div>
        <div className="row">
          <input type="Number" value={secondsValue} className={`button button-primary button-primary-active`} onChange={setTimer}>
             
          </input>
          <button className={`button button-primary button-primary-active`} onClick={toggle}>
          Start Vote
          </button>
          <button className="button" onClick={reset}>
            End Vote
          </button>
        </div>
        </div>
    );
  };
  
  export default Timer;