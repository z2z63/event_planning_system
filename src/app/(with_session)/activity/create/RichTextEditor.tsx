"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Button } from "antd";
import "remixicon/fonts/remixicon.css";
import { Level } from "@tiptap/extension-heading";

export default function useRichTextEditor(defaultValue: string) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: defaultValue,
  });
  const levels: Level[] = [1, 2, 3, 4, 5];

  function getEditorData() {
    if (editor === null) {
      throw Error("RichTextEditor not initialized");
    }
    return editor.getHTML();
  }

  const RichTextEditor = (
    <div className="flex flex-col">
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
      <EditorContent
        editor={editor}
        className="prose [&>.tiptap.ProseMirror]:border
      [&>.tiptap.ProseMirror]:min-h-[300px] [&>.tiptap.ProseMirror]:w-[600px] [&>.tiptap.ProseMirror]:p-[1px]
       [&>.tiptap.ProseMirror]:border-dashed [&>.tiptap.ProseMirror]:border-gray-500"
      />
    </div>
  );
  return { RichTextEditor, getEditorData };
}
