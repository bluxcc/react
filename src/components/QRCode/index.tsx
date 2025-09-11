import React from 'react';
import { QRCodeCanvas } from 'qrcode.react';

interface QRCodeCanvasProps {
  value: string;
  title?: string;
  size?: number;
  bgColor?: string;
  fgColor?: string;
  level?: 'L' | 'M' | 'Q' | 'H';
}

const QRCode = ({
  value,
  title = '',
  size = 184,
  bgColor = '#ffffff',
  fgColor = '#00020f',
  level = 'Q',
  ...rest
}: QRCodeCanvasProps) => {
  return (
    <div>
      <QRCodeCanvas
        className="bluxcc:z-10"
        value={value}
        title={title}
        size={size}
        bgColor={bgColor}
        fgColor={fgColor}
        level={level}
        marginSize={1}
        imageSettings={{
          src: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw8NDQ8NDQ0PDQ0PDw4NDw0NDQ8PDQ0NFREWFhURExUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0OFQ4PFSsdExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAKwBJgMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAIRABAQABBAAHAAAAAAAAAAAAAAERAiFhgSIxQVFxsfD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A7iAAACW8d+ygAAACSAoAAAAAAAAAAAAAAADOrVZZJptluLczwzFub9dtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmd/LtQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABLwoAAAAAQAAAAAAAAAAAAAAAAAABL+5UAAAAAAAAAAAEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoAAAAAAAAAJYCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAARQAAAAAAAAAAAAEwoAAAACSqAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAS59NvmZ2yoAAAAAAAAAAAAACAomFAAAAAAAABKoAAAAA//2Q==',
          x: undefined,
          y: undefined,
          height: 52,
          width: 52,
          opacity: 1,
          excavate: true,
        }}
        {...rest}
      />
    </div>
  );
};

export default QRCode;
