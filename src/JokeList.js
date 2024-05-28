import React, { /*Component*/ useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

// class JokeList extends Component {
//   static defaultProps = {
//     numJokesToGet: 5
//   };

//   constructor(props) {
//     super(props);
//     this.state = {
//       jokes: [],
//       isLoading: true
//     };

//     this.generateNewJokes = this.generateNewJokes.bind(this);
//     this.vote = this.vote.bind(this);
//   }

function JokeList({ numJokesToGet = 5 }) {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* get jokes if there are no jokes */

  useEffect(function () {
    async function getJokes() {
      let j = [...jokes];
      let seenJokes = new Set();
      try {
        while (j.length < numJokesToGet) {
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { ...jokeObj } = res.data;

          if (!seenJokes.has(jokeObj.id)) {
            seenJokes.add(jokeObj.id);
            j.push({ ...jokeObj, votes: 0 });
          } else {
            console.error("duplicate found!");
          }
        }
        setJokes(j);
        setIsLoading(false)
      } catch (err) {
        console.error(err);
      }
    }

    if (jokes.length === 0) getJokes();
  }, [jokes, numJokesToGet]);

  /* at mount, get jokes */

  // componentDidMount() {
  //   this.getJokes();
  // }

  // /* retrieve jokes from API */

  // async getJokes() {
  //   try {
  //     // load jokes one at a time, adding not-yet-seen jokes
  //     let jokes = [];
  //     let seenJokes = new Set();

  //     while (jokes.length < this.props.numJokesToGet) {
  //       let res = await axios.get("https://icanhazdadjoke.com", {
  //         headers: { Accept: "application/json" }
  //       });
  //       let { ...joke } = res.data;

  //       if (!seenJokes.has(joke.id)) {
  //         seenJokes.add(joke.id);
  //         jokes.push({ ...joke, votes: 0 });
  //       } else {
  //         console.log("duplicate found!");
  //       }
  //     }

  //     this.setState({ jokes, isLoading: false });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }

  /* empty joke list, set to loading state, and then call getJokes */

  function generateNewJokes() {
    // this.setState({ isLoading: true});
    // this.getJokes();

    setJokes([]);
    setIsLoading(true);
  }

  /* change vote for this id by delta (+1 or -1) */

  function vote(id, delta) {
    // this.setState(st => ({
    //   jokes: st.jokes.map(j =>
    //     j.id === id ? { ...j, votes: j.votes + delta } : j
    //   )
    // }));

    setJokes(allJokes =>
      allJokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  }

  /* render: either loading spinner or list of sorted jokes. */

  // render() {
  //   let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
  //   if (this.state.isLoading) {
    if (isLoading) {
      return (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )
    }

    let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

    return (
      <div className="JokeList">
        <button
          className="JokeList-getmore"
          // onClick={this.generateNewJokes}
          onClick={generateNewJokes}
        >
          Get New Jokes
        </button>

        {sortedJokes.map(/*j*/ ({joke, id, votes}) => (
          <Joke
            text={joke}
            key={id}
            id={id}
            votes={votes}
            vote={vote}
          />
        ))}
      </div>
    );
  
}

export default JokeList;
