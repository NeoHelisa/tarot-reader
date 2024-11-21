import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  chantInput: string;
  onReset: () => void;
};

type CardData = {
  country: string;
  tarot: string;
  chant: string;
  image: string;
  position: "upright" | "reversed"; // Added position property
  status: string; // Add status property for "SAFE" or "CURSED"
};

const CardReveal: React.FC<Props> = ({ chantInput, onReset }) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [revealedCard, setRevealedCard] = useState<CardData | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchingCardFound, setMatchingCardFound] = useState(true);

  useEffect(() => {
    fetch("/cards_sf1.json")
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.map((card: any) => ({
          ...card,
          image: `/sf1_tarot/${card.country}.png`,
        }));
        setCards(updatedData);
      })
      .catch((error) => console.error("Error loading cards:", error));
  }, []);

  const handleReveal = () => {
    setIsSpinning(true); // Start spinning animation
    const matchingCard = cards.find(
      (card) => card.chant.trim().toLowerCase() === chantInput.trim().toLowerCase()
    );

    setTimeout(() => {
      if (matchingCard) {
        setMatchingCardFound(true); // Match found
        setRevealedCard(matchingCard); // Show the matched card
      } else {
        setMatchingCardFound(false); // No match found
        setRevealedCard(null); // Clear any revealed card
      }
      setIsSpinning(false); // Stop spinning
    }, 3000); // Spin for 3 seconds
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen mt-6">
      {/* Static default image */}
      {!isSpinning && !revealedCard ? (
        <div className="w-full flex justify-center max-w-[960px] aspect-video rounded-lg shadow-lg">
          <img
            src="/sf1_tarot/default.png"
            alt="default"
            className="max-h-[60vh] h-full object-contain rounded-lg"
          />
        </div>
      ) : null}

      {/* Spinning animation */}
      {isSpinning ? (
        <motion.div
          animate={{ rotate: 1440 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="w-full flex justify-center max-w-[960px] aspect-video rounded-lg shadow-lg"
        >
          <img
            src="/sf1_tarot/default.png"
            alt="default spinning"
            className="max-h-[60vh] h-full object-contain rounded-lg"
          />
        </motion.div>
      ) : null}

      {/* Revealed card */}
      {!isSpinning && revealedCard ? (
        <motion.div
          initial={{
            filter: "brightness(10) blur(10px)",
            rotate: revealedCard.position === "reversed" ? 180 : 0, // Rotate based on position
          }}
          animate={{
            filter: "brightness(1) blur(0px)",
            rotate: revealedCard.position === "reversed" ? 180 : 0, // Ensure no further rotation
          }}
          transition={{ duration: 2 }}
          className="w-full max-w-[960px] flex justify-center aspect-video rounded-lg shadow-lg"
        >
          <img
            src={revealedCard.image}
            alt={revealedCard.tarot}
            className="max-h-[60vh] h-full object-contain rounded-lg"
          />
        </motion.div>
      ) : null}

      {/* Error message */}
      {!isSpinning && !revealedCard && !matchingCardFound && (
        <div className="mt-4 text-red-500">No card matches the chant!</div>
      )}

      {/* Buttons */}
      <div className="mt-2">
        
      <span className="status-text flex text-center justify-center text-xl font-bold w-100">
        {revealedCard
          ? `${revealedCard.tarot} - ${revealedCard.position}` // Card name and position
          : "?????"}
      </span>

        <div className="mt-4 flex justify-center">
          <button
            onClick={handleReveal}
            className="reveal px-6 py-3 bg-blue-500 text-white rounded-lg"
          >
            REVEAL
          </button>
          <button
            onClick={onReset}
            className="ml-4 px-6 py-3 bg-gray-500 text-white rounded-lg"
          >
            BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardReveal;
