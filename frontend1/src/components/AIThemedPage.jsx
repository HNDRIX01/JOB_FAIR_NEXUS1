'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

export default function AIThemedPage() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [recommendedEnterprises, setRecommendedEnterprises] = useState([]);
  const [showEnterprises, setShowEnterprises] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const rightContainerRef = useRef(null);

  useEffect(() => {
    let index = 0;
    if (result) {
      const intervalId = setInterval(() => {
        setDisplayedText(result.slice(0, index));
        index++;
        if (index > result.length) {
          clearInterval(intervalId);
          // Show enterprises after text animation completes
          setTimeout(() => {
            setShowEnterprises(true);
            // Move the container up after a short delay
            setTimeout(() => {
              setMoveUp(true);
            }, 300);
          }, 500);
        }
      }, 15);  

      return () => clearInterval(intervalId);
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowEnterprises(false);
    setMoveUp(false);
  
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/insights/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);

        const jobTitles = result.job_titles || [];
        const enterprises = result.recommended_enterprises || [];
  
        const formattedResult = `
          <h2 class="text-2xl font-bold mb-4 font-sans">AI-Generated Job Insights</h2>
          <p class="text-lg font-sans mb-4">Based on your inputs, here are some suggested job titles for a future proof career:</p>
          <div class="space-y-2 mb-6">
            ${jobTitles.length > 0 
              ? jobTitles.map(job => `<p class="text-lg font-bold font-sans">${job}</p>`).join('')
              : '<p class="text-lg font-sans">No recommended job titles available.</p>'
            }
          </div>
        `;
  
        setResult(formattedResult);
        setRecommendedEnterprises(enterprises);
        form.reset();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setResult(`<p class="text-lg font-sans text-red-500">Failed to fetch AI insights. Please try again. Error: ${error.message}</p>`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-br from-[#065F78] via-[#4E1C40] to-[#B95532] flex flex-col items-center justify-center p-4 pt-32 lg:p-8 lg:pt-32 ${montserrat.className} overflow-hidden`}>
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-[1920px] gap-8">
        <div className="w-full lg:w-[600px] p-8 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl mb-6 lg:mb-0">
          <div className="w-full h-24 mb-6 flex items-center justify-center">
            <div className="w-full h-full flex justify-center items-center">
              <div className="relative w-24 h-24 flex justify-center items-center mx-2">
                <Image
                  src="/images/LOGO-JOB-FAIR-2.png"
                  alt="ISG Logo"
                  width={96}
                  height={96}
                  objectFit="contain"
                />
              </div>
              <div className="w-px h-full bg-gradient-to-b from-white/0 via-white to-white/0"></div>
              <div className="relative w-24 h-24 flex justify-center items-center mx-2">
                <Image
                  src="/images/logo_sma_blanc.png"
                  alt="SMA Logo"
                  width={96}
                  height={96}
                  objectFit="contain"
                />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
            <h1 className="text-3xl font-bold text-[#B3D9E0] mb-6 text-center">
              SMA Insight <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#B3D9E0] to-[#AF6DA6]">Nexus</span>
            </h1>

            <div className="space-y-2">
              <Label htmlFor="study" className="text-white text-lg">
                What are you studying?
              </Label>
              <Input
                id="study"
                name="study"
                className="w-full bg-gradient-to-br from-[#065F78]/30 to-[#4E1C40]/30 border border-transparent focus:border-[#B95532] focus:ring-[#AF6DA6] text-white placeholder-white/50 rounded-xl font-sans"
                placeholder="Enter your response..."
                required
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6, 95, 120, 0.3), rgba(78, 28, 64, 0.3))',
                  borderWidth: '1px',
                  borderColor: '#065F78',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hobby" className="text-white text-lg">
                What is your favorite hobby?
              </Label>
              <Input
                id="hobby"
                name="hobby"
                className="w-full bg-gradient-to-br from-[#065F78]/30 to-[#4E1C40]/30 border border-transparent focus:border-[#B95532] focus:ring-[#AF6DA6] text-white placeholder-white/50 rounded-xl font-sans"
                placeholder="Enter your response..."
                required
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6, 95, 120, 0.3), rgba(78, 28, 64, 0.3))',
                  borderWidth: '1px',
                  borderColor: '#065F78',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="job" className="text-white text-lg">
                What is your dream job?
              </Label>
              <Input
                id="job"
                name="job"
                className="w-full bg-gradient-to-br from-[#065F78]/30 to-[#4E1C40]/30 border border-transparent focus:border-[#B95532] focus:ring-[#AF6DA6] text-white placeholder-white/50 rounded-xl font-sans"
                placeholder="Enter your response..."
                required
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6, 95, 120, 0.3), rgba(78, 28, 64, 0.3))',
                  borderWidth: '1px',
                  borderColor: '#065F78',
                }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skill" className="text-white text-lg">
                What is something you are skilled at?
              </Label>
              <Input
                id="skill"
                name="skill"
                className="w-full bg-gradient-to-br from-[#065F78]/30 to-[#4E1C40]/30 border border-transparent focus:border-[#B95532] focus:ring-[#AF6DA6] text-white placeholder-white/50 rounded-xl font-sans"
                placeholder="Enter your response..."
                required
                style={{
                  background: 'linear-gradient(to bottom right, rgba(6, 95, 120, 0.3), rgba(78, 28, 64, 0.3))',
                  borderWidth: '1px',
                  borderColor: '#065F78',
                }}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#065F78]/90 to-[#4E1C40]/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 font-sans"
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Insights'}
            </Button>
          </form>
        </div>

        <div 
          ref={rightContainerRef}
          className={`w-full lg:w-[800px] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
            moveUp ? 'transform -translate-y-16' : ''
          }`}
        >
          <div
            className={`w-full min-h-[300px] bg-gradient-to-br from-[#065F78]/80 to-[#4E1C40]/80 rounded-3xl p-8 shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-1000 ease-in-out ${result ? 'scale-100 opacity-100' : 'scale-95 opacity-80'}`}
          >
            <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
            <div
              className="text-white text-lg font-light leading-relaxed relative z-10"
              dangerouslySetInnerHTML={{ __html: displayedText || 'Your AI-generated insights will materialize here...' }}
            />
          </div>

          {recommendedEnterprises.length > 0 && (
            <div className={`mt-8 w-full transition-all duration-500 ease-in-out transform ${showEnterprises ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-2xl font-bold mb-6 font-sans text-white text-center">Recommended Enterprises for Internships</h2>
              <div className="flex flex-wrap justify-center items-center">
                {recommendedEnterprises.slice(0, 3).map((enterprise, index) => {
                  const cleanEnterprise = enterprise.replace(/^\d+\.\s*/, '');
                  const firstWord = cleanEnterprise.split(' ')[0];
                  const imageName = firstWord + '.png';
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col items-center ${index === 2 ? 'w-full mt-4' : 'w-1/2'}`}
                    >
                      <div className="relative group">
                        <div className="absolute inset-0 bg-white rounded-full transform transition-transform duration-300 group-hover:scale-105">
                          {/* Decorative border */}
                          <div className="absolute -inset-1.5 bg-gradient-to-r from-[#AF6DA6] to-[#B3D9E0] rounded-full opacity-75">
                            <div className="absolute inset-0.5 rounded-full"></div>
                          </div>
                          {/* Animated circles */}
                          <div className="absolute inset-0 rounded-full">
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-[#AF6DA6] rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute top-1/2 right-0 w-2 h-2 bg-[#B3D9E0] rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-[#AF6DA6] rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
                          </div>
                        </div>
                        <div className="relative w-40 h-40 flex items-center justify-center bg-white rounded-full p-4 transform transition-transform duration-300 group-hover:scale-105">
                          <Image
                            src={`/images/${imageName}`}
                            alt={cleanEnterprise}
                            layout="fill"
                            objectFit="contain"
                            className="p-4"
                          />
                        </div>
                      </div>
                      <p className="text-lg font-bold font-sans text-center text-white mt-4">{cleanEnterprise}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

