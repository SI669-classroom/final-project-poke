from flask import Flask, request, jsonify
import numpy as np
from io import BytesIO
from PIL import Image

app = Flask(__name__)

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Get the uploaded file
        file = request.files['image']
        img = Image.open(file)

        # Convert image to RGB
        img = img.convert('RGB')
        img_array = np.array(img)

        # Extract RGB array
        height, width, _ = img_array.shape
        # Convert RGB to grayscale
        gray_array = []
        for y in range(height):
            row = []
            for x in range(width):
                r, g, b = img_array[y, x]
                grayscale = int(0.3 * r + 0.59 * g + 0.11 * b)
                row.append(grayscale)
            gray_array.append(row)

        return jsonify(gray_array)
    except Exception as e:
        print('Error processing image:', e)
        return "Error processing image", 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
