'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from '@/contexts/AuthContext';
import { getIdTokenResult } from 'firebase/auth'
import { useRouter } from 'next/navigation'

type FirstFormProps = {
  onSelect: (item: string) => void;
};

const steps = ['Title', 'Sources', 'Advanced Settings', 'Review']

// const Sidebar: React.FC<SidebarProps> = ({ items, projects, onSelect }) =>
const FirstForm: React.FC<FirstFormProps> = ({ onSelect }) => {
  const { user, loading, accessToken, idToken } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0)
  const [executing, setExecuting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    sources: [''],
    header: '',
    footer: '',
    postDate: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSourceChange = (index: number, value: string) => {
    const newSources = [...formData.sources]
    newSources[index] = value
    setFormData(prev => ({ ...prev, sources: newSources }))
  }

  const addSource = () => {
    setFormData(prev => ({ ...prev, sources: [...prev.sources, ''] }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setExecuting(true);
    setSuccess(false);

    console.log('Form submitted:', formData)
    const body_json = {
      "user_id":user?.uid,
      "github_access_token": accessToken,
      "data": formData
    }
    try {
      const body_str = JSON.stringify(body_json)
      console.log('body', body_str)
      fetch('https://generate-setting-33517488829.asia-northeast1.run.app/add_setting', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'Authorization': 'Bearer ' + idToken
        },
        body: body_str,
        mode: "cors",
        
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data)
        setSuccess(true);
        setExecuting(false);
      })
      .catch(error => {
        console.error('Error:', error)
      })
      
    } catch (error) {
      console.error('Error:', error);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ローディングポップアップ */}
      {executing && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">処理中です...</p>
          </div>
        </div>
      )}

      {/* 完了ポップアップ */}
      {success && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <p className="text-lg font-semibold">送信が完了しました！</p>
            <Button className="mt-4" onClick={() => {
              setSuccess(false);
              // router.push('/');
              onSelect("ホーム")
            }}>トップページへ</Button>
          </div>
        </div>
      )}

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

      {/* Form source */}
      <div className="flex-1 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {formData.sources.map((source, index) => (
                <div key={index}>
                  <Label htmlFor={`source-${index}`}>Source {index + 1}</Label>
                  <Textarea 
                    id={`source-${index}`}
                    value={source} 
                    onChange={(e) => handleSourceChange(index, e.target.value)} 
                    placeholder="Enter source"
                  />
                </div>
              ))}
              <Button type="button" onClick={addSource}>Add Source</Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="header">ヘッダー文</Label>
                <Input 
                  id="header" 
                  name="header" 
                  value={formData.header} 
                  onChange={handleInputChange} 
                  placeholder="Enter advanced setting 1"
                />
              </div>
              <div>
                <Label htmlFor="footer">フッター文</Label>
                <Input 
                  id="footer" 
                  name="footer" 
                  value={formData.footer} 
                  onChange={handleInputChange} 
                  placeholder="Enter advanced setting 2"
                />
              </div>
              <div>
                <Label htmlFor="postDate">初回投稿日</Label>
                <Input 
                  id="postDate" 
                  name="postDate" 
                  type="date"
                  value={formData.postDate} 
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
                <strong>Sources:</strong>
                <ul className="list-disc pl-5">
                  {formData.sources.map((source, index) => (
                    <li key={index}>{source}</li>
                  ))}
                </ul>
              </div>
              <p><strong>ヘッダー文:</strong> {formData.header}</p>
              <p><strong>フッター文</strong> {formData.footer}</p>
              <p><strong>初回投稿日</strong> {formData.postDate}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button type="button" onClick={prevStep} disabled={currentStep === 0}>Previous</Button>
            {currentStep === steps.length - 1 && <Button type="submit">Submit</Button>}
            { currentStep !== steps.length - 1 && <Button type="button" onClick={nextStep}>Next</Button>}
          </div>
        </form>
      </div>
    </div>
  )
}

export default FirstForm