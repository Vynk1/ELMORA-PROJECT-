import React from 'react';
import { Mail, LifeBuoy, Lightbulb, Sparkles, BookOpen, Users } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-blue to-soft-green p-4">
      <div className="max-w-4xl mx-auto pt-8 pb-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-light text-foreground mb-4">
            Help & Contact
          </h1>
          <p className="text-lg text-muted-foreground">
            We're here to support you on your well-being journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-xl font-medium text-foreground mb-6">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground mb-2">How do I track my mood?</h3>
                <p className="text-sm text-muted-foreground">
                  Use the mood switcher in the top-right corner to select your current mood. Your selected mood will personalize your experience.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground mb-2">How do rewards work?</h3>
                <p className="text-sm text-muted-foreground">
                  Complete 70% or more of your daily tasks to earn reward points. These points will unlock coupons and special features.
                </p>
              </div>
              
              <div className="border-b border-border pb-4">
                <h3 className="font-medium text-foreground mb-2">Is my data private?</h3>
                <p className="text-sm text-muted-foreground">
                  Yes! Your personal information and mood data are kept private and secure. We never share your personal details without your consent.
                </p>
              </div>
              
              <div className="pb-4">
                <h3 className="font-medium text-foreground mb-2">How can I find supportive friends?</h3>
                <p className="text-sm text-muted-foreground">
                  Our friend-matching feature will help you connect with like-minded people based on shared interests and well-being goals.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-border">
            <h2 className="text-xl font-medium text-foreground mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Email Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For general questions and support
                  </p>
                  <a href="mailto:support@elmora.app" className="text-primary hover:text-primary/80 text-sm">
                    support@elmora.app
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Crisis Support</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you're in crisis, please reach out for immediate help
                  </p>
                  <div className="space-y-1 text-sm">
                    <p className="text-foreground">
                      <strong>US:</strong> <a href="tel:988" className="text-primary">988 Suicide & Crisis Lifeline</a>
                    </p>
                    <p className="text-foreground">
                      <strong>UK:</strong> <a href="tel:116123" className="text-primary">116 123 Samaritans</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-1">Feedback</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Help us improve ELMORA with your suggestions
                  </p>
                  <a href="mailto:feedback@elmora.app" className="text-primary hover:text-primary/80 text-sm">
                    feedback@elmora.app
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-border mt-8">
          <h2 className="text-xl font-medium text-foreground mb-6 text-center">Well-being Resources</h2>
          
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-soft-blue/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-8 h-8 text-blue-600" strokeWidth={2} />
              </div>
              <h3 className="font-medium text-foreground mb-2">Mindfulness</h3>
              <p className="text-sm text-muted-foreground">
                Daily meditation and breathing exercises
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-soft-green/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <BookOpen className="w-8 h-8 text-green-600" strokeWidth={2} />
              </div>
              <h3 className="font-medium text-foreground mb-2">Resources</h3>
              <p className="text-sm text-muted-foreground">
                Articles and guides for mental wellness
              </p>
            </div>
            
            <div>
              <div className="w-12 h-12 bg-soft-purple/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-8 h-8 text-purple-600" strokeWidth={2} />
              </div>
              <h3 className="font-medium text-foreground mb-2">Community</h3>
              <p className="text-sm text-muted-foreground">
                Connect with supportive peers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
