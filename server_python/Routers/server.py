from flask import Flask, request, jsonify, send_file,Blueprint
import numpy as np
from PIL import Image
import io
import tensorflow as tf
import jinja2
import base64
from sklearn.preprocessing import MinMaxScaler
from scipy import ndimage
import plotly.graph_objects as go
import matplotlib.pyplot as plt
from flask_cors import CORS
import uuid
from datetime import datetime

# app = Flask(__name__)
# CORS(app)

server = Blueprint('server',__name__)

model = tf.keras.models.load_model('PKL/model.h5')

@server.route('/analyze', methods=['POST'])
def analyze_image():
    file = request.files['image']
    img = Image.open(file.stream)
    
    img_array = np.array(img.resize((224, 224))) / 255.0
    prediction = model.predict(np.expand_dims(img_array, 0))[0][0]
    
    processed_img = load_and_preprocess(img)
    tumor_array, tumor_mask = extract_tumor(processed_img)
    fig_3d = create_3d_plot(processed_img, tumor_mask)
    
    plot_json = fig_3d.to_json()
    
    img_base64 = image_to_base64(processed_img)
    tumor_base64 = image_to_base64(tumor_array)
    
    return jsonify({
        'probability': float(prediction),
        'plot_3d': plot_json,
        'processed_image': img_base64,
        'tumor_image': tumor_base64
    })

@server.route('/generate-report', methods=['POST'])
def generate_report():
    data = request.json
    try:
        html_content = generate_html_report(
            data['patient_info'],
            data['tumor_info'],
            data['images']['original'],
            data['images']['tumor'],
            data['plot_3d']
        )
        return send_file(
            io.BytesIO(html_content.encode()),
            mimetype='text/html',
            as_attachment=True,
            download_name='report.html'
        )
    except KeyError as e:
        return jsonify({'error': f'Missing key in request data: {str(e)}'}), 400

def image_to_base64(img_array):
    img = Image.fromarray((img_array * 255).astype(np.uint8))
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    return base64.b64encode(buffered.getvalue()).decode()

def load_and_preprocess(image):
    img_array = np.array(image.convert('L'))
    img_array = ndimage.gaussian_filter(img_array, sigma=1.5)
    p2, p98 = np.percentile(img_array, (2, 98))
    img_array = np.clip(img_array, p2, p98)
    scaler = MinMaxScaler()
    img_array = scaler.fit_transform(img_array)
    return img_array

def extract_tumor(img_array, threshold=0.6):
    tumor_mask = img_array > threshold
    tumor_array = np.zeros_like(img_array)
    tumor_array[tumor_mask] = img_array[tumor_mask]
    return tumor_array, tumor_mask

def create_3d_plot(img_array, tumor_mask):
    x = np.arange(0, img_array.shape[1], 1)
    y = np.arange(0, img_array.shape[0], 1)
    x, y = np.meshgrid(x, y)
    img_array_colored = np.where(tumor_mask, img_array * 1.5, img_array)
    fig = go.Figure(data=[go.Surface(z=img_array_colored, x=x, y=y, colorscale='plasma')])
    fig.update_layout(
        title='3D MRI Scan Visualization with Tumor Highlighted',
        scene=dict(
            xaxis_title='X (pixels)', 
            yaxis_title='Y (pixels)', 
            zaxis_title='Intensity',
            bgcolor='rgb(240, 240, 240)'
        ),
        width=800, 
        height=700, 
        margin=dict(l=65, r=50, b=65, t=90)
    )
    return fig

