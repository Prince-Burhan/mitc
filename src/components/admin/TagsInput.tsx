import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  maxTags?: number;
}

const TagsInput = ({
  value = [],
  onChange,
  placeholder = 'Type and press Enter',
  maxTags = 10,
}: TagsInputProps) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      
      if (value.length >= maxTags) {
        alert(`Maximum ${maxTags} tags allowed`);
        return;
      }

      const newTag = input.trim().toLowerCase();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInput('');
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const handleRemove = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg min-h-[42px] focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center space-x-1 px-2 py-1 bg-primary-100 text-primary-700 rounded-md text-sm"
          >
            <span>{tag}</span>
            <button
              type="button"
              onClick={() => handleRemove(tag)}
              className="hover:bg-primary-200 rounded-full p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] outline-none bg-transparent"
          disabled={value.length >= maxTags}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter to add. {value.length}/{maxTags} tags
      </p>
    </div>
  );
};

export default TagsInput;