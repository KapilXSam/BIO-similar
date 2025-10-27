import React, { useState, useRef } from 'react';
import { transcribeAudio } from '../services/geminiService';
import { blobToBase64 } from '../utils/helpers';
import { LoadingSpinner } from './common/LoadingSpinner';

export const AudioTranscriber: React.FC = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = handleStop;
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTranscript('');
            setError('');
        } catch (err) {
            setError("Microphone access was denied. Please enable it in your browser settings.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            // Stop all tracks to release the microphone
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleStop = async () => {
        setIsLoading(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        try {
            const base64Audio = await blobToBase64(audioBlob);
            const result = await transcribeAudio(base64Audio, 'audio/webm');
            setTranscript(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Transcription failed.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h3 className="text-lg font-semibold text-brand-blue mb-4">Voice Notes Transcriber (gemini-2.5-flash)</h3>
            <div className="flex items-center space-x-4">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`px-4 py-2 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center w-36 ${
                        isRecording ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-brand-lightblue hover:bg-brand-blue focus:ring-brand-lightblue'
                    }`}
                >
                    {isRecording ? (
                        <>
                            <span className="relative flex h-3 w-3 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            Stop
                        </>
                    ) : 'Start Recording'}
                </button>
                {(isRecording || isLoading) && <LoadingSpinner />}
            </div>
            
            {error && <p className="text-red-500 mt-4">{error}</p>}

            {transcript && (
                <div className="mt-6">
                    <h4 className="font-semibold text-brand-blue">Transcription:</h4>
                    <p className="mt-2 p-4 bg-gray-50 rounded-md border text-sm text-gray-800 whitespace-pre-wrap">{transcript}</p>
                </div>
            )}
        </div>
    );
};
