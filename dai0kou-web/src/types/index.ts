import { UseFormRegister, UseFormWatch } from "react-hook-form"

export type SettingsFormData = {
    status: string
    postDate: string
    header: string
    footer: string
    textContent: string[]
  }

export type FieldProps = {
    register: UseFormRegister<SettingsFormData>
}

export type MarkdownEditordProps = {
    register: UseFormRegister<SettingsFormData>,
    name: "status" | "postDate" | "header" | "footer" | "textContent" | `textContent.${number}`,
    defaultValue: string
}

export type TabContentFieldProps = {
    register: UseFormRegister<SettingsFormData>,
    watch: UseFormWatch<SettingsFormData>
}