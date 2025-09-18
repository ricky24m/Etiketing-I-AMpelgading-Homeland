export const cropImageTo4x3 = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const { width, height } = img;
      
      // Target aspect ratio 4:3
      const targetAspectRatio = 4 / 3;
      
      let cropWidth, cropHeight, cropX, cropY;
      
      if (width / height > targetAspectRatio) {
        // Gambar terlalu lebar, crop dari samping
        cropHeight = height;
        cropWidth = height * targetAspectRatio;
        cropX = (width - cropWidth) / 2;
        cropY = 0;
      } else {
        // Gambar terlalu tinggi, crop dari atas/bawah
        cropWidth = width;
        cropHeight = width / targetAspectRatio;
        cropX = 0;
        cropY = (height - cropHeight) / 2;
      }
      
      // Set canvas size untuk hasil crop (4:3 ratio)
      const outputWidth = 800; // Ukuran standard
      const outputHeight = 600; // 800 * (3/4) = 600
      
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      
      // Draw cropped image
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // Source crop area
        0, 0, outputWidth, outputHeight       // Destination area
      );
      
      // Convert canvas to blob then to file
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const croppedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(croppedFile);
          } else {
            reject(new Error('Failed to create blob'));
          }
        },
        file.type,
        0.9 // Quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const needsCrop = (file: File): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const currentRatio = img.width / img.height;
      const targetRatio = 4 / 3;
      const tolerance = 0.05; // 5% tolerance
      
      // Jika rasio tidak sesuai dengan 4:3, perlu crop
      resolve(Math.abs(currentRatio - targetRatio) > tolerance);
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};