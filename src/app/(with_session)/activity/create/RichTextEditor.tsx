"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button } from "antd";
import "remixicon/fonts/remixicon.css";
import { Level } from "@tiptap/extension-heading";

export default function useRichTextEditor() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<h4>请输入活动内容，支持富文本，支持markdown</h4>",
  });
  const levels: Level[] = [1, 2, 3, 4, 5];
  return (
    <div className="my-[20px] w-[600px]">
      <span className="text-[18px] mb-[20px]">活动内容</span>
      <div className="flex justify-around w-[500px] my-[10px] [&_i]:font-bold">
        <Button
          icon={<i className="ri-bold"></i>}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        />
        {levels.map((level) => {
          return (
            <Button
              key={`heading${level}`}
              icon={<i className={`ri-h-${level}`} />}
              onClick={() =>
                editor?.chain().focus().toggleHeading({ level }).run()
              }
            />
          );
        })}
        <Button
          icon={<i className="ri-italic" />}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        />
        <Button
          icon={<i className="ri-strikethrough" />}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        />
        <Button
          icon={<i className="ri-code-block" />}
          onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
        />
        <Button
          icon={<i className="ri-code-line" />}
          onClick={() => editor?.chain().focus().toggleCode().run()}
        />
        <Button
          icon={<i className="ri-list-ordered" />}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        />
        <Button
          icon={<i className="ri-list-unordered" />}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        />
        <Button
          icon={<i className="ri-quote-text" />}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        />
      </div>
      <EditorContent editor={editor} className="prose" />
    </div>
  );
}
