'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from "@/components/ui/button"
// import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import 'easymde/dist/easymde.min.css'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })

export function BlogContentGenerator() {
  const [input, setInput] = useState('')
  const [options, setOptions] = useState({
    option1: false,
    option2: false,
    option3: false,
    option4: false,
  })
  const [draft, setDraft] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const handleOptionChange = (option: keyof typeof options) => (checked: boolean) => {
    setOptions(prev => ({ ...prev, [option]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const response = await fetch('/api/writer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
      // body: JSON.stringify({ input, options }),
    })
    const data = await response.json()
    const data2 = data.response;
    const aiResponse =
      JSON.parse(data2).candidates?.[0]?.content?.parts?.[0]?.text || "AIからの応答がありません。";
    setDraft(aiResponse)
  }

  const handlePost = () => {
    // Implement post functionality here
    console.log('Posting content:', draft)
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Blog Content Generator</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter theme or source URL"
          className="w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <Toggle label="Option 1" checked={options.option1} onChange={handleOptionChange('option1')} />
          <Toggle label="Option 2" checked={options.option2} onChange={handleOptionChange('option2')} />
          <Toggle label="Option 3" checked={options.option3} onChange={handleOptionChange('option3')} />
          <Toggle label="Option 4" checked={options.option4} onChange={handleOptionChange('option4')} />
        </div>
        <Button type="submit" className="w-full">Generate Draft</Button>
      </form>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Draft</h2>
          <Button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Preview' : 'Edit'}
          </Button>
        </div>
        {isEditing ? (
          <SimpleMDE
            value={draft}
            onChange={setDraft}
            options={{
              spellChecker: false,
              placeholder: "Start editing your draft here...",
            }}
          />
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown>{draft}</ReactMarkdown>
          </div>
        )}
      </div>
      <Button onClick={handlePost} className="w-full" disabled={!draft}>Post</Button>
    </div>
  )
}

