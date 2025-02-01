'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FieldProps, MarkdownEditordProps, TabContentFieldProps } from '@/types/'

import ReactMarkdown from 'react-markdown'

export function FooterField({ register }: FieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='footer'>Footer</Label>
      <Textarea id='footer' {...register('footer')} />
    </div>
  )
}

export function HeaderField({ register }: FieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='header'>Header</Label>
      <Textarea id='header' {...register('header')} />
    </div>
  )
}

export function PostDateField({ register }: FieldProps) {
  return (
    <div className='space-y-2'>
      <Label htmlFor='postDate'>Post Date</Label>
      <Input id='postDate' type='date' {...register('postDate')} />
    </div>
  )
}

export function MarkdownEditor({ register, name, defaultValue = "", onSave }: MarkdownEditordProps & { onSave?: (content: string) => void }) {
  const [preview, setPreview] = useState(false)
  const [content, setContent] = useState(defaultValue)

  useEffect(() => {
    setContent(defaultValue)
  }, [defaultValue])

  const handleSave = () => {
    if (onSave) {
      onSave(content)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => setPreview(!preview)}>
          {preview ? "Edit" : "Preview"}
        </Button>
      </div>
      {preview ? (
        <div className="prose max-w-none p-4 border rounded-md">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <Textarea
          {...register(name, {
            onChange: (e) => setContent(e.target.value),
          })}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter markdown content here..."
          className="min-h-[300px]"
        />
      )}
      <div className="flex justify-end">
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  )
}

export function TextContentTabs({ register, watch, setValue }: TabContentFieldProps) {
  const [activeTab, setActiveTab] = useState("tab1")
  const [editingTab, setEditingTab] = useState<string | null>(null)

  const tabContents = watch("textContent") || ["", "", "", "", ""]

  const handleEditClick = (tabIndex: string) => {
    setEditingTab(tabIndex)
  }

  const handleDialogClose = (index: number, updatedContent: string) => {
    const updatedTabContents = [...tabContents]
    updatedTabContents[index] = updatedContent
    setValue("textContent", updatedTabContents)
  }

  return (
    <div className="space-y-4">
      <Label>Text Content</Label>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          {["tab1", "tab2", "tab3", "tab4", "tab5"].map((tab, index) => (
            <TabsTrigger key={tab} value={tab}>
              Tab {index + 1}
            </TabsTrigger>
          ))}
        </TabsList>
        {["tab1", "tab2", "tab3", "tab4", "tab5"].map((tab, index) => (
          <TabsContent key={tab} value={tab}>
            <div className="mt-4 space-y-4">
                <Dialog onOpenChange={(isOpen) => {
                  if (!isOpen && editingTab === `tab${index + 1}`) {
                    setEditingTab(null)
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleEditClick(tab)}>Edit Content</Button>
                  </DialogTrigger>
                <div className="prose max-w-none">
                  {tabContents[index] ? (
                    // <div dangerouslySetInnerHTML={{ __html: tabContents[index] }} />
                    <ReactMarkdown>{ tabContents[index] }</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">No content yet. Click Edit to add content. {tab}: {index}</p>
                  )
                  }
                </div>
              
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Edit Tab {index + 1} Content</DialogTitle>
                  </DialogHeader>
                  <MarkdownEditor
                    register={register}
                    name={`textContent.${index}`}
                    defaultValue={tabContents[index]}
                    onSave={(updatedContent) => handleDialogClose(index, updatedContent)}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}