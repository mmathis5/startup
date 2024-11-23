import React from "react";
import './about.css';

export function About(props){
    const [image1Url, setImage1Url] = React.useState('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
    const [image2Url, setImage2Url] = React.useState('data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=');
    const [fact, setFact] = React.useState('Loading...');    

React.useEffect(() => {
    setImage1Url('stonks.jpg');
    setImage2Url('money.jpg');
    setFact('This is a fun fact');

    fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en')
    .then((response) => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then((data) => {
        setFact(data.text); 
    })
    .catch((error) => {
        console.error('Error fetching the random fact:', error);
        setFact('Could not load a random fact. Please try again later.');
    });

}, []);

return (
    <main>
            <h2>About</h2>
            <p>
                Paired Financial Management is an application that allows you to connect with a partner and log your 
                purchases while having access to the logs your partner makes. 
            </p>

            <div>
                <h2>Random Fact:</h2>
                <p>'{fact}'</p>
                <p className="source">Above fact generated using Random Useless Quote API</p>
            </div>

            <div id="picture" className="picture-box">
                <img width="200px" src={image1Url} alt="stonks" />
                <img width="215px" src={image2Url} alt="money" />
            </div>
        </main>
    );

}