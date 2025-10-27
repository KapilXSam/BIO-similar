// FIX: Provided full implementation for the types file.
export interface AppStatus {
    message: string;
    progress: number;
}

export interface RawArticle {
    id: string;
    title: string;
    link: string;
    content: string;
    companyName: string;
}

export interface ProcessedArticle extends RawArticle {
    summary: string;
    category: string;
    subCategory: string;
    relevanceScore: number;
    confidenceScore: number;
    keywordsMatched: string[];
    status: 'Processed' | 'Archived';
}

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

export type GroundingTool = 'googleSearch' | 'googleMaps';

export interface GroundingChunkSource {
    uri: string;
    title: string;
}

export interface GroundingChunk {
    web?: GroundingChunkSource;
    maps?: GroundingChunkSource;
}
