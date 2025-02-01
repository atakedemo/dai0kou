"use client"

// import { BlogContentGenerator } from '@/components/BlogContentGenerator'
import { SettingsForm } from '@/components/SettingsForm'
import FirstForm from '@/components/FirstForm'
import React, { useState } from "react";
import Sidebar from "@/components/ui/sidebar";
import { LoginButton } from "@/components/LoginButton"

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<string>("");

  // サイドバーのアイテムを定義
  const sidebarItems = ["ホーム", "設定"];
  const projects = ["XXX", "YYY", "ZZZ"]

  // 各コンテンツの中身を用意
  const renderContent = () => {
    switch (selectedContent) {
      case "ホーム":
        return <p>ホーム画面</p>;
      case "設定":
        return <p>ここで設定を変更できるんや。</p>;
      case "new_project":
        return <FirstForm />
      default:
        if (selectedContent=="XXX"){
          return selectedContent
        } else if (selectedContent=="YYY") {
          return <SettingsForm />
        } else {
          return <FirstForm />;
        }
    }
  };

  return (
    <main className="min-h-screen">
      <div className="flex">
        {/* サイドバー */}
        <Sidebar items={sidebarItems} projects={projects} onSelect={setSelectedContent} />

        {/* メインコンテンツ */}
        <main className="flex-1 p-4">
          <LoginButton />
          {renderContent()}
        </main>
      </div>
    </main>
  )
}

