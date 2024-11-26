'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const FuturisticInput = ({ label, type, placeholder, name }) => (
  <div className="space-y-2">
    <Label htmlFor={name} className="text-white font-bold">{label}</Label>
    <div className="relative">
      <Input
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        className="bg-black bg-opacity-50 text-white placeholder-gray-400 border-2 border-transparent rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-opacity-70" />
      <div
        className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl filter blur-xl opacity-0 transition-opacity duration-300 -z-10 group-hover:opacity-50"></div>
    </div>
  </div>
)

export function SignupPageJsx() {
  const handleSubmit = (event) => {
    event.preventDefault()
    // Handle form submission here
  }

  return (
    (<div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-4">
      <div className="w-full max-w-md relative">
        {/* Geometric patterns */}
        <div
          className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div
          className="bg-black bg-opacity-50 p-8 rounded-2xl shadow-2xl backdrop-blur-lg relative z-10 border border-gray-800">
          <h2 className="text-4xl font-bold text-center text-white mb-8 tracking-wider">
            Join the <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Future</span> of Sports
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FuturisticInput label="Name" type="text" placeholder="John" name="name" />
              <FuturisticInput label="Surname" type="text" placeholder="Doe" name="surname" />
            </div>
            <FuturisticInput label="Email" type="email" placeholder="john@example.com" name="email" />
            <FuturisticInput label="Username" type="text" placeholder="johndoe" name="username" />
            <div className="space-y-2">
              <Label htmlFor="class" className="text-white font-bold">Class</Label>
              <Select name="class">
                <SelectTrigger
                  className="bg-black bg-opacity-50 text-white border-2 border-transparent rounded-xl transition-all duration-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-opacity-70">
                  <SelectValue placeholder="Select your class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="freshman">Freshman</SelectItem>
                  <SelectItem value="sophomore">Sophomore</SelectItem>
                  <SelectItem value="junior">Junior</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <FuturisticInput label="Age" type="number" placeholder="18" name="age" />
            <FuturisticInput
              label="Favorite Sport"
              type="text"
              placeholder="Basketball"
              name="favoriteSport" />
            
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform hover:scale-105">
              Sign Up
            </Button>
          </form>
        </div>
      </div>
    </div>)
  );
}