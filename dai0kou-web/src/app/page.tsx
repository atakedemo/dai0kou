"use client"

// import { BlogContentGenerator } from '@/components/BlogContentGenerator'
import FirstForm from '@/components/FirstForm'
import React, { useState } from "react";
import Sidebar from "@/components/ui/sidebar";

export default function Home() {
  const [selectedContent, setSelectedContent] = useState<string>("ホーム");

  // サイドバーのアイテムを定義
  const sidebarItems = ["ホーム", "設定"];
  const projects = ["XXX", "YYY", "ZZZ"]

  // 各コンテンツの中身を用意
  const renderContent = () => {
    switch (selectedContent) {
      case "ホーム":
        return <FirstForm />;
      case "設定":
        return <p>ここで設定を変更できるんや。</p>;
      default:
        if (selectedContent=="XXX"){
          return selectedContent
        } else {
          return <p>選択肢が見つからへんで。</p>;
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
          <h1 className="text-2xl font-bold">{selectedContent}</h1>
          {renderContent()}
        </main>
      </div>
    </main>
  )
}

