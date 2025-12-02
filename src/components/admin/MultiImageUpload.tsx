import { useState, useRef } from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  maxImages?: number;
}

const MultiImageUpload = ({
  value = [],
  onChange,
  label = 'Upload Images',
  maxImages = 10,
}: MultiImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadMultiple, uploading, progress } = useImageUpload();
  const [previews, setPreviews] = useState<string[]>(value);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > maxImages) {
      alert(`Maximum ${maxImages} images allowed`);
      return;
    }

    // Show previews
    const newPreviews: string[] = [];
    for (const file of files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews([...value, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    }

    // Upload to Cloudinary
    const urls = await uploadMultiple(files);
    if (urls.length > 0) {
      onChange([...value, ...urls]);
      setPreviews([...value, ...urls]);
    }
  };

  const handleRemove = (index: number) => {
    const newUrls = value.filter((_, i) => i !== index);
    onChange(newUrls);
    setPreviews(newUrls);
  };

  const handleReorder = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(value);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
    setPreviews(items);
  };

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} ({value.length}/{maxImages})
        </label>
      )}

      <DragDropContext onDragEnd={handleReorder}>
        <Droppable droppableId="images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {previews.map((url, index) => (
                <Draggable key={url} draggableId={url} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="relative aspect-square bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden group"
                    >
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                        #{index + 1}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* Add button */}
              {value.length < maxImages && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <p className="text-xs text-gray-600 mt-2">{progress}%</p>
                    </>
                  ) : (
                    <>
                      <Plus className="h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-500 mt-2">Add Image</p>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />

      <p className="text-xs text-gray-500 mt-2">
        Drag to reorder. Maximum {maxImages} images. PNG, JPG, WebP (max 700KB each).
      </p>
    </div>
  );
};

export default MultiImageUpload;