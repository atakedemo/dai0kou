import React from "react";
import { LuPlus } from "react-icons/lu";

type SidebarProps = {
  items: string[];
  projects: string[];
  onSelect: (item: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ items, projects, onSelect }) => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white">
      <div className="p-4 text-lg font-bold">メニュー</div>
      <ul className="space-y-4 p-4">
        {items.map((item) => (
          <li key={item}>
            <button
              onClick={() => onSelect(item)}
              className="block w-full rounded px-4 py-2 text-left hover:bg-gray-700"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>

      <div className="p-4 text-md font-bold">プロジェクト</div>
      <ul className="space-y-6 p-6">
        {projects.map((project) => (
          <li key={project}>
            <button
              onClick={() => onSelect(project)}
              className="text-sm w-full rounded px-5 py-3 text-left hover:bg-gray-700"
            >
              {project}
            </button>
          </li>
        ))}
      </ul>
      <li>
        <button
          onClick={() => onSelect("new_project")}
          className="text-sm rounded px-5 py-3 text-left hover:bg-gray-700"
        >
          <LuPlus />
          新しい投稿セットを作る
        </button>
      </li>
    </div>
  );
};

export default Sidebar;