"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { FooterField, HeaderField, StatusField, PostDateField, TextContentTabs } from "./SettingFields"
import { SettingsFormData } from '@/types/'

export function SettingsForm() {
  const { register, handleSubmit, watch } = useForm<SettingsFormData>({
    defaultValues: {
      textContent: ["", "", "", "", ""],
    },
  })

  const onSubmit = (data: SettingsFormData) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <StatusField register={register} />
      <PostDateField register={register} />
      <HeaderField register={register} />
      <FooterField register={register} />
      <TextContentTabs register={register} watch={watch} />
      <Button type="submit">Save Settings</Button>
    </form>
  )
}