import { useEffect, useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import ListGroup from "./components/ListGroup";

interface CardProps {
  title: string;
}

const Card = ({ title }: CardProps) => {
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    console.log("Clicked on " + title + " card " + hasLiked);
  }, [hasLiked, title]);

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text">This is a description for the card.</p>
        <button className="btn" onClick={() => setHasLiked(!hasLiked)}>
          {hasLiked ? "❤️" : "🤍"}
        </button>
      </div>
    </div>
  );
};

function App() {
  

  return (
    <>
      <Card title="Card 1" />
      <Card title="Card 2" />
      <Card title="Card 3" />
      <Card title="Card 4" />
    </>
  );
}

export default App;
