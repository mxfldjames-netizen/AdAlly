import React from 'react';
import { Check, Mail } from 'lucide-react';
import Footer from '../components/Footer';

interface PricingPageProps {
  onBack: () => void;
  onContactClick?: () => void;
}

const PricingPage: React.FC<PricingPageProps> = ({ onBack, onContactClick }) => {
  const plans = [
    {
      name: 'Basic Plan',
      price: 99,
      features: [
        '2 AI Video Ads per month',
        '2 Static Ads per month',
        'Basic AI Videos',
        'Email Support',
        'Standard Processing',
      ],
      popular: false,
    },
    {
      name: 'Creator Plan',
      price: 249,
      features: [
        '3 AI Video Ads per month',
        '6 Static Ads per month',
        'Enhanced AI Videos',
        'Priority Email Support',
        'Fast Processing',
      ],
      popular: true,
    },
    {
      name: 'Viral Plan',
      price: 499,
      features: [
        '5 AI Video Ads per month',
        '8 Static Ads per month',
        'Premium AI Videos with Music',
        'Dedicated Support',
        'Express Processing',
        'Custom Music Integration',
      ],
      popular: false,
    },
  ];

  const handleContactUs = () => {
    if (onContactClick) {
      onContactClick();
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              Limited Time Early Bird Deals!
            </span>
          </h1>
          <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
            Select the perfect plan for your creative needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                plan.popular ? 'ring-2 ring-black' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-black text-white px-4 py-1 text-sm font-semibold rounded-bl-lg">
                  Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 text-lg">/month</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                    plan.popular
                      ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            </div>
          ))}

          <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="p-8 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Custom Plan
                </h3>

                <div className="mb-6">
                  <span className="text-white text-lg">Tailored to your needs</span>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Unlimited AI Videos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Unlimited Static Ads</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Premium Features</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">24/7 Priority Support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <span className="text-gray-300">Custom Solutions</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleContactUs}
                className="w-full py-3 px-6 rounded-lg font-semibold bg-white text-black hover:bg-gray-100 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Contact Us
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            All plans include access to our AI-powered creative tools and regular updates
          </p>
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-black transition-colors duration-200 font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
