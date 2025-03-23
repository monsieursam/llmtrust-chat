import { useFormContext } from "react-hook-form";
import { useEffect, useState } from "react";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { MultiSelect } from "@/components/ui/multi-select";

export default function TagsModelForm() {
  const { control, setValue, watch } = useFormContext();
  const [tagOptions, setTagOptions] = useState<{ label: string; value: string }[]>([]);
  const selectedTags = watch("tags") || [];

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags');
        const data = await response.json();
        setTagOptions(data.map((tag: { name: string }) => ({
          label: tag.name,
          value: tag.name
        })));
      } catch (error) {
        console.error('Failed to fetch tags:', error);
      }
    };

    fetchTags();
  }, []);

  const handleTagChange = (values: string[]) => {
    setValue("tags", values.map(value => ({ name: value })));
  };

  const handleCreateTag = (value: string) => {
    // Add the new tag to the options
    setTagOptions(prev => [...prev, { label: value, value }]);

    // Select the new tag
    const currentValues = selectedTags.map((tag: { name: string }) => tag.name);
    setValue("tags", [...currentValues, value].map(name => ({ name })));
  };

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="tags"
        render={() => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <MultiSelect
                options={tagOptions}
                selected={selectedTags.map((tag: { name: string }) => tag.name)}
                onChange={handleTagChange}
                placeholder="Select or create tags..."
                onCreateOption={handleCreateTag}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}
