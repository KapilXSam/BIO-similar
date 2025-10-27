// FIX: Provided full implementation for the processing service.
import { summarizeAndCategorizeArticle } from './geminiService';
import type { ProcessedArticle, RawArticle, AppStatus } from '../types';

// Mock news data since there is no live feed provided for this exercise.
const mockNewsData: RawArticle[] = [
    {
        id: '1',
        title: 'Celltrion files for EU approval of its Stelara biosimilar',
        link: 'https://www.thepharmaletter.com/article/celltrion-files-for-eu-approval-of-its-stelara-biosimilar',
        content: 'South Korean drugmaker Celltrion has submitted a marketing authorization application to the European Medicines Agency for CT-P43, a biosimilar of Johnson & Johnson’s blockbuster immunology drug Stelara (ustekinumab). The filing is based on results from a global Phase III clinical trial designed to evaluate the efficacy and safety of CT-P43 in patients with plaque psoriasis. Stelara is used to treat a range of inflammatory conditions and generated sales of $9.1 billion in 2022.',
        companyName: 'Celltrion'
    },
    {
        id: '2',
        title: 'Amgen’s Amjevita, first Humira biosimilar, launches in US at two different price points',
        link: 'https://www.statnews.com/2023/01/31/amgen-humira-biosimilar-amjevita-launch/',
        content: 'Amgen on Tuesday launched the first U.S. biosimilar of AbbVie’s rheumatoid arthritis drug Humira, one of the best-selling medicines of all time. The biosimilar, called Amjevita, will be sold at two different price points — one at a 5% discount to Humira’s list price and another at a 55% discount. The dual-pricing strategy is aimed at navigating the complex U.S. system of pharmacy benefit managers and insurance coverage to gain market access.',
        companyName: 'Amgen'
    },
    {
        id: '3',
        title: 'FDA Approves Pfizer’s Tofacitinib Extended-Release Tablets for Ulcerative Colitis',
        link: 'https://www.pfizer.com/news/press-release/press-release-detail/u-s-fda-approves-pfizers-xeljanz-xr-tofacitinib-extended-release-tablets-treatment-ulcerative-colitis',
        content: 'Pfizer Inc. announced that the U.S. Food and Drug Administration (FDA) has approved XELJANZ XR (tofacitinib) extended-release 11 mg and 22 mg tablets for the once-daily treatment of adult patients with moderately to severely active ulcerative colitis (UC). This approval provides a new treatment option for patients. While not a biosimilar, this news is relevant to the inflammatory disease space where many biosimilars compete.',
        companyName: 'Pfizer'
    },
    {
        id: '4',
        title: 'Samsung Bioepis and Organon Announce FDA Approval of Hadlima High-Concentration Formulation',
        link: 'https://www.businesswire.com/news/home/20220817005436/en/Samsung-Bioepis-and-Organon-Announce-FDA-Approval-of-HADLIMA%E2%84%A2-adalimumab-bwwd-a-Biosimilar-to-Humira-in-High-Concentration-Formulation',
        content: 'Samsung Bioepis Co., Ltd. and Organon & Co. today announced that the U.S. Food and Drug Administration (FDA) has approved HADLIMA™ (adalimumab-bwwd), a biosimilar to Humira (adalimumab), in a high-concentration (100 mg/mL) formulation. This new formulation offers a reduced injection volume for patients.',
        companyName: 'Samsung Bioepis'
    },
    {
        id: '5',
        title: 'Quarterly Earnings Report for AstraZeneca Shows Strong Growth in Oncology Portfolio',
        link: 'https://www.astrazeneca.com/media-centre/press-releases/2023/q4-2022-results.html',
        content: 'AstraZeneca released its financial results for the fourth quarter of 2022, highlighting robust growth driven by its oncology and CVRM (Cardiovascular, Renal & Metabolism) portfolios. The company also discussed its pipeline, including several late-stage clinical trials. While the report does not focus on biosimilars, it provides key insights into a major competitor\'s financial health and strategic focus.',
        companyName: 'AstraZeneca'
    },
];


/**
 * Simulates network latency.
 * @returns A promise that resolves after a short delay.
 */
function simulateApiLatency() {
    return new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
}

/**
 * Fetches, processes, and analyzes news articles.
 * @param monitoredCompanies A list of companies to focus on.
 * @param monitoredKeywords A list of keywords to focus on.
 * @param setStatus A callback function to update the UI with progress.
 * @returns A promise that resolves to a list of processed articles, sorted by relevance.
 */
export const processNewsFeed = async (
    monitoredCompanies: string[],
    monitoredKeywords: string[],
    setStatus: (status: AppStatus) => void
): Promise<ProcessedArticle[]> => {

    const articlesToProcess = mockNewsData;
    const totalArticles = articlesToProcess.length;
    const processedArticles: ProcessedArticle[] = [];

    setStatus({ message: 'Starting news feed processing...', progress: 0 });

    for (let i = 0; i < totalArticles; i++) {
        const article = articlesToProcess[i];
        const progress = Math.round(((i) / totalArticles) * 100);
        setStatus({
            message: `Analyzing article ${i + 1} of ${totalArticles}: "${article.title}"`,
            progress: progress,
        });

        // Simulate network latency for fetching full text etc.
        await simulateApiLatency();

        try {
            const analysis = await summarizeAndCategorizeArticle(
                article.title,
                article.content,
                monitoredCompanies,
                monitoredKeywords
            );

            processedArticles.push({
                ...article,
                ...analysis,
                status: 'Processed'
            });
        } catch (error) {
            console.error(`Failed to process article ${article.id}:`, error);
        }
    }

    setStatus({ message: 'Processing complete. All articles analyzed.', progress: 100 });
    
    // Sort by relevance score descending
    return processedArticles.sort((a, b) => b.relevanceScore - a.relevanceScore);
};
