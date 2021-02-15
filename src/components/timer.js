import React, {useState, useEffect} from 'react';
import { interval, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

const Timer = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isWait, setIsWait] = useState(false);
    const [count, setCount] = useState(0);
    
    function toggle(){
        setIsActive(!isActive);
    }

    function timeClick(){
        var d = new Date();
        var t = d.getTime();
        var lastClick = 0;
        if(lastClick - t < 300) {
             Wait();
        }
        lastClick = t;
    }

    function Wait(){
        setIsWait(!isWait);
        setCount(() => count + 1);

        if(count > 2){
            setCount(0);
        }else if(count == 2){
            setIsActive(false);       
        }
    }

    function reset(){
        setHours(0);
        setMinutes(0);
        setSeconds(0);
        setIsActive(false);
    }

    useEffect(() => {
        const unsubscribe$ = new Subject();
        interval(1000).pipe(takeUntil(unsubscribe$)).subscribe(() => {
            if (isActive) {
                setSeconds(seconds => seconds + 1);
            }else if(!isActive && seconds !== 0 && !isWait){
                setHours(0);
                setMinutes(0);
                setSeconds(0);
            }else if (seconds == 60){
                setSeconds(0);
                setMinutes(minutes => minutes + 1);
            }else if(minutes == 60){
                setMinutes(0);
                setHours(hours => hours + 1);
            }
    
        });

        return () => {
            unsubscribe$.next();
            unsubscribe$.complete();
        };

    }, [isActive, seconds]);

    return (
        <div>
            <div className="time">
                {hours}:
                {minutes}:
                {seconds}s
            </div>
            <div className="row">
                <button className={`button button-primary button-primary-${isActive ? 'active' : 'inactive'}`} onClick={toggle}>
                {isActive ? 'Pause' : 'Start'}
                </button>
                <button className="button" onClick={timeClick}>Wait</button>
                <button className="button" onClick={reset}>
                Reset
                </button>
            </div>
        </div>
    );

};

export default Timer;