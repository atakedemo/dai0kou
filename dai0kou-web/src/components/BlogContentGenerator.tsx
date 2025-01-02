'use client'

import { useState } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import 'easymde/dist/easymde.min.css'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, ChevronLeft } from 'lucide-react'

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
  const [isRightSideOpen, setIsRightSideOpen] = useState(true)

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
    console.log('Posting content:', draft)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left side */}
      <div className="w-full md:w-1/2 p-4 overflow-y-auto">
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
      </div>

      {/* Right side */}
      <div className={`fixed top-0 right-0 h-full bg-white transition-all duration-300 ease-in-out ${isRightSideOpen ? 'w-full md:w-1/2' : 'w-12'} overflow-hidden`}>
        <div className="relative h-full">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
            onClick={() => setIsRightSideOpen(!isRightSideOpen)}
          >
            {isRightSideOpen ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
          <div className={`p-4 h-full overflow-y-auto ${isRightSideOpen ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            <h2 className="text-xl font-semibold mb-4">Draft</h2>
            <Tabs defaultValue="preview" className="w-full h-[calc(100%-8rem)]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="edit">Edit</TabsTrigger>
              </TabsList>
              <TabsContent value="preview" className="h-full overflow-y-auto">
                <div className="prose max-w-none p-4 border rounded-md bg-white">
                  <ReactMarkdown>{draft}</ReactMarkdown>
                </div>
              </TabsContent>
              <TabsContent value="edit" className="h-full">
                <SimpleMDE
                  value={draft}
                  onChange={setDraft}
                  options={{
                    spellChecker: false,
                    placeholder: "Start editing your draft here...",
                  }}
                />
              </TabsContent>
            </Tabs>
            <Button onClick={handlePost} className="w-full mt-4" disabled={!draft}>Post</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

