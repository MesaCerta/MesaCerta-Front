interface ImageDimensions {
  width: number;
  height: number;
}

const calculateDimensions = (
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): ImageDimensions => {
  let width = originalWidth;
  let height = originalHeight;

  const aspectRatio = originalWidth / originalHeight;

  if (width > height) {
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
  } else {
    if (height > maxHeight) {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  return { width: Math.floor(width), height: Math.floor(height) };
};

const calculateQuality = (fileSize: number): number => {
  if (fileSize > 5000000) return 0.3; // > 5MB
  if (fileSize > 2000000) return 0.4; // 2MB - 5MB
  if (fileSize > 1000000) return 0.5; // 1MB - 2MB
  return 0.7; // < 1MB
};

export const useImageCompression = (maxWidth = 600, maxHeight = 600) => {
  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = document.createElement("img");
        img.src = event.target?.result as string;

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            const { width, height } = calculateDimensions(
              img.width,
              img.height,
              maxWidth,
              maxHeight
            );

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");

            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            // Aqui tá ajustando a qualidade da imagem, com base no tamanho
            const quality = calculateQuality(file.size);
            let compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

            // Se tiver grande ainda, comprime muito mais
            if (compressedDataUrl.length > 1000000) {
              compressedDataUrl = canvas.toDataURL("image/jpeg", 0.3);
            }

            resolve(compressedDataUrl);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => reject(new Error("Failed to load image"));
      };

      reader.onerror = () => reject(new Error("Failed to read file"));
    });
  };

  return { compressImage };
};