def generate_html_report(patient_info, tumor_info, original_b64, tumor_b64, plot_3d_json):
    # Decode images from base64
    original_img = Image.open(io.BytesIO(base64.b64decode(original_b64)))
    tumor_img = Image.open(io.BytesIO(base64.b64decode(tumor_b64)))

    # Create comparison plot
    img_buffer = io.BytesIO()
    plt.figure(figsize=(12, 6))
    plt.subplot(121)
    plt.imshow(original_img, cmap='gray')
    plt.title('Original Image')
    plt.axis('off')
    plt.subplot(122)
    plt.imshow(tumor_img, cmap='gray')
    plt.title('Extracted Tumor')
    plt.axis('off')
    plt.savefig(img_buffer, format='png', bbox_inches='tight', pad_inches=0)
    plt.close()
    img_buffer.seek(0)
    img_base64 = base64.b64encode(img_buffer.getvalue()).decode()

    # Current date for the report
    current_date = datetime.now().strftime("%B %d, %Y")
    report_id = f"MRI-{str(uuid.uuid4())[:8].upper()}"
    
    # Format probability for display
    probability_percentage = f"{(tumor_info['probability'] * 100):.1f}%"
    
    # Determine severity level based on probability
    severity = "Low"
    severity_color = "#057a55"  # Green
    
    if tumor_info['probability'] > 0.7:
        severity = "High"
        severity_color = "#c81e1e"  # Red
    elif tumor_info['probability'] > 0.4:
        severity = "Medium"
        severity_color = "#c27803"  # Amber
    
    # Prepare template with Tailwind CSS
    template = jinja2.Template("""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Neurological Assessment Report</title>
        <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
        <script>
            tailwind.config = {
                theme: {
                    extend: {
                        colors: {
                            primary: {
                                50: '#f0f9ff',
                                100: '#e0f2fe',
                                200: '#bae6fd',
                                300: '#7dd3fc',
                                400: '#38bdf8',
                                500: '#0ea5e9',
                                600: '#0284c7',
                                700: '#0369a1',
                                800: '#075985',
                                900: '#0c4a6e',
                            }
                        }
                    }
                }
            }
        </script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
            body {
                font-family: 'Inter', sans-serif;
            }
            .plotly-graph-div {
                min-height: 500px;
            }
            @page {
                size: A4;
                margin: 0;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        </style>
    </head>
    <body class="bg-gray-50">
        <div class="min-h-screen flex flex-col">
            <!-- Header -->
            <header class="bg-white border-b border-gray-200 shadow-sm print:shadow-none">
                <div class="container mx-auto px-4 py-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center space-x-3">
                            <div class="text-primary-600">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h1 class="text-xl font-semibold text-gray-900">Medical Diagnostics Center</h1>
                                <p class="text-sm text-gray-500">Neurological Assessment Report</p>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-sm text-gray-700"><span class="font-medium">Report ID:</span> {{ report_id }}</p>
                            <p class="text-sm text-gray-700"><span class="font-medium">Date:</span> {{ current_date }}</p>
                        </div>
                    </div>
                </div>
            </header>

            <!-- Main Content -->
            <main class="flex-grow">
                <div class="container mx-auto px-4 py-8">
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <!-- Left Column: Patient Information -->
                        <div class="lg:col-span-1">
                            <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
                                <div class="border-b border-gray-200 px-4 py-3">
                                    <h2 class="text-lg font-medium text-gray-800">Patient Information</h2>
                                </div>
                                <div class="p-4">
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Full Name</p>
                                            <p class="font-medium text-gray-900">{{ patient_info.name }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Age</p>
                                            <p class="text-gray-900">{{ patient_info.age }} years</p>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Gender</p>
                                            <p class="text-gray-900">{{ patient_info.gender }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Examination</p>
                                            <p class="text-gray-900">Brain MRI Analysis</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="bg-white rounded-md shadow-sm overflow-hidden mb-6">
                                <div class="border-b border-gray-200 px-4 py-3">
                                    <h2 class="text-lg font-medium text-gray-800">Results Summary</h2>
                                </div>
                                <div class="p-4">
                                    <div class="space-y-3">
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Status</p>
                                            <div class="flex items-center mt-1">
                                                <div class="w-3 h-3 rounded-full {{ 'bg-red-500' if tumor_info.detected else 'bg-green-500' }} mr-2"></div>
                                                <p class="font-medium {{ 'text-red-600' if tumor_info.detected else 'text-green-600' }}">
                                                    {{ 'Anomaly Detected' if tumor_info.detected else 'No Anomaly Detected' }}
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Confidence Score</p>
                                            <p class="font-medium text-gray-900">{{ probability_percentage }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Severity Assessment</p>
                                            <p class="font-medium" style="color: {{ severity_color }}">{{ severity }}</p>
                                        </div>
                                        <div>
                                            <p class="text-xs uppercase font-medium text-gray-500">Recommendation</p>
                                            <p class="text-gray-900">{{ 'Immediate consultation recommended' if tumor_info.probability > 0.7 else ('Follow-up evaluation advised' if tumor_info.probability > 0.4 else 'Routine monitoring') }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Visualizations -->
                        <div class="lg:col-span-3 space-y-6">
                            <!-- Image Analysis -->
                            <div class="bg-white rounded-md shadow-sm overflow-hidden">
                                <div class="border-b border-gray-200 px-4 py-3">
                                    <h2 class="text-lg font-medium text-gray-800">Image Analysis</h2>
                                </div>
                                <div class="p-4">
                                    <img src="data:image/png;base64,{{ img_base64 }}" class="w-full h-auto rounded-md" alt="Brain scan comparison">
                                    <div class="grid grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <h3 class="text-sm font-medium text-gray-700">Original Processed Scan</h3>
                                            <p class="text-xs text-gray-500 mt-1">Preprocessed MRI scan with enhanced contrast for better visualization.</p>
                                        </div>
                                        <div>
                                            <h3 class="text-sm font-medium text-gray-700">Region of Interest</h3>
                                            <p class="text-xs text-gray-500 mt-1">Computer-identified potential anomalous region based on intensity patterns.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 3D Visualization -->
                            <div class="bg-white rounded-md shadow-sm overflow-hidden">
                                <div class="border-b border-gray-200 px-4 py-3">
                                    <h2 class="text-lg font-medium text-gray-800">3D Tissue Density Visualization</h2>
                                </div>
                                <div class="p-4">
                                    <div id="plotly-div" class="w-full rounded-md bg-gray-50" style="height: 500px;"></div>
                                    <p class="text-xs text-gray-500 mt-3">
                                        Three-dimensional representation of tissue density from MRI scan data. Suspected anomalous regions appear as elevated areas with distinct coloration. This interactive visualization can be rotated and zoomed for detailed examination.
                                    </p>
                                </div>
                            </div>
                            
                            <!-- Technical Details -->
                            <div class="bg-white rounded-md shadow-sm overflow-hidden">
                                <div class="border-b border-gray-200 px-4 py-3">
                                    <h2 class="text-lg font-medium text-gray-800">Technical Assessment</h2>
                                </div>
                                <div class="p-4">
                                    <div class="space-y-4">
                                        <div>
                                            <h3 class="text-sm font-medium text-gray-700">Analysis Methodology</h3>
                                            <p class="text-sm text-gray-600 mt-1">
                                                Deep learning neural network analysis combined with image segmentation techniques to identify potential anomalies in brain tissue. The system analyzes intensity patterns, structural features, and contextual information to detect irregularities.
                                            </p>
                                        </div>
                                        <div>
                                            <h3 class="text-sm font-medium text-gray-700">Confidence Assessment</h3>
                                            <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                                                <div class="rounded-full h-2" style="width: {{ probability_percentage }}; background-color: {{ severity_color }};"></div>
                                            </div>
                                            <div class="flex justify-between mt-1">
                                                <span class="text-xs text-gray-500">0%</span>
                                                <span class="text-xs text-gray-500">50%</span>
                                                <span class="text-xs text-gray-500">100%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Medical Advisory Section -->
                    <div class="mt-6">
                        <div class="bg-white rounded-md shadow-sm overflow-hidden">
                            <div class="border-b border-gray-200 px-4 py-3">
                                <h2 class="text-lg font-medium text-gray-800">Medical Advisory</h2>
                            </div>
                            <div class="p-4">
                                <div class="prose prose-sm max-w-none text-gray-600">
                                    <p>The analysis provided in this report is based on computational algorithms designed to assist medical professionals. These results should be interpreted by qualified healthcare providers in conjunction with clinical findings and other diagnostic procedures.</p>
                                    
                                    <p class="mt-3">{{ 'Based on the analysis, the presence of an abnormal mass is indicated with a high degree of confidence. Immediate consultation with a neurologist or neurosurgeon is strongly advised.' if tumor_info.probability > 0.7 else ('The analysis indicates possible anomalous tissue that requires further investigation. Consultation with a neurologist is recommended for additional assessment.' if tumor_info.probability > 0.4 else 'The analysis shows no significant abnormalities. Routine follow-up is advised as per standard clinical protocols.') }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Footer -->
            <footer class="bg-gray-100 border-t border-gray-200 mt-auto">
                <div class="container mx-auto px-4 py-6">
                    <div class="flex flex-col md:flex-row justify-between">
                        <div>
                            <p class="text-xs text-gray-600">Medical Diagnostics Center</p>
                            <p class="text-xs text-gray-500">Advanced Neuroimaging Department</p>
                        </div>
                        <div class="mt-4 md:mt-0">
                            <p class="text-xs text-gray-600">This report was generated using AI-assisted diagnostic tools</p>
                            <p class="text-xs text-gray-500">For clinical use under professional medical supervision only</p>
                        </div>
                    </div>
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <p class="text-xs text-gray-500 text-center">CONFIDENTIAL: This document contains protected health information. Unauthorized disclosure is prohibited.</p>
                    </div>
                </div>
            </footer>
        </div>

        <script>
            // Initialize Plotly with original layout settings
            var plotData = {{ plot_json|safe }};
            
            // Ensure proper sizing and background for the 3D plot
            plotData.layout.height = 500;
            plotData.layout.margin = {l: 0, r: 0, b: 0, t: 0, pad: 4};
            plotData.layout.paper_bgcolor = 'rgba(0,0,0,0)';
            plotData.layout.scene.bgcolor = 'rgb(240, 240, 240)';
            
            Plotly.newPlot('plotly-div', plotData.data, plotData.layout, {
                responsive: true,
                displayModeBar: true,
                modeBarButtonsToRemove: ['toImage', 'sendDataToCloud']
            });
            
            // Ensure proper rendering on window resize
            window.addEventListener('resize', function() {
                Plotly.relayout('plotly-div', {
                    'width': document.getElementById('plotly-div').offsetWidth
                });
            });
        </script>
    </body>
    </html>
    """)

    return template.render(
        patient_info=patient_info,
        tumor_info=tumor_info,
        img_base64=img_base64,
        plot_json=plot_3d_json,
        current_date=current_date,
        probability_percentage=probability_percentage,
        severity=severity,
        severity_color=severity_color,
        report_id=report_id
    )
