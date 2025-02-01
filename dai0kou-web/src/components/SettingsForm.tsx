"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from '@/components/ui/label'
import { FooterField, HeaderField, PostDateField, TextContentTabs } from "./SettingFields"
import { SettingsFormData } from '@/types/'

export function SettingsForm() {
  const { register, handleSubmit, watch, setValue } = useForm<SettingsFormData>({
    defaultValues: {
      status: "success",
      textContent: ["", "", "", "", ""],
    },
  })

  // APIで該当プロジェクトの値を取得してセットする
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch("/api/settings")
  //       const data: SettingsFormData = await response.json()

  //       setValue("status", data.status)
  //       setValue("postDate", data.postDate)
  //       setValue("header", data.header)
  //       setValue("footer", data.footer)
  //       setValue("textContent", data.textContent)
  //     } catch (error) {
  //       console.error("Failed to fetch settings:", error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  //   fetchData()
  // }, [setValue])

  const statusValue = watch("status")

  const onSubmit = (data: SettingsFormData) => {
    console.log(data)
    // Here you would typically send the data to your backend
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* <StatusField status={statusValue} /> */}
      <Label htmlFor='status'>Status: {statusValue}</Label>
      <PostDateField register={register} />
      <HeaderField register={register} />
      <FooterField register={register} />
      <TextContentTabs register={register} watch={watch} setValue={setValue} />
      <Button type="submit">Save Settings</Button>
    </form>
  )
}