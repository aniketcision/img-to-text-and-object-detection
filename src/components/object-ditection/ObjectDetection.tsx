import React, { useEffect, useRef, useState } from 'react';
import ml5 from 'ml5';

const ObjectDetection: React.FC = () => {
  const [objects, setObjects] = useState<any[]>([]);
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null); 
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          setImageSrc(result as string | ArrayBuffer);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const detectObjects = async () => {
      const objectDetector = await ml5.objectDetector('cocossd');

      if (imageRef.current) {
        objectDetector.detect(imageRef.current, (err: any, results: any) => {
          if (err) {
            console.error(err);
            return;
          }
          setObjects(results);
        });
      }
    };

    if (imageSrc) {
      detectObjects();
    }
  }, [imageSrc]);

  useEffect(() => {
    if (objects.length > 0 && canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && imageRef.current) {
        canvas.width = imageRef.current.width;
        canvas.height = imageRef.current.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        objects.forEach((object) => {
          ctx.beginPath();
          ctx.rect(object.x, object.y, object.width, object.height);
          ctx.lineWidth = 2;
          ctx.strokeStyle = 'red';
          ctx.fillStyle = 'red';
          ctx.stroke();
          ctx.fillText(
            `${object.label} (${Math.round(object.confidence * 100)}%)`,
            object.x + 5,
            object.y > 10 ? object.y - 5 : 10
          );
        });
      }
    }
  }, [objects]);

  return (
    <div>
      <h1>Object Detection with ml5.js</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div style={{ position: 'relative' }}>
        {imageSrc && (
          <>
            <img
              ref={imageRef}
              src={imageSrc as string}
              alt="Uploaded"
              style={{ width: '500px' }}
            />
            <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
          </>
        )}
      </div>

      {objects.length > 0 && (
        <ul>
          {objects.map((object, index) => (
            <li key={index}>
              {object.label} - Confidence: {Math.round(object.confidence * 100)}%
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ObjectDetection;
