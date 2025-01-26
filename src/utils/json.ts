export const parseContent = (content: string | null | undefined) => {
  if (!content) return undefined;
  
  try {
    // Try to parse as JSON first
    return JSON.parse(content);
  } catch (error) {
    // If parsing fails, return the original string
    return {
      blocks: [
        {
          type: "paragraph",
          data: {
            text: content
          }
        }
      ]
    };
  }
}; 