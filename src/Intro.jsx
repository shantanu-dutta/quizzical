export default function Intro({ changeView }) {
    return (
        <div className="intro">
            <div className="title">
                Quizzical
            </div>
            <div className="description">
                Test your quiz knowledge.
            </div>
            <button className="btn primary" onClick={changeView}>Start quiz</button>
        </div>
    )
}