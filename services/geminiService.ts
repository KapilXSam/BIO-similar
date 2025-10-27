// FIX: Provided full implementation for the gemini service.
import { GoogleGenAI, Chat, Type, GenerateContentResponse } from "@google/genai";
import { CATEGORY_DEFINITIONS } from '../constants';
import type { GroundingTool, GroundingChunk } from '../types';

// The API key is injected via environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

/**
 * Analyzes a single news article to categorize it, summarize it, and score its relevance.
 * @param title The title of the article.
 * @param content The full content of the article.
 * @param monitoredCompanies A list of companies to watch for.
 * @param monitoredKeywords A list of keywords to watch for.
 * @returns A structured analysis of the article.
 */
export async function summarizeAndCategorizeArticle(
    title: string,
    content: string,
    monitoredCompanies: string[],
    monitoredKeywords: string[]
) {
    const model = 'gemini-2.5-flash';
    const prompt = `
        Analyze the following news article text. The primary monitored companies are: [${monitoredCompanies.join(', ')}]. The primary monitored keywords are: [${monitoredKeywords.join(', ')}].

        Article Title: "${title}"
        Article Content:
        """
        ${content.substring(0, 4000)}
        """

        Based on the content, provide the following information in JSON format:
        1.  "summary": A concise, neutral, one-paragraph summary (3-5 sentences) focusing on the key event and its implications for the biosimilar market.
        2.  "category": Classify the article into ONE of the following categories.
        3.  "subCategory": Provide a more specific sub-category (2-4 words) that describes the main topic.
        4.  "relevanceScore": An integer from 1 (low relevance) to 10 (high relevance) indicating how important this news is for the biosimilar market, considering the monitored companies and keywords.
        5.  "confidenceScore": An integer from 1 (low confidence) to 10 (high confidence) on how certain you are about the categorization and relevance score.
        6.  "keywordsMatched": An array of up to 5 keywords from the monitored list that are most relevant to this article.

        Category Definitions:
        ${CATEGORY_DEFINITIONS}
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        category: { type: Type.STRING },
                        subCategory: { type: Type.STRING },
                        relevanceScore: { type: Type.NUMBER },
                        confidenceScore: { type: Type.NUMBER },
                        keywordsMatched: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                    },
                    required: ['summary', 'category', 'subCategory', 'relevanceScore', 'confidenceScore', 'keywordsMatched']
                },
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (error) {
        console.error("Error analyzing article with Gemini:", error);
        return {
            summary: "Could not analyze article due to an API error.",
            category: "Uncategorized",
            subCategory: "Error",
            relevanceScore: 0,
            confidenceScore: 0,
            keywordsMatched: [],
        };
    }
}

/**
 * Generates a high-level executive summary from a list of processed articles.
 * @param articles A list of articles with their titles and summaries.
 * @returns A string containing the executive summary.
 */
export async function generateReportSummary(articles: { title: string; summary: string | null }[]): Promise<string> {
    const model = 'gemini-2.5-flash';
    const articlesText = articles
        .map((a, i) => `${i + 1}. ${a.title}\nSummary: ${a.summary}`)
        .join('\n\n');

    const prompt = `
        You are a market analyst for a pharmaceutical company.
        Below is a list of today's top news articles related to the biosimilar market.
        Synthesize this information into a concise, high-level executive summary (3-4 bullet points) for a busy executive.
        Focus on the most significant market-moving events, trends, and strategic implications.

        News Articles:
        ${articlesText}

        Executive Summary:
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text;
}

/**
 * Creates and returns a new chat session instance.
 * @returns A Chat session object.
 */
export function getChatSession(): Chat {
    const model = 'gemini-flash-lite-latest';
    return ai.chats.create({
        model,
        config: {
            systemInstruction: 'You are Pharma-Intel AI, a helpful assistant specializing in the pharmaceutical and biosimilar industries. Answer questions concisely and accurately.'
        },
    });
}

/**
 * Analyzes an image with a given text prompt.
 * @param base64Image The base64-encoded image data.
 * @param mimeType The MIME type of the image.
 * @param prompt The user's question about the image.
 * @returns The model's text response.
 */
export async function analyzeImage(base64Image: string, mimeType: string, prompt: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType,
        },
    };
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
        model,
        contents: { parts: [imagePart, textPart] }
    });

    return response.text;
}

/**
 * Submits a complex query to a powerful model with thinking capabilities.
 * @param prompt The complex query.
 * @returns The model's detailed response.
 */
export async function getComplexQueryResponse(prompt: string): Promise<string> {
    const model = 'gemini-2.5-pro';
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 8192 }
        }
    });
    return response.text;
}

/**
 * Transcribes an audio file.
 * @param base64Audio The base64-encoded audio data.
 * @param mimeType The MIME type of the audio.
 * @returns The transcribed text.
 */
export async function transcribeAudio(base64Audio: string, mimeType: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    const audioPart = {
        inlineData: {
            data: base64Audio,
            mimeType: mimeType,
        },
    };
    const textPart = { text: "Transcribe the speech from this audio file." };

    try {
        const response = await ai.models.generateContent({
            model,
            contents: { parts: [audioPart, textPart] }
        });
        return response.text;
    } catch(e) {
        console.error("Audio transcription failed. This may be due to model limitations for this specific task.", e);
        if (e instanceof Error) {
             return `Transcription failed: ${e.message}`;
        }
        return "An unknown error occurred during transcription."
    }
}

/**
 * Gets a response from the model grounded on Google Search or Maps.
 * @param prompt The user's query.
 * @param tool The grounding tool to use ('googleSearch' or 'googleMaps').
 * @returns An object containing the text response and source chunks.
 */
export async function getGroundedResponse(prompt: string, tool: GroundingTool): Promise<{ text: string; chunks: GroundingChunk[] }> {
    const model = 'gemini-2.5-flash';
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            tools: [{ [tool]: {} }],
        },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    return {
        text: response.text,
        chunks,
    };
}

/**
 * Performs a general analysis on a block of freeform text.
 * @param content The text to analyze.
 * @returns A structured analysis from the model.
 */
export async function analyzeFreeformContent(content: string): Promise<string> {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
        Analyze the following text and provide a structured summary.
        Identify the key entities (companies, products, people), the main sentiment (positive, negative, neutral),
        and provide a one-paragraph summary of the core message.
        
        Content:
        """
        ${content}
        """

        Analysis:
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return response.text;
}
