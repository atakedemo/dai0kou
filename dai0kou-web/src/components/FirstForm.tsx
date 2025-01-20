'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const steps = ['Title', 'Contents', 'Advanced Settings', 'Review']

export default function FirstForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    title: '',
    contents: [''],
    advancedSetting1: '',
    advancedSetting2: '',
    advancedSettingNumber: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleContentChange = (index: number, value: string) => {
    const newContents = [...formData.contents]
    newContents[index] = value
    setFormData(prev => ({ ...prev, contents: newContents }))
  }

  const addContent = () => {
    setFormData(prev => ({ ...prev, contents: [...prev.contents, ''] }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Step bar */}
      <div className="w-64 bg-white p-4">
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li 
              key={step} 
              className={`p-2 rounded ${currentStep === index ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {step}
            </li>
          ))}
        </ul>
      </div>

      {/* Form content */}
      <div className="flex-1 p-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {currentStep === 0 && (
            <div>
              <Label htmlFor="title">Title</Label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Enter title"
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              {formData.contents.map((content, index) => (
                <div key={index}>
                  <Label htmlFor={`content-${index}`}>Content {index + 1}</Label>
                  <Textarea 
                    id={`content-${index}`}
                    value={content} 
                    onChange={(e) => handleContentChange(index, e.target.value)} 
                    placeholder="Enter content"
                  />
                </div>
              ))}
              <Button type="button" onClick={addContent}>Add Content</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="advancedSetting1">Advanced Setting 1</Label>
                <Input 
                  id="advancedSetting1" 
                  name="advancedSetting1" 
                  value={formData.advancedSetting1} 
                  onChange={handleInputChange} 
                  placeholder="Enter advanced setting 1"
                />
              </div>
              <div>
                <Label htmlFor="advancedSetting2">Advanced Setting 2</Label>
                <Input 
                  id="advancedSetting2" 
                  name="advancedSetting2" 
                  value={formData.advancedSetting2} 
                  onChange={handleInputChange} 
                  placeholder="Enter advanced setting 2"
                />
              </div>
              <div>
                <Label htmlFor="advancedSettingNumber">Advanced Setting Number</Label>
                <Input 
                  id="advancedSettingNumber" 
                  name="advancedSettingNumber" 
                  type="number"
                  value={formData.advancedSettingNumber} 
                  onChange={handleInputChange} 
                  placeholder="Enter a number"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Review Your Submission</h2>
              <p><strong>Title:</strong> {formData.title}</p>
              <div>
                <strong>Contents:</strong>
                <ul className="list-disc pl-5">
                  {formData.contents.map((content, index) => (
                    <li key={index}>{content}</li>
                  ))}
                </ul>
              </div>
              <p><strong>Advanced Setting 1:</strong> {formData.advancedSetting1}</p>
              <p><strong>Advanced Setting 2:</strong> {formData.advancedSetting2}</p>
              <p><strong>Advanced Setting Number:</strong> {formData.advancedSettingNumber}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
            <Button type="button" onClick={nextStep} disabled={currentStep === steps.length - 1}>
              {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}