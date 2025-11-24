import { useRef, useState } from "react";

interface Props {
  projectName: string;
}

export default function ProjectHeading({ projectName }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleNameChange = () => {
    console.log(`Change project name from "${projectName}" to "${newName}"`);
    setIsEditing(false);
  };

  return (
    <div className="relative">
      <h1
        className="px-2 py-1 text-2xl sm:text-3xl font-semibold cursor-text border border-transparent rounded hover:bg-slate-100 hover:border-slate-200"
        onClick={() => {
          setIsEditing(true);
          setTimeout(() => inputRef.current?.focus());
        }}
      >
        {projectName}
      </h1>
      <input
        ref={inputRef}
        type="text"
        className={`absolute top-0 left-0 right-0 block w-full text-2xl sm:text-3xl font-semibold ${
          isEditing ? "opacity-100 visible" : "opacity-0 invisible"
        } shadow-lg`}
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        onBlur={() => setTimeout(() => setIsEditing(false))}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setIsEditing(false);
          } else if (e.key === "Enter") {
            handleNameChange();
          }
        }}
      />
      {isEditing && (
        <button
          className="primary-button absolute top-full right-0 mt-2 shadow-lg z-10"
          onMouseDown={handleNameChange}
        >
          Save
        </button>
      )}
    </div>
  );
}
