import React from 'react';

const Notifications: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-purple to-soft-pink p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Notifications
          </h1>
          <p className="text-lg text-muted-foreground">
            Stay connected with your support network
          </p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-lg border border-border text-center">
          <div className="text-6xl mb-4">🔔</div>
          <h2 className="text-2xl font-medium text-foreground mb-4">
            No Notifications Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            When you start connecting with friends and participating in the community,
            you'll see friend requests, encouragement messages, and milestone celebrations here.
          </p>
          <div className="bg-muted rounded-2xl p-4">
            <p className="text-sm text-muted-foreground">
              💡 <strong>Coming soon:</strong> Friend requests, achievement celebrations, and daily motivation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
