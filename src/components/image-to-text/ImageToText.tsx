import { useState } from 'react';
import Tesseract from 'tesseract.js';

function ImageToText() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      setImagePreview(URL.createObjectURL(selectedImage));
    }
  };

  const handleExtractText = () => {
    if (image) {
      setLoading(true);
      setText('');
      Tesseract.recognize(image, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(m.progress);
          }
        },
      })
        .then(({ data: { text } }) => {
          setText(text);
        })
        .finally(() => {
          setLoading(false);
          setProgress(0);
        });
    }
  };

  return (
    <div>
      <h1>Image to Text with Tesseract.js</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <div>
      <div>
      {imagePreview && (
        <div>
          <h2>Image Preview:</h2>
          <img
            src={imagePreview}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '400px', marginBottom: '20px' }}
          />
        </div>
      )}
      </div>
      <div>
      {text && (
        <div>
          <h2>Extracted Text:</h2>
          <p>{text}</p>
        </div>
      )}
      </div>
      </div>

      
      
      
      
      <button onClick={handleExtractText} disabled={!image || loading}>
        {loading ? `Extracting... ${Math.round(progress * 100)}%` : 'Extract Text'}
      </button>
      
      
    </div>
  );
}

export default ImageToText
