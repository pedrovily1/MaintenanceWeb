import { Attachment } from "../types/workOrder";

export const attachmentService = {
  uploadFile: async (file: File): Promise<Attachment> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const attachment: Attachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          url: reader.result as string,
          size: file.size,
          createdAt: new Date().toISOString(),
        };
        resolve(attachment);
      };
      reader.readAsDataURL(file);
    });
  },

  formatSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};
