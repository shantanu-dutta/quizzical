import { decode } from "html-entities";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";

const API_URL = "https://opentdb.com/api.php?amount=5&type=multiple";

function insertItemRandomly(array, item) {
  // Generate a random index between 0 and the length of the array
  const randomIndex = Math.floor(Math.random() * (array.length + 1));

  // Insert the item at the random index
  array.splice(randomIndex, 0, item);

  return array; // Return the modified array
}

function mapResponse(response) {
  const answer = decode(response["correct_answer"]);
  const incorrects = response["incorrect_answers"].map((answer) =>
    decode(answer)
  );
  return {
    id: nanoid(),
    question: decode(response.question),
    answer: answer,
    choices: insertItemRandomly(incorrects, answer),
  };
}

export default function Quiz() {
  const [trivias, setTrivias] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();

    const fetchTrivias = async () => {
      console.log("Fetching trivias...");
      const res = await fetch(API_URL, { signal: abortController.signal });
      if (res.ok) {
        const data = await res.json();
        const results = data.results;
        console.log("Response:", results);
        const formattedData = results.map((result) => mapResponse(result));
        console.log("Formatted response:", formattedData);
        setTrivias(formattedData);
      }
    };

    fetchTrivias();

    return () => abortController.abort("Duplicate request.");
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
  }

  function calculateScore(event) {
    setSubmitted(true);
    event.preventDefault();
    const total = trivias.reduce((tot, trivia) => {
      if (trivia.answer === answers[trivia.id]) {
        return tot + 1;
      }
      return tot;
    }, 0);
    setScore(total);
  }

  return (
    <form onSubmit={calculateScore} className={submitted ? "submitted" : ""}>
      {trivias.map((trivia) => (
        <div key={trivia.id} className="question-group">
          <h2 className="question">{trivia.question}</h2>
          <div className="radio-group">
            {trivia.choices.map((choice) => (
              <label
                className={`radio-button ${
                  answers[trivia.id] === choice ? "selected" : ""
                } ${submitted && trivia.answer === choice ? "correct" : ""}`}
                key={choice}
              >
                <input
                  type="radio"
                  name={trivia.id}
                  value={choice}
                  onChange={handleChange}
                />
                {choice}
              </label>
            ))}
          </div>
          <hr />
        </div>
      ))}
      {trivias.length > 0 && (
        <div className="bottom-container">
          {submitted ? (
            <>
              <p>
                You answered {score} / {trivias.length} correctly.
              </p>
              <button className="primary btn">Play again</button>
            </>
          ) : (
            <button className="primary btn">Check answers</button>
          )}
        </div>
      )}
    </form>
  );
}
