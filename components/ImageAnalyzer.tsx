import React, { useState } from 'react';
import { analyzeImage } from '../services/geminiService';
import { blobToBase64 } from '../utils/helpers';
import { LoadingSpinner } from './common/LoadingSpinner';

export const ImageAnalyzer: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [prompt, setPrompt] = useState('What does this image show?');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
            setResult('');
            setError('');
        }
    };

    const handleSubmit = async () => {
        if (!imageFile || !prompt.trim()) {
            setError('Please select an image and enter a prompt.');
            return;
        }
        setIsLoading(true);
        setResult('');
        setError('');
        try {
            const base64Image = await blobToBase64(imageFile);
            const analysis = await analyzeImage(base64Image, imageFile.type, prompt);
            setResult(analysis);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Image Analyzer (gemini-2.5-flash)</h3>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                    <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-brand-blue hover:file:bg-blue-100"/>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 rounded-lg shadow-md max-h-60 w-auto" />}
                </div>
                <div>
                    <label htmlFor="image-prompt" className="block text-sm font-medium text-gray-700 mb-2">Your Question</label>
                    <textarea id="image-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-brand-lightblue focus:border-brand-lightblue" />
                    <button onClick={handleSubmit} disabled={isLoading || !imageFile} className="mt-2 w-full px-4 py-2 bg-brand-lightblue text-white rounded-md hover:bg-brand-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-lightblue disabled:bg-gray-400 flex items-center justify-center">
                        {isLoading && <LoadingSpinner className="h-5 w-5 mr-2 text-white" />}
                        Analyze Image
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {result && (
                <div className="mt-6">
                    <h4 className="font-semibold text-brand-blue">Analysis Result:</h4>
                    <p className="mt-2 p-4 bg-gray-50 rounded-md border text-sm text-gray-800 whitespace-pre-wrap">{result}</p>
                </div>
            )}
        </div>
    );
};
