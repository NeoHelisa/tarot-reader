import React, { useState, useEffect } from "react";
import CardReveal from "./components/CardReveal";

type CardData = {
  country: string;
  tarot: string;
  chant: string;
  image: string;
  position: "upright" | "reversed";
};

const App: React.FC = () => {
  const [chant, setChant] = useState<string>(""); // User input
  const [cards, setCards] = useState<CardData[]>([]); // All cards
  const [showCard, setShowCard] = useState<boolean>(false); // Controls whether to show CardReveal
  const [matchingCard, setMatchingCard] = useState<CardData | null>(null); // Matched card

  // Load card data on component mount
  useEffect(() => {
    fetch("/cards_sf1.json")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((card: any) => ({
          ...card,
          image: `/sf1_tarot/${card.country}.png`, // Add image path dynamically
        }));
        setCards(updatedData);
      })
      .catch((error) => console.error("Error loading cards:", error));
  }, []);

  const handleReveal = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent default form submission
    if (chant.trim() === "") {
      alert("Please enter a chant!");
      return;
    }

    // Check if chant matches a card
    const foundCard = cards.find(
      (card) => card.chant.trim().toLowerCase() === chant.trim().toLowerCase()
    );

    if (foundCard) {
      setMatchingCard(foundCard); // Save the matching card
      setShowCard(true); // Show the CardReveal component
    } else {
      alert("Invalid chant! Please try again.");
    }
  };

  const resetView = () => {
    setChant("");
    setShowCard(false);
    setMatchingCard(null); // Reset matched card
  };

  return (
    <div className="root-container w-full relative">
      <div className="background"></div>
      <div className="root-wrapper flex flex-col items-center justify-center h-screen bg-gray-900 text-white w-[75vw] z-10 relative">
        <div className="page-header absolute top-10 max-w-[80vh] max-h-[10vh] h-full w-full">
          <img src="./page_header.png" alt="header" />
        </div>

        {!showCard ? (
          <form onSubmit={handleReveal} className="text-center form">
            {/* Wrapping input and button in a form */}
            <input
              type="text"
              value={chant}
              onChange={(e) => setChant(e.target.value)}
              className="px-4 py-2 text-black rounded-md"
              placeholder="Enter your chant..."
            />
            <button
              type="submit" // Button will trigger form submission on Enter
              className="submit-button ml-4 px-6 py-3 bg-blue-600 text-white rounded-lg"
            >
              Submit
            </button>
          </form>
        ) : (
          <>
            <CardReveal chantInput={chant} onReset={resetView} />
          </>
        )}

        <div className="bottom-wrapper pointer-events-none flex justify-between absolute bottom-20 max-h-[10vh] h-full w-full">
          <div className="bottom-1"></div>
          <div className="bottom-2"></div>
          <div className="bottom-3"></div>
        </div>
      </div>
    </div>
  );
};

export default App;
