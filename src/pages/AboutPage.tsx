import React from 'react';
import { ArrowLeft, Sparkles, Users, Target, Award, Zap, Brain } from 'lucide-react';
import Footer from '../components/Footer';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  const teamMembers = [
    {
      name: "Akhil Nair",
      role: "Founder,Creative Director,Editor",
      image: "https://assets.zyrosite.com/dWxOrW2p4OtD7WKY/1750706385032-AGBzZB4yDbhnDN3O.jpeg",
      description: "Creative storytelling with 6+ years in Creative Content Creation."
    },
    {
      name: "Aman Dangi",
      role: "CMO,Creative Strategist  ",
      image: "https://iili.io/FZugXgs.md.png",
      description: "Entreprenur, Revolving around Graphics, Blockchain and Commerce"
    },
    {
      name: "Kitty",
      role: "AI Engineer",
      image: "https://iili.io/FZuO8cQ.jpg",
      description: "Our powerful AI automation tool"
    }
  ];

  const values = [
    {
      icon: Brain,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI technology in creative industries."
    },
    {
      icon: Users,
      title: "Client-Centric",
      description: "Every project is tailored to bring our clients' unique visions to life."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "We deliver production-ready content that meets the highest industry standards."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency",
      description: "AI-powered workflows that deliver exceptional results in record time."
    }
  ];

  return (
    <div className="min-h-screen bg-white pt-16 sm:pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.05),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] bg-[size:100px_100px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 sm:mb-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300"
          >
            <ArrowLeft className="w-4 sm:w-5 h-4 sm:h-5" />
            <span className="text-base sm:text-lg">Back to Home</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16 sm:mb-20">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-black via-gray-800 to-gray-600 bg-clip-text text-transparent">
              About Adally
            </span>
          </h1>
          <p className="text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
            We're pioneering the future of creative content through artificial intelligence. 
            Our mission is to democratize high-quality video production and make professional 
            storytelling accessible to everyone.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Founded in 2025 with the launch of Google VEO3, Adally emerged from a simple yet powerful vision: to revolutionize how stories are told in the digital age. We recognized that traditional video production was often expensive, time-consuming, and inaccessible to many creators with brilliant ideas.
              </p>
              <p>
                By harnessing the power of artificial intelligence, we've created a platform 
                that transforms concepts into compelling visual narratives in a fraction of 
                the time and cost of traditional methods. Our AI-powered tools don't replace 
                human creativity—they amplify it.
              </p>
              <p>
             
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800" 
                alt="AI Video Production" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do at Adally
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-2xl p-6 mb-4 group-hover:bg-gray-100 transition-colors duration-300">
                  <value.icon className="w-8 h-8 text-black mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-black mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              The creative minds behind Adally's innovative AI technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-black mb-2">{member.name}</h3>
                <p className="text-gray-500 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 rounded-3xl p-8 sm:p-12 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-black mb-4">Our Impact</h2>
            <p className="text-gray-600 text-lg">Numbers that showcase our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">50+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">10+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">24hrs</div>
              <div className="text-gray-600">Average Delivery</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-black mb-2">100%</div>
              <div className="text-gray-600">AI Generated</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-black mb-6">Ready to Create Something Amazing?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join the hundreds of creators who have transformed their ideas into stunning visual stories with Adally.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-black to-gray-800 rounded-full hover:from-gray-800 hover:to-black hover:scale-105 hover:shadow-2xl hover:shadow-black/25"
          >
            <span className="relative z-10">Get Started Today</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutPage;