'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
})

export default function AIThemedPage() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
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
        const resultElement = document.getElementById("result");
        
        const formattedResult = ` 
          <h2 class="text-2xl font-bold mb-4 font-sans">AI-Generated Job Insights</h2>
          <p class="text-lg font-sans mb-4">Based on your inputs, here are some suggested job titles for you:</p>
          <div class="space-y-2">
            ${result.job_titles.map(job => `<p class="text-lg font-bold font-sans">${job}</p>`).join('')}
          </div>
        `;
        
        resultElement.innerHTML = formattedResult;
        form.reset();

      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      const resultElement = document.getElementById("result");
      resultElement.textContent = "Failed to fetch AI insights. Please try again.";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#065F78] via-[#4E1C40] to-[#B95532] flex flex-col lg:flex-row items-center justify-center p-4 lg:p-8 ${montserrat.className}`}>
      {/* Left side - Image and Form */}
      <div className="w-full lg:w-1/3 p-8 backdrop-blur-lg bg-white/10 rounded-3xl shadow-2xl mb-8 lg:mb-0 lg:mr-8 flex flex-col items-center">
        <div className="mb-8 w-full max-w-[200px] aspect-square relative">
          <Image
            src="/images/BAT.png"
            alt="SMA Logo"
            layout="fill"
            objectFit="contain"
            className="rounded-full"
          />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold text-white mb-8 text-center">SMA Insight Nexus</h1>
          
          <div className="space-y-2">
            <Label htmlFor="study" className="text-white text-lg">
              What are you studying?
            </Label>
            <Input 
              id="study" 
              name="study"
              className="w-full bg-white/20 border-transparent focus:border-[#B95532] focus:ring-[#B95532] text-white placeholder-white/50 rounded-xl font-sans"
              placeholder="Enter your response..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="hobby" className="text-white text-lg">
              What is your favorite hobby?
            </Label>
            <Input 
              id="hobby" 
              name="hobby"
              className="w-full bg-white/20 border-transparent focus:border-[#B95532] focus:ring-[#B95532] text-white placeholder-white/50 rounded-xl font-sans"
              placeholder="Enter your response..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job" className="text-white text-lg">
              What is your dream job?
            </Label>
            <Input 
              id="job" 
              name="job"
              className="w-full bg-white/20 border-transparent focus:border-[#B95532] focus:ring-[#B95532] text-white placeholder-white/50 rounded-xl font-sans"
              placeholder="Enter your response..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skill" className="text-white text-lg">
              What is something you are skilled at?
            </Label>
            <Input 
              id="skill" 
              name="skill"
              className="w-full bg-white/20 border-transparent focus:border-[#B95532] focus:ring-[#B95532] text-white placeholder-white/50 rounded-xl font-sans"
              placeholder="Enter your response..."
            />
          </div>
          
          <Button type="submit" className="w-full bg-[#188EA8] hover:bg-[#188EA8]/90 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 font-sans">
            Generate Insights
          </Button>
        </form>
      </div>

      {/* Right side - Generated content */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full min-h-[300px] bg-gradient-to-br from-[#065F78]/80 to-[#4E1C40]/80 rounded-3xl p-8 shadow-2xl border border-white/20 glow-effect relative overflow-hidden">
          <div className="absolute inset-0 bg-circuit-pattern opacity-10"></div>
          <div id="result" className="text-white text-lg font-light leading-relaxed relative z-10">
            Your AI-generated insights will materialize here...
          </div>
        </div>
      </div>
    </div>
  )
}

