import React, { useState } from "react";
import AICheckIn from "../components/modals/AICheckIn";

const TestModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  const handleComplete = (data: {
    mood: string;
    energy: number;
    gratitude: string;
    aiInsight: string;
  }) => {
    console.log("Check-in completed:", data);
    alert(`Check-in completed! Mood: ${data.mood}, Energy: ${data.energy}/10`);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-foreground mb-8">Test AI Check-In Modal</h1>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Open AI Check-In Modal
        </button>

        <div className="mt-8 p-4 bg-card rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Debug Info:</h2>
          <p>Modal is open: {showModal ? 'Yes' : 'No'}</p>
          <p>Click the button above to test the modal</p>
        </div>

        <AICheckIn
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
};

export default TestModal;